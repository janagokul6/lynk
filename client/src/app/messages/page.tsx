"use client";

import { AccountLinks } from "@/components/account/AccountLinks";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Thread = { id: string; applicationId: string; title: string; withName: string };

export default function MessagesPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[] | null>(null);

  useEffect(() => {
    api
      .get<{ threads: Thread[] }>("/api/messages")
      .then((response) => setThreads(response.data.threads))
      .catch(() => router.replace("/login"));
  }, [router]);

  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <AccountLinks />
      </div>
      <p className="text-sm text-slate-500">Threads open after a collaboration is accepted. This page refreshes when you reopen it.</p>
      {threads == null ? <p className="text-sm text-slate-500">Loading…</p> : null}
      {threads?.length === 0 ? <p className="text-sm text-slate-500">No conversations yet.</p> : null}
      <ul className="space-y-2">
        {threads?.map((thread) => (
          <li key={thread.id}>
            <Link href={`/messages/${thread.id}`} className="block rounded-xl border border-border p-4">
              <p className="font-semibold">{thread.title}</p>
              <p className="text-sm text-slate-500">With {thread.withName}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
