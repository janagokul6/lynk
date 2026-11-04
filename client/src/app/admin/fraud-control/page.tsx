"use client";

import { AppLayout } from "@/components/layout/AppLayout";

export default function FraudControlPage() {
  return (
    <AppLayout variant="admin" activeTab="Trust">
      <div className="mx-auto max-w-xl space-y-3 px-4 py-8">
        <h1 className="text-2xl font-bold">Fraud signals</h1>
        <p className="text-sm text-slate-600">Lynk does not score follower authenticity or detect bot networks yet. There is nothing to review on this page.</p>
      </div>
    </AppLayout>
  );
}
