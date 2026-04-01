import type { Metadata } from "next";
import { ClientsListView } from "@/features/clients/components/clients-list-view";

export const metadata: Metadata = {
  title: "Clientes | DL System",
  description: "Lista de clientes.",
};

export default function ClientsPage() {
  return <ClientsListView />;
}
