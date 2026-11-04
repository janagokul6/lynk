"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Thread = {
  id: string;
  title: string;
  messages: { id: string; senderId: string; body: string; createdAt: string }[];
};

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [thread, setThread] = useState<Thread | null>(null);
  const [body, setBody] = useState("");
  const [me, setMe] = useState<string | null>(null);

  async function load() {
    const response = await api.get<Thread>(`/api/messages/${params.id}`);
    setThread(response.data);
  }

  useEffect(() => {
    api
      .get<{ user?: { id?: string } } | null>("/api/me")
      .then((response) => {
        if (!response.data?.user?.id) {
          router.replace("/login");
          return;
        }
        setMe(response.data.user.id);
        return load();
      })
      .catch(() => router.replace("/login"));
    const timer = window.setInterval(() => {
      void load().catch(() => undefined);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [params.id, router]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    await api.post(`/api/messages/${params.id}`, { body });
    setBody("");
    await load();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-8">
      <Link href="/messages" className="text-sm font-semibold text-primary">All messages</Link>
      <h1 className="mt-2 text-2xl font-bold">{thread?.title ?? "Conversation"}</h1>
      <div className="mt-4 flex-1 space-y-2">
        {thread?.messages.length === 0 ? <p className="text-sm text-slate-500">No messages yet.</p> : null}
        {thread?.messages.map((message) => (
          <p key={message.id} className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${message.senderId === me ? "ml-auto bg-primary text-white" : "bg-slate-100 dark:bg-slate-800"}`}>
            {message.body}
          </p>
        ))}
      </div>
      <form className="mt-4 flex gap-2" onSubmit={(event) => void send(event)}>
        <input className="flex-1 rounded-xl border border-border px-3 py-2" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a message" />
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" type="submit">Send</button>
      </form>
    </main>
  );
}
