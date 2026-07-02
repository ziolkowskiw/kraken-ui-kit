"use client";

/* The design-step registry for the theme designer: an importance-ordered list
 * of steps (Button first, Charts last), each pairing a live specimen — the
 * component's variant matrix rendered with real kit components — with the token
 * groups / files that scope the editor's token panel to that component.
 * Layout chrome inside specimens stays neutral (Tailwind grays) so only the
 * kit components themselves respond to token edits. */

import * as React from "react";
import {
  Bell,
  Bold,
  Calendar as CalendarIcon,
  Check,
  ChevronRight,
  Home,
  Inbox,
  Italic,
  Plus,
  Search as SearchIcon,
  Settings,
  Trash2,
  Underline,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxButton } from "@/components/ui/checkbox-button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputField } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RadioButton, RadioButtonGroup } from "@/components/ui/radio-button";
import { SearchField } from "@/components/ui/search";
import { SelectField, SelectItem } from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast, Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea, TextareaField } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DashboardPreview } from "@/components/theme-editor/dashboard-preview";

export type DesignStep = {
  slug: string;
  label: string;
  section: string;
  description: string;
  /** Layer-3 token groups shown in the token panel. */
  groups?: string[];
  /** ui/ file slugs whose directly-consumed semantic tokens are shown. */
  files?: string[];
  /** whole semantic majors to include (foundations, charts). */
  semanticMajors?: string[];
  render: () => React.ReactNode;
};

/* specimen scaffolding — neutral chrome, never kit tokens */
function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{label}</div>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

const BUTTON_VARIANTS = ["primary", "secondary", "tonal", "ghost", "destructive", "destructive-secondary", "destructive-ghost"] as const;
const BADGE_COLORS = ["neutral", "brand", "green", "red", "orange", "amber", "blue", "purple"] as const;

function ButtonSpecimen() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Variants">
        {BUTTON_VARIANTS.map((v) => (
          <Button key={v} variant={v}>{v}</Button>
        ))}
      </Row>
      <Row label="Sizes">
        {(["xs", "sm", "md", "lg"] as const).map((s) => (
          <Button key={s} size={s}>Size {s}</Button>
        ))}
        <Button iconOnly leftIcon={<Plus />} aria-label="Add" />
      </Row>
      <Row label="With icons">
        <Button leftIcon={<Plus />}>Create</Button>
        <Button variant="secondary" rightIcon={<ChevronRight />}>Continue</Button>
        <Button variant="destructive" leftIcon={<Trash2 />}>Delete</Button>
      </Row>
      <Row label="Disabled">
        {(["primary", "secondary", "tonal", "destructive"] as const).map((v) => (
          <Button key={v} variant={v} disabled>{v}</Button>
        ))}
      </Row>
    </div>
  );
}

function InputSpecimen() {
  return (
    <div className="grid max-w-xl gap-5">
      <InputField label="Label" placeholder="Placeholder" description="Helper text below the field." />
      <InputField label="Mandatory" placeholder="Required field" mandatory />
      <InputField label="With decorations" placeholder="Search…" leftDecoration={<SearchIcon />} />
      <InputField label="Error" placeholder="Invalid value" error errorMessage="This field is required." />
      <InputField label="Disabled" placeholder="Can't touch this" disabled />
      <div className="grid grid-cols-3 items-end gap-3">
        {(["sm", "md", "lg"] as const).map((s) => (
          <InputField key={s} size={s} label={`Size ${s}`} placeholder={s} />
        ))}
      </div>
    </div>
  );
}

function TextareaSpecimen() {
  return (
    <div className="grid max-w-xl gap-5">
      <TextareaField label="Message" placeholder="Write something…" description="Markdown supported." />
      <TextareaField label="Error" placeholder="Too short" error errorMessage="Message must be longer." />
      <Textarea placeholder="Bare textarea" disabled />
    </div>
  );
}

