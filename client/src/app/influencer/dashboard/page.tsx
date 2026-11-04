"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { InfluencerDashboardPanel } from "@/components/home/InfluencerDashboardPanel";

export default function InfluencerDashboardPage() {
  return (
    <AppLayout
      variant="influencer"
      activeTab="Home"
      header={<Header userName="Your workspace" userRole="Creator" avatarUrl="" />}
    >
      <InfluencerDashboardPanel />
    </AppLayout>
  );
}
