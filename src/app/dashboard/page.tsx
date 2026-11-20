import type { Metadata } from "next";
import Dashboard from "./Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "DevAtlas - Gestión de Lenguajes",
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
