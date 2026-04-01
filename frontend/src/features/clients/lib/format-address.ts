import type { ClientPublic } from "@/features/clients/actions";

export function formatClientAddress(address: ClientPublic["address"]): string {
  const parts = [
    `${address.street}, ${address.number}`,
    address.complement,
    `${address.neighborhood}, ${address.city} ${address.state}`,
    address.zipCode,
  ].filter(Boolean);
  return parts.join(" · ");
}
