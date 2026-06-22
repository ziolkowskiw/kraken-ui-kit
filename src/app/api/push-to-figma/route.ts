import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const FILE_KEY = "es0hWOiLEplsUrpR3EkBOK";
const FIGMA_API = "https://api.figma.com/v1";
const SEM_COLLECTION_ID = "VariableCollectionId:68:263";

type DtcgNode = Record<string, unknown>;
interface TokenEntry {
  variableId: string;
  type: string;
}

function dsVar(path: string) {
  return `--ds-${path.replace(/\//g, "-").toLowerCase()}`;
}

function walkDtcg(
  node: DtcgNode,
  path: string[],
  into: Map<string, TokenEntry>,
) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    const vobj = v as DtcgNode;
    if (typeof vobj !== "object" || vobj === null) continue;
    if ("$type" in vobj) {
      const ext = (
        vobj.$extensions as Record<string, Record<string, string>> | undefined
      )?.["figma-console-mcp"];
      if (ext?.variableId) {
        into.set(dsVar([...path, k].join("/")), {
          variableId: ext.variableId,
          type: vobj.$type as string,
        });
      }
    } else {
      walkDtcg(vobj, [...path, k], into);
    }
  }
}

function buildLookups() {
  const dtcg = JSON.parse(
    readFileSync(join(process.cwd(), "tokens/tokens.dtcg.json"), "utf8"),
  ) as DtcgNode;
  const semMap = new Map<string, TokenEntry>();
  const primMap = new Map<string, TokenEntry>();
  walkDtcg(dtcg.semantic as DtcgNode, [], semMap);
  walkDtcg(dtcg.global as DtcgNode, [], primMap);
  return { semMap, primMap };
}

interface FigmaCollection {
  modes: { modeId: string; name: string }[];
}
interface FigmaVariablesResponse {
  meta: {
    variableCollections: Record<string, FigmaCollection>;
  };
}

async function getModeId(
  modeName: string,
  pat: string,
): Promise<string | null> {
  const res = await fetch(
    `${FIGMA_API}/files/${FILE_KEY}/variables/local`,
    { headers: { "X-Figma-Token": pat } },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  const data = (await res.json()) as FigmaVariablesResponse;
  const coll = data.meta.variableCollections[SEM_COLLECTION_ID];
  if (!coll) return null;
  return (
    coll.modes.find(
      (m) => m.name.toLowerCase() === modeName.toLowerCase(),
    )?.modeId ?? null
  );
}

function figmaResolvedType(dtcgType: string): string {
  if (dtcgType === "color") return "COLOR";
  if (dtcgType === "string") return "STRING";
  if (dtcgType === "boolean") return "BOOLEAN";
  return "FLOAT"; // dimension, number, …
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    overrides?: Record<string, string>;
    targetMode?: string;
    pat?: string;
  };

  const pat = body.pat ?? process.env.FIGMA_PAT ?? "";
  if (!pat) {
    return NextResponse.json(
      { error: "Figma PAT required. Pass {pat} in the request body or set FIGMA_PAT env var." },
      { status: 401 },
    );
  }

  const overrides = body.overrides ?? {};
  const targetMode = body.targetMode ?? "jit";

  if (!Object.keys(overrides).length) {
    return NextResponse.json({ pushed: 0, skipped: 0 });
  }

  let semMap: Map<string, TokenEntry>;
  let primMap: Map<string, TokenEntry>;
  try {
    ({ semMap, primMap } = buildLookups());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  let modeId: string | null;
  try {
    modeId = await getModeId(targetMode, pat);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
  if (!modeId) {
    return NextResponse.json(
      { error: `Mode "${targetMode}" not found in semantic collection.` },
      { status: 404 },
    );
  }

  type FigmaVariableUpdate = {
    action: "UPDATE";
    id: string;
    resolvedDataType: string;
    valuesByMode: Record<string, { type: "VARIABLE_ALIAS"; id: string }>;
  };

  const variables: FigmaVariableUpdate[] = [];
  const skipped: string[] = [];

  for (const [semDs, primDs] of Object.entries(overrides)) {
    const sem = semMap.get(semDs);
    const prim = primMap.get(primDs);
    if (!sem || !prim) {
      skipped.push(semDs);
      continue;
    }
    variables.push({
      action: "UPDATE",
      id: sem.variableId,
      resolvedDataType: figmaResolvedType(sem.type),
      valuesByMode: {
        [modeId]: { type: "VARIABLE_ALIAS", id: prim.variableId },
      },
    });
  }

  if (!variables.length) {
    return NextResponse.json({ pushed: 0, skipped: skipped.length });
  }

  const res = await fetch(`${FIGMA_API}/files/${FILE_KEY}/variables`, {
    method: "POST",
    headers: {
      "X-Figma-Token": pat,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ variables }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    return NextResponse.json(
      { error: `Figma API ${res.status}: ${errBody}` },
      { status: res.status },
    );
  }

  return NextResponse.json({ pushed: variables.length, skipped: skipped.length });
}
