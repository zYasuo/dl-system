"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";
import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

export type LookupOption = { code: string; label: string };

type LookupValue = { code: string; label: string } | undefined;

type FormLookupFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  options: LookupOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export function FormLookupField<T extends FieldValues>({
  name,
  control,
  options,
  placeholder = "Pesquisar e seleccionar…",
  searchPlaceholder = "Código ou descrição…",
  emptyText = "Nenhum resultado.",
  disabled,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: FormLookupFieldProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const value = field.value as PathValue<T, FieldPath<T>> as LookupValue;
        const label =
          value?.code && value?.label
            ? `${value.code} — ${value.label}`
            : placeholder;

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              disabled={disabled}
              render={
                <Button
                  id={id}
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-invalid={ariaInvalid}
                  aria-describedby={ariaDescribedBy}
                  className={cn(
                    "h-10 w-full justify-between font-normal",
                    !value?.code && "text-muted-foreground",
                  )}
                >
                  <span className="truncate">{label}</span>
                  <SearchIcon
                    className="ms-2 size-4 shrink-0 opacity-50"
                    aria-hidden
                  />
                </Button>
              }
            />
            <PopoverContent
              className="w-(--anchor-width) min-w-[280px] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder={searchPlaceholder} />
                <CommandList>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.code}
                        value={`${opt.code} ${opt.label}`}
                        onSelect={() => {
                          field.onChange({
                            code: opt.code,
                            label: opt.label,
                          } as PathValue<T, FieldPath<T>>);
                          setOpen(false);
                        }}
                      >
                        <span className="font-mono text-xs text-muted-foreground">
                          {opt.code}
                        </span>{" "}
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}
