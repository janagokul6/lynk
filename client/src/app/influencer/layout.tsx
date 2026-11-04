"use client";

import { RequireRole } from "@/components/auth/RequireRole";

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole role="influencer">{children}</RequireRole>;
}
