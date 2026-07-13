"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { TooltipIcon, TooltipProvider } from "./tooltip";

// Mirrors the Figma `date-picker` set (895:1933): a field whose trigger opens a
// Calendar popover. State=rest|hover|focus|disabled|error × Size × Filled. Reuses
// the `--ds-input-*` field tokens and composes the real <Calendar> + <Popover>.
// `mode="single"` (default) picks one date; `mode="range"` picks a {from,to}
// range — the Calendar already renders the range fills from `--ds-color-primary-muted`.
const SIZE_CLASS = {
  sm: "[height:var(--ds-input-size-sm-height)] [padding-inline:var(--ds-input-size-sm-paddingx)] [border-radius:var(--ds-input-size-sm-radius)] [font-size:var(--ds-input-size-sm-fontsize)]",
  md: "[height:var(--ds-input-size-md-height)] [padding-inline:var(--ds-input-size-md-paddingx)] [border-radius:var(--ds-input-size-md-radius)] [font-size:var(--ds-input-size-md-fontsize)]",
  lg: "[height:var(--ds-input-size-lg-height)] [padding-inline:var(--ds-input-size-lg-paddingx)] [border-radius:var(--ds-input-size-lg-radius)] [font-size:var(--ds-input-size-lg-fontsize)]",
};

type DatePickerBaseProps = {
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  error?: boolean;
  className?: string;
};

type SingleProps = DatePickerBaseProps & {
  mode?: "single";
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  format?: (date: Date) => string;
};

type RangeProps = DatePickerBaseProps & {
  mode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  format?: (range: DateRange) => string;
};

type DatePickerProps = SingleProps | RangeProps;

/** Coerce anything (Date, ISO string, timestamp) to a valid Date or undefined.
 *  Guards against non-Date values (e.g. a Storybook date control returns a number),
 *  so we never call Date methods on a non-Date. */
function toDate(value: unknown): Date | undefined {
  if (value == null || value === "") return undefined;
  const d = value instanceof Date ? value : new Date(value as string | number);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Normalize a DateRange's endpoints through `toDate` (or undefined if neither set). */
function toRange(value: unknown): DateRange | undefined {
  if (value == null) return undefined;
  const r = value as DateRange;
  const from = toDate(r.from);
  const to = toDate(r.to);
  if (!from && !to) return undefined;
  return { from, to };
}

const formatOne = (d: Date) =>
  d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

function DatePicker(props: DatePickerProps) {
  const {
    placeholder = "Pick a date",
    size = "md",
    disabled,
    error,
    className,
    mode = "single",
  } = props;
  const isRange = mode === "range";

  const [open, setOpen] = React.useState(false);
  const [internalSingle, setInternalSingle] = React.useState<Date | undefined>(() =>
    isRange ? undefined : toDate((props as SingleProps).defaultValue),
  );
  const [internalRange, setInternalRange] = React.useState<DateRange | undefined>(() =>
    isRange ? toRange((props as RangeProps).defaultValue) : undefined,
  );

  const selectedSingle = toDate((props as SingleProps).value) ?? internalSingle;
  const selectedRange = toRange((props as RangeProps).value) ?? internalRange;
  const controlled = props.value !== undefined;

  const setSingle = (date: Date | undefined) => {
    const next = toDate(date);
    if (!controlled) setInternalSingle(next);
    (props as SingleProps).onValueChange?.(next);
    setOpen(false);
  };

  const setRange = (range: DateRange | undefined) => {
    const next = toRange(range);
    if (!controlled) setInternalRange(next);
    (props as RangeProps).onValueChange?.(next);
    // Close only once both ends are picked, so the user can complete the range.
    if (next?.from && next?.to) setOpen(false);
  };

  const label = (() => {
    if (isRange) {
      if (!selectedRange?.from) return placeholder;
      const fmt = (props as RangeProps).format;
      if (fmt) return fmt(selectedRange);
      return selectedRange.to
        ? `${formatOne(selectedRange.from)} – ${formatOne(selectedRange.to)}`
        : formatOne(selectedRange.from);
    }
    if (!selectedSingle) return placeholder;
    const fmt = (props as SingleProps).format ?? formatOne;
    return fmt(selectedSingle);
  })();

  const hasValue = isRange ? !!selectedRange?.from : !!selectedSingle;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            disabled={disabled}
            data-slot="date-picker-trigger"
            aria-invalid={error || undefined}
            className={cn(
              "flex w-full items-center gap-2 border text-left transition-colors outline-none",
              "[border-width:var(--ds-input-borderwidth)] [border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)]",
              "hover:[border-color:var(--ds-input-borderhover)] focus-visible:[border-color:var(--ds-input-borderfocus)]",
              "aria-invalid:[border-color:var(--ds-input-bordererror)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              SIZE_CLASS[size],
              className,
            )}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0 [color:var(--ds-color-icon-muted)]" />
        <span
          className={cn(
            "flex-1 truncate",
            hasValue ? "[color:var(--ds-input-value)]" : "[color:var(--ds-input-placeholder)]",
          )}
        >
          {label}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        {isRange ? (
          <Calendar mode="range" selected={selectedRange} onSelect={setRange} autoFocus />
        ) : (
          <Calendar mode="single" selected={selectedSingle} onSelect={setSingle} autoFocus />
        )}
      </PopoverContent>
    </Popover>
  );
}

type DatePickerFieldProps = DatePickerProps & {
  label?: string;
  description?: string;
  errorMessage?: string;
  mandatory?: boolean;
  tooltip?: React.ReactNode;
};

function DatePickerField({
  label,
  description,
  errorMessage,
  mandatory,
  tooltip,
  error,
  className,
  ...props
}: DatePickerFieldProps) {
  const hasError = error || !!errorMessage;
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[var(--ds-spacing-component-sm)] items-start",
        className,
      )}
    >
      {label && (
        <div className="flex items-center gap-1 h-4">
          <span className="[color:var(--ds-input-content)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)]">
            {label}
          </span>
          {mandatory && <span className="[color:var(--ds-input-contenterror)]">*</span>}
          {tooltip && (
            <TooltipProvider>
              <TooltipIcon content={tooltip} />
            </TooltipProvider>
          )}
        </div>
      )}
      <DatePicker error={hasError} {...(props as DatePickerProps)} />
      {hasError && errorMessage ? (
        <p className="[color:var(--ds-input-contenterror)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] w-full">
          {errorMessage}
        </p>
      ) : description ? (
        <p className="[color:var(--ds-input-placeholder)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] w-full">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { DatePicker, DatePickerField };
export type { DatePickerProps, DatePickerFieldProps };
