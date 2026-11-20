import type { Metadata } from "next";
import Dashboard from "./Dashboard";

export const metadata: Metadata = {
  title: "DevAtlas - Gestión de Lenguajes",
};

export default function DashboardPage() {
  return <Dashboard />;
}
