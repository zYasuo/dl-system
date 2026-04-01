import type { ClientPublic } from "@/features/clients/actions";

export function clientDocumentLabel(client: ClientPublic): string | null {
  const cpf = client.cpf as unknown;
  const cnpj = client.cnpj as unknown;
  const c = typeof cpf === "string" && cpf.length > 0 ? cpf : null;
  const n = typeof cnpj === "string" && cnpj.length > 0 ? cnpj : null;
  return n ?? c ?? null;
}

export function clientSearchMatchLabel(
  kind: string,
  confidence: string,
): string {
  const k =
    kind === "cpf"
      ? "CPF"
      : kind === "id"
        ? "ID"
        : kind === "address"
          ? "Morada"
          : kind;
  const c = confidence === "exact" ? "exato" : "parcial";
  return `${k} · ${c}`;
}
