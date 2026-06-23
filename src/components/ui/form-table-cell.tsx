"use client"

import * as React from "react"
import { Search, Calendar } from "lucide-react"

import { cn } from "@/lib/utils"
import { InputField } from "./input"
import { SelectField, SelectItem } from "./select"
import { Switch } from "./switch"
import { CheckboxButton } from "./checkbox-button"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { TextareaField } from "./textarea"
import { Button } from "./button"

// form-table/cell (1411:18819). A form control sized for a data-table cell (sm).
// Reuses the kit form primitives. Container: `px-2 w-full`.

type InputType =
  | "text field"
  | "select"
  | "search"
  | "date"
  | "file uploader"
  | "switch"
  | "checkbox"
  | "radio"
  | "textarea"

type FormTableCellProps = {
  inputType?: InputType
  placeholder?: string
  /** options for select / radio / checkbox */
  options?: string[]
  className?: string
}

const DEFAULT_OPTIONS = ["Option A", "Option B", "Option C"]

function FormTableCell({
  inputType = "text field",
  placeholder = "Placeholder",
  options = DEFAULT_OPTIONS,
  className,
}: FormTableCellProps) {
  let control: React.ReactNode
  switch (inputType) {
    case "text field":
      control = <InputField size="sm" placeholder={placeholder} />
      break
    case "select":
      control = (
        <SelectField size="sm" placeholder={placeholder}>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectField>
      )
      break
    case "search":
      control = (
        <InputField size="sm" placeholder={placeholder} leftDecoration={<Search />} />
      )
      break
    case "date":
      control = (
        <InputField
          size="sm"
          placeholder={placeholder === "Placeholder" ? "Choose a date" : placeholder}
          leftDecoration={<Calendar />}
        />
      )
      break
    case "file uploader":
      control = (
        <Button variant="secondary" size="sm" className="w-full">
          Action verb
        </Button>
      )
      break
    case "switch":
      control = <Switch />
      break
    case "checkbox":
      control = (
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <CheckboxButton key={o} size="sm" label={o} />
          ))}
        </div>
      )
      break
    case "radio":
      // The kit has no button-style radio; compose RadioGroupItem in a bordered
      // container to mirror Figma's button-style radio options.
      control = (
        <RadioGroup className="flex flex-wrap gap-1" defaultValue={options[0]}>
          {options.map((o) => (
            <label
              key={o}
              className={cn(
                "flex min-h-8 cursor-pointer items-center gap-2 [border-radius:var(--ds-radius-lg)] border border-solid px-3 py-2",
                "[border-color:var(--ds-checkbox-bordercolor)] [background-color:var(--ds-checkbox-fill)]",
                "hover:[border-color:var(--ds-checkbox-borderhover)]"
              )}
            >
              <RadioGroupItem value={o} />
              <span className="[font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] [color:var(--ds-color-content-secondary)]">{o}</span>
            </label>
          ))}
        </RadioGroup>
      )
      break
    case "textarea":
      control = <TextareaField size="sm" placeholder={placeholder} className="min-h-16" />
      break
  }

  return (
    <div
      data-slot="form-table-cell"
      data-input-type={inputType}
      className={cn("flex w-full flex-col items-start px-2", className)}
    >
      {control}
    </div>
  )
}

export { FormTableCell }
export type { InputType }
