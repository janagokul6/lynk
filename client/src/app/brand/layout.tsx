"use client";

import { RequireRole } from "@/components/auth/RequireRole";

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole role="brand">{children}</RequireRole>;
}
