"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AccountLinks() {
  const router = useRouter();
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
      <Link href="/notifications" className="text-slate-600 hover:text-primary dark:text-slate-300">
        Notifications
      </Link>
      <Link href="/settings" className="text-slate-600 hover:text-primary dark:text-slate-300">
        Settings
      </Link>
      <button
        type="button"
        className="text-slate-600 hover:text-primary dark:text-slate-300"
        onClick={() => {
          void authClient.signOut().then(() => router.push("/login"));
        }}
      >
        Log out
      </button>
    </div>
  );
}
