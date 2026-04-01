"use client";

import { useFormContext } from "react-hook-form";

import { FormFieldRow } from "@/features/clients/components/client-modal/form";
import type { ClientModalFormValues } from "@/features/clients/schemas/client-modal.schema";
import { Input } from "@/shared/components/ui/input";
import { TabsContent } from "@/shared/components/ui/tabs";

export function ClientTabEnderecoPanel() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ClientModalFormValues>();

  return (
    <TabsContent
      value="endereco"
      className="mt-0 max-h-[min(52dvh,520px)] overflow-y-auto pe-1 pt-2 outline-none data-[orientation=horizontal]:mt-0"
    >
    <div className="rounded-xl border border-border/50 bg-muted/5 p-4 shadow-sm ring-1 ring-foreground/5 sm:p-5">
      <header className="mb-4 border-b border-border/40 pb-3">
        <h3 className="text-sm font-semibold text-foreground">Morada</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Rua, número, bairro, cidade, UF e CEP são obrigatórios. Complemento é
          opcional.
        </p>
      </header>
      <div className="flex flex-col gap-4">
      <FormFieldRow
        label="Rua ou logradouro"
        htmlFor="addr-street"
        required
        error={errors.address?.street?.message}
      >
        <Input
          id="addr-street"
          autoComplete="street-address"
          placeholder="Nome da rua, avenida…"
          className="h-10 w-full"
          {...register("address.street")}
        />
      </FormFieldRow>
      <FormFieldRow
        label="Número"
        htmlFor="addr-number"
        required
        error={errors.address?.number?.message}
      >
        <Input
          id="addr-number"
          autoComplete="off"
          placeholder="N.º"
          className="h-10 w-full sm:max-w-40"
          {...register("address.number")}
        />
      </FormFieldRow>
      <FormFieldRow
        label="Complemento"
        htmlFor="addr-complement"
        error={errors.address?.complement?.message}
      >
        <Input
          id="addr-complement"
          autoComplete="off"
          placeholder="Apartamento, bloco… (opcional)"
          className="h-10 w-full"
          {...register("address.complement")}
        />
      </FormFieldRow>
      <FormFieldRow
        label="Bairro"
        htmlFor="addr-neighborhood"
        required
        error={errors.address?.neighborhood?.message}
      >
        <Input
          id="addr-neighborhood"
          autoComplete="off"
          placeholder="Bairro"
          className="h-10 w-full"
          {...register("address.neighborhood")}
        />
      </FormFieldRow>
      <FormFieldRow
        label="Cidade"
        htmlFor="addr-city"
        required
        error={errors.address?.city?.message}
      >
        <Input
          id="addr-city"
          autoComplete="address-level2"
          placeholder="Cidade"
          className="h-10 w-full"
          {...register("address.city")}
        />
      </FormFieldRow>
      <FormFieldRow
        label="UF"
        htmlFor="addr-state"
        required
        error={errors.address?.state?.message}
      >
        <Input
          id="addr-state"
          maxLength={2}
          autoComplete="address-level1"
          placeholder="SC"
          className="h-10 w-full max-w-full uppercase sm:max-w-24"
          {...register("address.state")}
        />
      </FormFieldRow>
      <FormFieldRow
        label="CEP"
        htmlFor="addr-zip"
        required
        error={errors.address?.zipCode?.message}
      >
        <Input
          id="addr-zip"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          className="h-10 w-full font-mono text-sm sm:max-w-48"
          {...register("address.zipCode")}
        />
      </FormFieldRow>
      </div>
    </div>
    </TabsContent>
  );
}
