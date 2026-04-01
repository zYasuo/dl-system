import type { Metadata } from "next";
import { ClientDetailView } from "@/features/clients/components/client-detail-view";

export const metadata: Metadata = {
  title: "Cliente | DL System",
  description: "Detalhe do cliente e contratos associados.",
};

export default function ClientDetailPage() {
  return <ClientDetailView />;
}
