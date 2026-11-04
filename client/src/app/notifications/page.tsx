"use client";

import { AccountLinks } from "@/components/account/AccountLinks";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { id: string; title: string; body: string; href: string | null; readAt: string | null; createdAt: string };

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[] | null>(null);
  const [unread, setUnread] = useState(0);

  function load() {
    return api.get<{ unread: number; notifications: Item[] }>("/api/notifications").then((response) => {
      setItems(response.data.notifications);
      setUnread(response.data.unread);
    });
  }

  useEffect(() => {
    load().catch(() => router.replace("/login"));
  }, [router]);

  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <AccountLinks />
      </div>
      <p className="text-sm text-slate-500">{unread} unread</p>
      <button
        type="button"
        className="text-sm font-semibold text-primary"
        onClick={() => {
          void api.post("/api/notifications/read-all").then(() => load());
        }}
      >
        Mark all read
      </button>
      {items?.length === 0 ? <p className="text-sm text-slate-500">Nothing yet.</p> : null}
      <ul className="space-y-2">
        {items?.map((item) => (
          <li key={item.id} className="rounded-xl border border-border p-4">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-slate-600">{item.body}</p>
            <div className="mt-2 flex gap-3 text-sm">
              {item.href ? <a className="font-semibold text-primary" href={item.href}>Open</a> : null}
              {!item.readAt ? (
                <button type="button" className="font-semibold" onClick={() => void api.post(`/api/notifications/${item.id}/read`).then(() => load())}>
                  Mark read
                </button>
              ) : (
                <span className="text-slate-400">Read</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Link href="/settings" className="text-sm font-semibold text-primary">Settings</Link>
    </main>
  );
}
