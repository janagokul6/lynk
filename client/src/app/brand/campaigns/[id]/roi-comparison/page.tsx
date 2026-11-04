"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoiComparisonRedirect() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/brand/campaigns/${params.id}/analytics`);
  }, [params.id, router]);
  return <p className="p-6 text-sm text-slate-500">Opening campaign results…</p>;
}
