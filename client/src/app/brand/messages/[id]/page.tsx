"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LegacyBrandThread() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/messages/${params.id}`);
  }, [params.id, router]);
  return <p className="p-6 text-sm text-slate-500">Opening the conversation…</p>;
}
