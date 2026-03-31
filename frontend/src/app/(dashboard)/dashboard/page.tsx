import type { Metadata } from "next";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export const metadata: Metadata = {
  title: "Visão geral | DL Tickets",
  description: "Painel com KPIs e gráficos dos seus tickets.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
