"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import Link from "next/link";

export default function WalletPage() {
  return (
    <AppLayout variant="influencer" activeTab="Profile">
      <div className="mx-auto max-w-xl space-y-3 px-4 py-8">
        <h1 className="text-2xl font-bold">Wallet</h1>
        <p className="text-sm text-slate-600">Payouts are not live yet. Lynk does not hold a balance, and there is nothing to withdraw.</p>
        <Link href="/influencer/profile" className="text-sm font-semibold text-primary">Back to profile</Link>
      </div>
    </AppLayout>
  );
}
