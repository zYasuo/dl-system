"use client";

import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

type FormDateFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export function FormDateField<T extends FieldValues>({
  name,
  control,
  placeholder = "Seleccionar data",
  disabled,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: FormDateFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const date =
          field.value && typeof field.value === "string"
            ? parseISO(field.value)
            : undefined;
        const valid = date && !Number.isNaN(date.getTime()) ? date : undefined;

        return (
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  id={id}
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  aria-invalid={ariaInvalid}
                  aria-describedby={ariaDescribedBy}
                  className={cn(
                    "h-10 w-full justify-start text-start font-normal",
                    !valid && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="me-2 size-4 shrink-0" aria-hidden />
                  {valid ? (
                    format(valid, "d MMM yyyy", { locale: pt })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={pt}
                selected={valid}
                onSelect={(d) => {
                  field.onChange(d ? format(d, "yyyy-MM-dd") : undefined);
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}
