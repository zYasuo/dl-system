import type { ClientContractPublic } from "@/features/client-contracts/actions";

export function contractStatusLabel(
  status: ClientContractPublic["status"],
): string {
  switch (status) {
    case "ACTIVE":
      return "Ativo";
    case "EXPIRED":
      return "Expirado";
    case "CANCELLED":
      return "Cancelado";
    default:
      return status;
  }
}
