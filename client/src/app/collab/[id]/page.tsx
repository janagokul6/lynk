"use client";

import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { DISCLOSURE_CHECKS } from "@lynk/shared";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Collab = {
  role: "brand" | "influencer";
  guidelines: string | null;
  description: string;
  disclosureChecks: string[];
  application: {
    id: string;
    status: string;
    campaignTitle?: string;
    message: string | null;
    payMin?: string;
  };
  submissions: { id: string; kind: string; url: string | null; storageKey: string | null; note: string | null; revisionNote: string | null; createdAt: string }[];
  ratings: { id: string; raterId: string; score: number; comment: string | null }[];
};

export default function CollabPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [collab, setCollab] = useState<Collab | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [revision, setRevision] = useState("");
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  async function load() {
    const response = await api.get<Collab>(`/api/collab/${params.id}`);
    setCollab(response.data);
  }

  useEffect(() => {
    api
      .get<{ user?: { id?: string } } | null>("/api/me")
      .then((response) => {
        if (!response.data?.user) {
          router.replace("/login");
          return;
        }
        setUserId(response.data.user.id ?? null);
        return load();
      })
      .catch(() => router.replace("/login"));
  }, [params.id, router]);

  async function act(path: string, body?: unknown) {
    setError(null);
    try {
      const response = await api.post<Collab>(`/api/collab/${params.id}/${path}`, body ?? {});
      setCollab(response.data);
      setUrl("");
      setNote("");
      setRevision("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the collaboration");
    }
  }

  async function uploadFile(file: File) {
    const signed = await api.post<{ uploadUrl: string; key: string }>("/api/storage/sign", {
      key: file.name.replace(/[^a-zA-Z0-9._-]/g, "_"),
      contentType: file.type || "application/octet-stream",
    });
    await fetch(signed.data.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type || "application/octet-stream" } });
    await act("submissions", { storageKey: signed.data.key, note });
  }

  const mine = collab?.ratings.find((item) => item.raterId === userId);

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <Link href={collab?.role === "brand" ? "/brand/applications" : "/marketplace"} className="text-sm font-semibold text-primary">
          Back
        </Link>
        <button type="button" className="text-xs font-semibold" onClick={() => void authClient.signOut().then(() => router.push("/login"))}>
          Log out
        </button>
      </div>
      {!collab ? <p className="text-sm text-slate-500">Loading collaboration…</p> : null}
      {collab ? (
        <>
          <header>
            <p className="text-xs font-bold uppercase text-primary">{collab.application.status}</p>
            <h1 className="text-2xl font-bold">{collab.application.campaignTitle}</h1>
          </header>
          <section className="space-y-2 rounded-2xl border border-border p-4">
            <h2 className="font-semibold">Brief</h2>
            <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{collab.description}</p>
            {collab.guidelines ? <p className="whitespace-pre-wrap text-sm text-slate-600">{collab.guidelines}</p> : null}
            <h3 className="pt-2 text-sm font-semibold">Disclosure checklist</h3>
            <ul className="space-y-1 text-sm">
              {DISCLOSURE_CHECKS.map((item) => (
                <li key={item.id}>
                  {collab.disclosureChecks.includes(item.id) ? "Checked" : "Not checked"} — {item.label}
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-2">
            <h2 className="font-semibold">Submissions</h2>
            {collab.submissions.length === 0 ? <p className="text-sm text-slate-500">Nothing submitted yet.</p> : null}
            <ul className="space-y-2">
              {collab.submissions.map((item) => (
                <li key={item.id} className="rounded-xl border border-border p-3 text-sm">
                  <p className="font-semibold uppercase">{item.kind}</p>
                  {item.url ? <a className="text-primary" href={item.url}>{item.url}</a> : null}
                  {item.storageKey ? <p>File: {item.storageKey}</p> : null}
                  {item.note ? <p>{item.note}</p> : null}
                  {item.revisionNote ? <p>Revision: {item.revisionNote}</p> : null}
                </li>
              ))}
            </ul>
          </section>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {collab.role === "influencer" && (collab.application.status === "accepted" || collab.application.status === "revision") ? (
            <form className="space-y-2" onSubmit={(event) => { event.preventDefault(); void act("submissions", { url, note }); }}>
              <h2 className="font-semibold">Submit content</h2>
              <input className="w-full rounded-xl border border-border px-3 py-2" placeholder="Link to the draft" value={url} onChange={(event) => setUrl(event.target.value)} />
              <textarea className="w-full rounded-xl border border-border px-3 py-2" placeholder="Note" value={note} onChange={(event) => setNote(event.target.value)} />
              <div className="flex gap-2">
                <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" type="submit">Send link</button>
                <label className="rounded-xl border border-border px-4 py-2 text-sm font-bold">
                  Upload file
                  <input className="hidden" type="file" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file); }} />
                </label>
              </div>
            </form>
          ) : null}
          {collab.role === "brand" && collab.application.status === "submitted" ? (
            <div className="space-y-2">
              <button type="button" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" onClick={() => void act("approve")}>Approve content</button>
              <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); void act("revision", { note: revision }); }}>
                <input className="flex-1 rounded-xl border border-border px-3 py-2" placeholder="What should change?" value={revision} onChange={(event) => setRevision(event.target.value)} required />
                <button className="rounded-xl border border-border px-4 py-2 text-sm font-bold" type="submit">Request revision</button>
              </form>
            </div>
          ) : null}
          {collab.role === "influencer" && collab.application.status === "approved" ? (
            <form className="space-y-2" onSubmit={(event) => { event.preventDefault(); void act("proof", { url }); }}>
              <h2 className="font-semibold">Proof of posting</h2>
              <input className="w-full rounded-xl border border-border px-3 py-2" placeholder="Live post URL" value={url} onChange={(event) => setUrl(event.target.value)} required />
              <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" type="submit">Mark complete</button>
            </form>
          ) : null}
          {collab.application.status === "completed" ? (
            <section className="space-y-2">
              <h2 className="font-semibold">Rating</h2>
              {collab.ratings.map((item) => (
                <p key={item.id} className="text-sm">{item.score} / 5 {item.comment ? `— ${item.comment}` : ""}</p>
              ))}
              {mine ? <p className="text-sm text-slate-500">You already left a rating.</p> : (
                <form className="space-y-2" onSubmit={(event) => { event.preventDefault(); void act("ratings", { score, comment }); }}>
                  <input type="number" min={1} max={5} value={score} onChange={(event) => setScore(Number(event.target.value))} className="w-24 rounded-xl border border-border px-3 py-2" />
                  <textarea className="w-full rounded-xl border border-border px-3 py-2" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Optional comment" />
                  <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" type="submit">Submit rating</button>
                </form>
              )}
            </section>
          ) : null}
          <Link href="/messages" className="text-sm font-semibold text-primary">Open messages</Link>
        </>
      ) : null}
    </main>
  );
}
