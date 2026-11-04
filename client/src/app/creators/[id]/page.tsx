import { formatInr } from "@lynk/shared";
import Link from "next/link";
import { notFound } from "next/navigation";

type Creator = {
  id: string;
  displayName: string;
  handle: string;
  platform: string;
  followerCount: number | null;
  engagementRate: number | null;
  niches: string[];
  country: string | null;
  verified: boolean;
  bio: string | null;
  rates: { story?: string; reel?: string; post?: string } | null;
};

async function loadCreator(id: string): Promise<Creator | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:43124";
  const response = await fetch(`${base}/api/profiles/creators/${id}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) return null;
  return response.json() as Promise<Creator>;
}

export default async function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creator = await loadCreator(id);
  if (!creator) notFound();
  return (
    <main className="mx-auto max-w-xl space-y-3 px-4 py-10">
      <Link href="/brand/discovery" className="text-sm font-semibold text-primary">Discovery</Link>
      <h1 className="text-3xl font-bold">{creator.displayName}</h1>
      <p className="text-sm text-slate-500">@{creator.handle} · {creator.platform} · {creator.verified ? "Linked Lynk account" : "Catalog profile"}</p>
      <p className="text-sm">Followers: {creator.followerCount ?? "Not stored"}</p>
      <p className="text-sm">Engagement: {creator.engagementRate ?? "Not stored"}</p>
      <p className="text-sm">Location: {creator.country ?? "Not stored"}</p>
      <p className="text-sm">Niches: {creator.niches.join(", ") || "None stored"}</p>
      {creator.bio ? <p className="whitespace-pre-wrap text-sm">{creator.bio}</p> : <p className="text-sm text-slate-500">No bio saved.</p>}
      {creator.rates ? (
        <p className="text-sm">
          Rates (INR): story {creator.rates.story ? formatInr(creator.rates.story) : "—"}, reel {creator.rates.reel ? formatInr(creator.rates.reel) : "—"}, post {creator.rates.post ? formatInr(creator.rates.post) : "—"}
        </p>
      ) : null}
    </main>
  );
}