function SelectSpecimen() {
  const items = ["Apple", "Banana", "Cherry"];
  return (
    <div className="grid max-w-md gap-5">
      {(["sm", "md", "lg"] as const).map((s) => (
        <SelectField key={s} size={s} label={`Size ${s}`} placeholder="Pick a fruit">
          {items.map((i) => (
            <SelectItem key={i} value={i.toLowerCase()}>{i}</SelectItem>
          ))}
        </SelectField>
      ))}
      <SelectField label="Error" placeholder="Pick one" error errorMessage="Selection is required.">
        {items.map((i) => (
          <SelectItem key={i} value={i.toLowerCase()}>{i}</SelectItem>
        ))}
      </SelectField>
    </div>
  );
}

function CheckboxSpecimen() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="States">
        <label className="flex items-center gap-2 text-sm"><Checkbox /> Rest</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Checked</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox indeterminate /> Indeterminate</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox error /> Error</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox disabled /> Disabled</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox disabled defaultChecked /> Disabled checked</label>
      </Row>
      <Row label="Checkbox button">
        <CheckboxButton label="Option A" defaultChecked />
        <CheckboxButton label="Option B" />
        <CheckboxButton label="Disabled" disabled />
      </Row>
    </div>
  );
}

function RadioSpecimen() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Radio group">
        <RadioGroup defaultValue="a" className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="a" /> Selected</label>
          <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="b" /> Rest</label>
          <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="c" disabled /> Disabled</label>
        </RadioGroup>
      </Row>
      <Row label="Radio button">
        <RadioButtonGroup defaultValue="a" aria-label="Plan" className="w-80">
          <RadioButton value="a" label="Plan A" secondLineLabel="Selected" />
          <RadioButton value="b" label="Plan B" secondLineLabel="Rest" />
        </RadioButtonGroup>
      </Row>
    </div>
  );
}

function SwitchSpecimen() {
  return (
    <Row label="States">
      <Switch aria-label="Off" />
      <Switch defaultChecked aria-label="On" />
      <Switch size="compact" aria-label="Compact" />
      <Switch size="compact" defaultChecked aria-label="Compact on" />
      <Switch disabled aria-label="Disabled" />
      <Switch disabled defaultChecked aria-label="Disabled on" />
    </Row>
  );
}

function SliderSpecimen() {
  return (
    <div className="grid max-w-md gap-6">
      <Slider defaultValue={40} aria-label="Value" />
      <Slider defaultValue={[20, 60]} aria-label="Range" />
      <Slider defaultValue={70} disabled aria-label="Disabled" />
    </div>
  );
}

function BadgeSpecimen() {
  return (
    <div className="flex flex-col gap-6">
      {(["filled", "outlined", "ghost"] as const).map((appearance) => (
        <Row key={appearance} label={appearance}>
          {BADGE_COLORS.map((c) => (
            <Badge key={c} color={c} appearance={appearance}>{c}</Badge>
          ))}
        </Row>
      ))}
      <Row label="Sizes / shapes">
        <Badge size="sm">sm</Badge>
        <Badge size="md">md</Badge>
        <Badge size="lg">lg</Badge>
        <Badge shape="square">square</Badge>
        <Badge leftIcon={<Check />}>with icon</Badge>
      </Row>
    </div>
  );
}

