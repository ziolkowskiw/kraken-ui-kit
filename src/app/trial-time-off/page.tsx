"use client";

// Developer-role trial: a "Request time off" screen built only from Kraken's
// manifests and stories. Scratch file, not part of the kit.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SelectField, SelectItem } from "@/components/ui/select";
import { DatePickerField } from "@/components/ui/date-picker";
import { TextareaField } from "@/components/ui/textarea";
import { DataTable, TableRow, TableTitle } from "@/components/ui/data-table";
import {
  TableHeader,
  TableHeaderRow,
} from "@/components/ui/data-table-header";
import { DataTableCell } from "@/components/ui/data-table-cell";

const LEAVE_TYPES = ["Vacation", "Sick leave", "Remote work", "Unpaid leave"];

const REQUESTS = [
  { type: "Vacation", dates: "12 to 16 Jan", status: "Approved", color: "green" },
  { type: "Sick leave", dates: "3 Feb", status: "Approved", color: "green" },
  { type: "Vacation", dates: "9 to 20 Mar", status: "Pending", color: "orange" },
  { type: "Unpaid leave", dates: "28 Apr", status: "Declined", color: "red" },
] as const;

export default function TimeOffTrial() {
  const [open, setOpen] = useState(false);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="[font-size:var(--ds-typography-headingxl-fontsize)] [font-family:var(--ds-typography-headingxl-fontfamily)]">
          Time off
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button>Request time off</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request time off</DialogTitle>
              <DialogDescription>
                Your manager gets the request straight away.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <SelectField label="Type" mandatory placeholder="Choose a type">
                {LEAVE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectField>
              <DatePickerField label="Dates" mandatory mode="range" placeholder="Pick dates" />
              <TextareaField
                label="Note"
                description="Optional. Visible to your manager."
              />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary">Cancel</Button>} />
              <DialogClose render={<Button>Send request</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable>
        <TableTitle title="Your requests" />
        <TableHeaderRow>
          <TableHeader label="Type" />
          <TableHeader label="Dates" />
          <TableHeader label="Status" />
        </TableHeaderRow>
        {REQUESTS.map((r, i) => (
          <TableRow key={i} variant={i % 2 ? "grey" : "white"}>
            <DataTableCell type="text" value={r.type} />
            <DataTableCell type="text" value={r.dates} />
            <DataTableCell type="badge" badgeColor={r.color} badgeLabel={r.status} />
          </TableRow>
        ))}
      </DataTable>
    </main>
  );
}
