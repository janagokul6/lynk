"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { BrandDashboardPanel } from "@/components/home/BrandDashboardPanel";

export default function BrandDashboardPage() {
  return (
    <AppLayout
      variant="brand"
      activeTab="Home"
      header={<Header userName="Your workspace" userRole="Brand" avatarUrl="" showCreateButton />}
    >
      <BrandDashboardPanel />
    </AppLayout>
  );
}