function AlertSpecimen() {
  return (
    <div className="grid max-w-xl gap-4">
      {(["neutral", "informational", "success", "warning", "error"] as const).map((type) => (
        <Alert key={type} type={type}>
          <AlertTitle>{type[0].toUpperCase() + type.slice(1)} alert</AlertTitle>
          <AlertDescription>Something happened that you should know about.</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

function CardSpecimen() {
  return (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Default card with the full anatomy.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">Body content sits on the card surface token.</CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">Save</Button>
          <Button size="sm" variant="ghost">Cancel</Button>
        </CardFooter>
      </Card>
      <Card filled>
        <CardHeader>
          <CardTitle>Filled card</CardTitle>
          <CardDescription>The filled variant uses the muted surface.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">Compare border, fill and radius here.</CardContent>
      </Card>
    </div>
  );
}

function TabsSpecimen() {
  return (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue="one" className="w-96">
        <TabsList>
          {["one", "two", "three"].map((v) => (
            <TabsTrigger key={v} value={v}>Tab {v}</TabsTrigger>
          ))}
        </TabsList>
        {["one", "two", "three"].map((v) => (
          <TabsContent key={v} value={v} className="pt-3 text-sm">Panel {v} content.</TabsContent>
        ))}
      </Tabs>
      <Tabs defaultValue="one" className="w-96">
        <TabsList variant="badge">
          {["one", "two", "three"].map((v) => (
            <TabsTrigger key={v} value={v}>Badge {v}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

function DialogSpecimen() {
  return (
    <Row label="Open the dialog to style the overlay & popup">
      <Dialog>
        <DialogTrigger render={<Button>Open dialog</Button>} />
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
          </DialogHeader>
          <p className="text-sm">Popup surface, overlay and radius come from the popover/overlay tokens.</p>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary">Cancel</Button>} />
            <DialogClose render={<Button>Confirm</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Row>
  );
}

function MenuSpecimen() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Dropdown menu (open it)">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="secondary">Open menu</Button>} />
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Settings /> Settings <DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuItem><Bell /> Notifications</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive"><Trash2 /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>
      <Row label="Command palette">
        <Command className="w-80 rounded-lg border [border-color:var(--ds-color-border)]">
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              <CommandGroupLabel>Suggestions</CommandGroupLabel>
              <CommandItem><CalendarIcon className="size-4" /> Calendar <CommandShortcut>⌘C</CommandShortcut></CommandItem>
              <CommandItem><SearchIcon className="size-4" /> Search</CommandItem>
              <CommandItem><Settings className="size-4" /> Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Row>
    </div>
  );
}

function OverlaySpecimen() {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-8 pt-10">
        <Row label="Tooltip (always open)">
          <Tooltip defaultOpen>
            <TooltipTrigger render={<Button variant="ghost" size="sm" />}>Hover me</TooltipTrigger>
            <TooltipContent side="top">Tooltip surface & content tokens</TooltipContent>
          </Tooltip>
        </Row>
        <Row label="Popover (open it)">
          <Popover>
            <PopoverTrigger render={<Button variant="secondary">Open popover</Button>} />
            <PopoverContent className="w-64 text-sm">Popover surface uses the popover tokens.</PopoverContent>
          </Popover>
        </Row>
      </div>
    </TooltipProvider>
  );
}

function AvatarSpecimen() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Sizes">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
          <Avatar key={s} size={s} fallback="WZ" />
        ))}
      </Row>
      <Row label="Roundness / stack">
        <Avatar roundness="square" fallback="SQ" />
        <AvatarStack>
          <Avatar fallback="AB" />
          <Avatar fallback="CD" />
          <Avatar fallback="EF" />
        </AvatarStack>
      </Row>
    </div>
  );
}

function TableSpecimen() {
  const rows = [
    { id: "#1042", name: "Ada Lovelace", status: "Paid", amount: "$320.00" },
    { id: "#1041", name: "Alan Turing", status: "Pending", amount: "$150.00" },
    { id: "#1040", name: "Grace Hopper", status: "Refunded", amount: "$540.00" },
  ];
  return (
    <Table className="max-w-2xl">
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.id}</TableCell>
            <TableCell>{r.name}</TableCell>
            <TableCell>
              <Badge color={r.status === "Paid" ? "green" : r.status === "Pending" ? "amber" : "red"} appearance="outlined">
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{r.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AccordionSpecimen() {
  return (
    <Accordion className="w-96">
      {["First section", "Second section", "Third section"].map((t, i) => (
        <AccordionItem key={t} value={t}>
          <AccordionTrigger>{t}</AccordionTrigger>
          <AccordionContent>Content of section {i + 1} — border, trigger and content tokens.</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function NavigationSpecimen() {
  return (
    <div className="flex flex-col gap-8">
      <Row label="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#"><Home className="size-3.5" /> Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">Products</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Detail</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Row>
      <Row label="Pagination">
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            {[1, 2, 3].map((p) => (
              <PaginationItem key={p}><PaginationLink href="#" isActive={p === 2}>{p}</PaginationLink></PaginationItem>
            ))}
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </Row>
      <Row label="Links">
        <Link href="#">Default link</Link>
        <Link href="#" variant="destructive">Destructive link</Link>
      </Row>
    </div>
  );
}

function ToggleSpecimen() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Toggle">
        <Toggle aria-label="Bold"><Bold /></Toggle>
        <Toggle defaultPressed aria-label="Italic"><Italic /></Toggle>
        <Toggle variant="outline" aria-label="Underline"><Underline /></Toggle>
        <Toggle disabled aria-label="Disabled"><Bold /></Toggle>
      </Row>
      <Row label="Toggle group">
        <ToggleGroup defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline"><Underline /></ToggleGroupItem>
        </ToggleGroup>
      </Row>
      <Row label="Button group">
        <ButtonGroup>
          <Button variant="secondary" size="sm">Left</Button>
          <Button variant="secondary" size="sm">Center</Button>
          <Button variant="secondary" size="sm">Right</Button>
        </ButtonGroup>
      </Row>
    </div>
  );
}

function FeedbackSpecimen() {
  const [value, setValue] = React.useState(64);
  return (
    <div className="grid max-w-md gap-8">
      <Row label="Progress">
        <div className="w-80"><Progress value={value} /></div>
        <Button size="xs" variant="secondary" onClick={() => setValue((v) => (v + 12) % 100)}>Bump</Button>
      </Row>
      <Row label="Skeleton">
        <div className="flex w-72 items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </Row>
      <Row label="Toast">
        <Button variant="secondary" onClick={() => toast.success("Saved", { description: "Theme changes stored." })}>
          Fire toast
        </Button>
        <Toaster />
      </Row>
    </div>
  );
}

function SearchSpecimen() {
  return (
    <div className="grid max-w-md gap-5">
      <SearchField label="Search" placeholder="Search components…" />
      <SearchField label="Error" placeholder="No results" state="error" />
    </div>
  );
}

function SidebarSpecimen() {
  const items = [
    { title: "Home", icon: Home, active: true },
    { title: "Inbox", icon: Inbox, active: false },
    { title: "Settings", icon: Settings, active: false },
  ];
  return (
    <div className="flex gap-6">
      {[false, true].map((collapsed) => (
        <div key={String(collapsed)} className="flex h-80 overflow-hidden rounded-lg border border-neutral-200">
          <Sidebar collapsed={collapsed}>
            <SidebarHeader>
              <div className="flex size-8 items-center justify-center rounded-md font-semibold [background-color:var(--ds-sidebar-primary)] [color:var(--ds-sidebar-primaryforeground)]">K</div>
              {!collapsed && <span className="font-medium">Kraken</span>}
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={item.active}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>
      ))}
    </div>
  );
}

function CalendarSpecimen() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border [border-color:var(--ds-color-border)]"
    />
  );
}

function ChartsSpecimen() {
  const bars = [62, 84, 45, 96, 70];
  return (
    <div className="flex flex-col gap-6">
      <Row label="Chart palette">
        {bars.map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="size-10 rounded-md" style={{ background: `var(--ds-chart-color-${i + 1})` }} />
            <code className="text-[10px] text-neutral-400">chart-{i + 1}</code>
          </div>
        ))}
      </Row>
      <Row label="Sample bar chart">
        <div className="flex h-40 items-end gap-4 rounded-lg border border-neutral-200 p-4">
          {bars.map((h, i) => (
            <div key={i} className="w-10 rounded-t-md" style={{ height: `${h}%`, background: `var(--ds-chart-color-${i + 1})` }} />
          ))}
        </div>
      </Row>
      <Row label="Legend">
        {bars.map((_, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs text-neutral-600">
            <span className="size-2.5 rounded-full" style={{ background: `var(--ds-chart-color-${i + 1})` }} />
            Series {i + 1}
          </span>
        ))}
      </Row>
    </div>
  );
}

function FoundationsSpecimen() {
  const swatches = [
    ["background", "--ds-color-background"],
    ["foreground", "--ds-color-foreground"],
    ["primary", "--ds-color-primary"],
    ["primary-fg", "--ds-color-primary-foreground"],
    ["secondary", "--ds-color-secondary"],
    ["muted", "--ds-color-muted"],
    ["muted-fg", "--ds-color-muted-foreground"],
    ["border", "--ds-color-border"],
    ["destructive", "--ds-color-destructive"],
  ] as const;
  return (
    <div className="flex flex-col gap-6">
      <Row label="Core semantic colors">
        {swatches.map(([name, v]) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <span className="size-10 rounded-md border border-neutral-200" style={{ background: `var(${v})` }} />
            <code className="text-[10px] text-neutral-400">{name}</code>
          </div>
        ))}
      </Row>
      <Row label="Type scale">
        <div className="flex flex-col gap-1">
          <span style={{ font: "var(--ds-typography-headinglg-fontweight) var(--ds-typography-headinglg-fontsize)/var(--ds-typography-headinglg-lineheight) var(--ds-typography-headinglg-fontfamily)" }}>Heading large</span>
          <span style={{ font: "var(--ds-typography-headingmd-fontweight) var(--ds-typography-headingmd-fontsize)/var(--ds-typography-headingmd-lineheight) var(--ds-typography-headingmd-fontfamily)" }}>Heading medium</span>
          <span style={{ font: "var(--ds-typography-bodymd-fontweight) var(--ds-typography-bodymd-fontsize)/var(--ds-typography-bodymd-lineheight) var(--ds-typography-bodymd-fontfamily)" }}>Body medium — the default paragraph style.</span>
          <span style={{ font: "var(--ds-typography-labelsm-fontweight) var(--ds-typography-labelsm-fontsize)/var(--ds-typography-labelsm-lineheight) var(--ds-typography-labelsm-fontfamily)" }}>Label small</span>
        </div>
      </Row>
      <Row label="Radius scale">
        {(["sm", "md", "lg", "xl"] as const).map((r) => (
          <div key={r} className="flex flex-col items-center gap-1.5">
            <span className="size-10 border-2 border-neutral-300 bg-neutral-100" style={{ borderRadius: `var(--ds-radius-${r})` }} />
            <code className="text-[10px] text-neutral-400">{r}</code>
          </div>
        ))}
      </Row>
    </div>
  );
}

/* The flow: most-important first (button), least-important last (charts),
 * with an everything-at-once review at the end. */
export const DESIGN_STEPS: DesignStep[] = [
  {
    slug: "foundations",
    label: "Foundations",
    section: "Start here",
    description: "The shared semantic base every component aliases: core colors, type, spacing, radius. Set the broad strokes here, then refine per component.",
    semanticMajors: ["color", "typography", "spacing", "radius", "borderWidth"],
    render: () => <FoundationsSpecimen />,
  },
  {
    slug: "button",
    label: "Button",
    section: "Components",
    description: "The most-used component. Its Layer-3 tokens cover fill/content/border per variant and the size scale.",
    groups: ["button"],
    files: ["button"],
    render: () => <ButtonSpecimen />,
  },
  {
    slug: "input",
    label: "Input",
    section: "Components",
    description: "Text fields: label, placeholder, decorations, error and disabled states.",
    groups: ["input"],
    files: ["input"],
    render: () => <InputSpecimen />,
  },
  {
    slug: "select",
    label: "Select",
    section: "Components",
    description: "Dropdown fields share the input surface plus the menu-item tokens.",
    groups: ["select", "menuItem"],
    files: ["select"],
    render: () => <SelectSpecimen />,
  },
  {
    slug: "checkbox",
    label: "Checkbox",
    section: "Components",
    description: "Checkbox states and the checkbox-button extension.",
    groups: ["checkbox", "chip"],
    files: ["checkbox", "checkbox-button"],
    render: () => <CheckboxSpecimen />,
  },
  {
    slug: "radio",
    label: "Radio",
    section: "Components",
    description: "Radio group states and the radio-button extension.",
    groups: ["radio", "chip"],
    files: ["radio-group", "radio-button"],
    render: () => <RadioSpecimen />,
  },
  {
    slug: "switch",
    label: "Switch",
    section: "Components",
    description: "On/off states in both sizes.",
    files: ["switch"],
    render: () => <SwitchSpecimen />,
  },
  {
    slug: "textarea",
    label: "Textarea",
    section: "Components",
    description: "Multi-line input; shares the input token group.",
    groups: ["input"],
    files: ["textarea"],
    render: () => <TextareaSpecimen />,
  },
  {
    slug: "search",
    label: "Search",
    section: "Components",
    description: "The search field extension over input tokens.",
    groups: ["input"],
    files: ["search"],
    render: () => <SearchSpecimen />,
  },
  {
    slug: "slider",
    label: "Slider",
    section: "Components",
    description: "Track, indicator and thumb.",
    files: ["slider"],
    render: () => <SliderSpecimen />,
  },
  {
    slug: "badge",
    label: "Badge",
    section: "Components",
    description: "8 colors × 3 appearances plus sizes and shapes.",
    groups: ["badge"],
    files: ["badge"],
    render: () => <BadgeSpecimen />,
  },
  {
    slug: "alert",
    label: "Alert",
    section: "Components",
    description: "The five status surfaces.",
    groups: ["alert"],
    files: ["alert"],
    render: () => <AlertSpecimen />,
  },
  {
    slug: "card",
    label: "Card",
    section: "Components",
    description: "Default and filled surfaces with the full anatomy.",
    groups: ["card"],
    files: ["card"],
    render: () => <CardSpecimen />,
  },
  {
    slug: "tabs",
    label: "Tabs",
    section: "Components",
    description: "Underline and badge variants.",
    files: ["tabs"],
    render: () => <TabsSpecimen />,
  },
  {
    slug: "dialog",
    label: "Dialog",
    section: "Components",
    description: "Overlay, popup surface and radius.",
    files: ["dialog", "alert-dialog"],
    render: () => <DialogSpecimen />,
  },
  {
    slug: "menus",
    label: "Menus & Command",
    section: "Components",
    description: "Dropdown/context/menubar items share the menu-item tokens; command adds search.",
    groups: ["menuItem"],
    files: ["dropdown-menu", "command"],
    render: () => <MenuSpecimen />,
  },
  {
    slug: "overlays",
    label: "Tooltip & Popover",
    section: "Components",
    description: "Small floating surfaces.",
    groups: ["tooltip"],
    files: ["tooltip", "popover", "hover-card"],
    render: () => <OverlaySpecimen />,
  },
  {
    slug: "avatar",
    label: "Avatar",
    section: "Components",
    description: "Sizes, roundness and stacks.",
    groups: ["avatar"],
    files: ["avatar"],
    render: () => <AvatarSpecimen />,
  },
  {
    slug: "table",
    label: "Table",
    section: "Components",
    description: "Header, rows, and cell tokens.",
    files: ["table", "data-table"],
    render: () => <TableSpecimen />,
  },
  {
    slug: "accordion",
    label: "Accordion",
    section: "Components",
    description: "Trigger, border and content.",
    files: ["accordion"],
    render: () => <AccordionSpecimen />,
  },
  {
    slug: "navigation",
    label: "Navigation",
    section: "Components",
    description: "Breadcrumb, pagination and links.",
    files: ["breadcrumb", "pagination", "link"],
    render: () => <NavigationSpecimen />,
  },
  {
    slug: "toggles",
    label: "Toggles & Groups",
    section: "Components",
    description: "Toggle, toggle group and button group seams.",
    files: ["toggle", "toggle-group", "button-group"],
    render: () => <ToggleSpecimen />,
  },
  {
    slug: "feedback",
    label: "Progress & Toast",
    section: "Components",
    description: "Progress, skeleton and toast surfaces.",
    files: ["progress", "skeleton", "sonner"],
    render: () => <FeedbackSpecimen />,
  },
  {
    slug: "sidebar",
    label: "Sidebar",
    section: "Components",
    description: "The navigation rail, expanded and collapsed.",
    groups: ["sidebar"],
    files: ["sidebar"],
    render: () => <SidebarSpecimen />,
  },
  {
    slug: "calendar",
    label: "Calendar",
    section: "Components",
    description: "Day grid, selection and today marker.",
    files: ["calendar", "date-picker"],
    render: () => <CalendarSpecimen />,
  },
  {
    slug: "charts",
    label: "Charts",
    section: "Finish",
    description: "The 5-color chart palette — the last stop.",
    semanticMajors: ["chart"],
    render: () => <ChartsSpecimen />,
  },
  {
    slug: "review",
    label: "Full review",
    section: "Finish",
    description: "Everything composed on one dashboard — the final coherence check.",
    render: () => (
      <div className="origin-top-left scale-[0.9]">
        <DashboardPreview />
      </div>
    ),
  },
];

export const STEP_SECTIONS = ["Start here", "Components", "Finish"];
