"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MediaKitRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/influencer/profile");
  }, [router]);
  return <p className="p-6 text-sm text-slate-500">Opening your profile…</p>;
}
