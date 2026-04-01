import type { Metadata } from "next";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export const metadata: Metadata = {
  title: "Painel | DL System",
  description: "Clientes e contratos.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
