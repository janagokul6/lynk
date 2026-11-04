"use client";

import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StartThreadPage() {
  const params = useParams<{ applicationId: string }>();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    api
      .post<{ id: string }>(`/api/messages`, { applicationId: params.applicationId })
      .then((response) => {
        if (!cancelled) router.replace(`/messages/${response.data.id}`);
      })
      .catch(() => {
        if (!cancelled) router.replace("/messages");
      });
    return () => {
      cancelled = true;
    };
  }, [params.applicationId, router]);

  return <p className="p-6 text-sm text-slate-500">Opening the conversation…</p>;
}
