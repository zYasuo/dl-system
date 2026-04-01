"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { clientFormRowGridClass } from "@/features/clients/components/client-modal/form/form-field-row";
import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: string };

type FormRadioGroupFieldProps<T extends FieldValues, V extends string> = {
  name: FieldPath<T>;
  control: Control<T>;
  options: Option<V>[];
  legend: string;
  className?: string;
};

export function FormRadioGroupField<
  T extends FieldValues,
  V extends string,
>({
  name,
  control,
  options,
  legend,
  className,
}: FormRadioGroupFieldProps<T, V>) {
  const legendId = React.useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cn(clientFormRowGridClass, className)} role="group">
          <div
            id={legendId}
            className="pt-0.5 text-sm font-medium leading-snug text-muted-foreground sm:pt-2"
          >
            {legend}
          </div>
          <div
            role="radiogroup"
            aria-labelledby={legendId}
            className="flex min-w-0 flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/30 p-1"
          >
            {options.map((opt) => {
              const selected = field.value === opt.value;
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    selected
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/80"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={String(name)}
                    value={opt.value}
                    checked={selected}
                    onChange={() => field.onChange(opt.value)}
                    onBlur={field.onBlur}
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
