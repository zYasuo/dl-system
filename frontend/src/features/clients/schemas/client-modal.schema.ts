import { z } from "zod";

import {
  addressFormSchema,
  refineClientIdentification,
} from "@/features/clients/schemas/client.schema";

const lookupPairSchema = z
  .object({
    code: z.string(),
    label: z.string(),
  })
  .optional();

export const clientModalFormSchema = z
  .object({
    foreignNational: z.boolean(),
    documentKind: z.enum(["cpf", "cnpj"]),
    name: z.string().min(1, "Nome ou razão social obrigatório").max(255),
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    address: addressFormSchema,
    personType: z.enum(["fisica", "juridica"]),
    icmsContributor: z.enum(["contribuinte", "nao_contribuinte", "isento"]),
    active: z.boolean(),
    sex: z.enum(["masculino", "feminino", "nao_informar"]),
    birthDate: z.string().optional(),
    tipoClienteLookup: lookupPairSchema,
    canalVendaLookup: lookupPairSchema,
    filialLookup: lookupPairSchema,
  })
  .superRefine((data, ctx) => {
    refineClientIdentification(data, ctx);
  });

export type ClientModalFormValues = z.infer<typeof clientModalFormSchema>;
