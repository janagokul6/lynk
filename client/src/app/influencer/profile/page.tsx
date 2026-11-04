"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";

type Profile = { bio: string; niches: string[]; location: string | null; rates: { story?: string; reel?: string; post?: string } };
type Connection = { platform: string; handle: string | null };
type Config = { youtubeConnect: boolean; instagramConnect: boolean };

export default function InfluencerProfilePage() {
  const [profile, setProfile] = useState<Profile>({ bio: "", niches: [], location: "", rates: {} });
  const [nicheText, setNicheText] = useState("");
  const [connections, setConnections] = useState<Connection[]>([]);
  const [config, setConfig] = useState<Config>({ youtubeConnect: false, instagramConnect: false });
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    void api.get<{ user?: { name?: string } }>("/api/me").then((response) => setName(response.data.user?.name ?? ""));
    void api.get<{ influencer: Profile | null }>("/api/profiles/me").then((response) => {
      const row = response.data.influencer;
      if (!row) return;
      setProfile({ ...row, location: row.location ?? "" });
      setNicheText(row.niches.join(", "));
    });
    void api.get<{ connections: Connection[] }>("/api/connections").then((response) => setConnections(response.data.connections));
    void api.get<Config>("/api/config").then((response) => setConfig(response.data));
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected")) setMessage(`Connected ${params.get("connected")}.`);
    if (params.get("connectError") === "not_configured") setMessage("That connection is not configured on this server.");
    else if (params.get("connectError")) setMessage("Could not finish the social connection.");
  }, []);

  return (
    <AppLayout variant="influencer" activeTab="Profile">
      <div className="mx-auto max-w-xl space-y-6 px-4 py-8">
        <h1 className="text-2xl font-bold">{name || "Your profile"}</h1>
        <p className="text-sm text-slate-500">This profile is yours. Brands see it when you save, including in discovery.</p>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void api
              .put("/api/profiles/influencer", {
                bio: profile.bio,
                niches: nicheText.split(",").map((item) => item.trim()).filter(Boolean),
                location: profile.location ?? "",
                rates: profile.rates,
              })
              .then(() => setMessage("Profile saved."));
          }}
        >
          <label className="block text-sm font-semibold">
            Bio
            <textarea className="mt-1 w-full rounded-xl border border-border px-3 py-2" rows={4} value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} />
          </label>
          <label className="block text-sm font-semibold">
            Niches
            <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={nicheText} onChange={(event) => setNicheText(event.target.value)} placeholder="beauty, skincare" />
          </label>
          <label className="block text-sm font-semibold">
            Location
            <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={profile.location ?? ""} onChange={(event) => setProfile({ ...profile, location: event.target.value })} />
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["story", "reel", "post"] as const).map((key) => (
              <label key={key} className="text-sm font-semibold">
                {key} INR
                <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={profile.rates[key] ?? ""} onChange={(event) => setProfile({ ...profile, rates: { ...profile.rates, [key]: event.target.value } })} />
              </label>
            ))}
          </div>
          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" type="submit">Save profile</button>
        </form>
        <section className="space-y-2">
          <h2 className="font-semibold">Social accounts</h2>
          {connections.length === 0 ? <p className="text-sm text-slate-500">No accounts connected.</p> : null}
          <ul className="text-sm">
            {connections.map((item) => (
              <li key={item.platform}>{item.platform}: {item.handle ?? "connected"}</li>
            ))}
          </ul>
          {config.youtubeConnect ? (
            <a className="inline-block rounded-xl border border-border px-4 py-2 text-sm font-bold" href={`${API_BASE_URL}/api/connections/youtube/start`}>Connect YouTube</a>
          ) : (
            <p className="text-sm text-slate-500">YouTube connect is not configured.</p>
          )}
          {config.instagramConnect ? (
            <a className="inline-block rounded-xl border border-border px-4 py-2 text-sm font-bold" href={`${API_BASE_URL}/api/connections/instagram/start`}>Connect Instagram</a>
          ) : (
            <p className="text-sm text-slate-500">Instagram connect is not configured.</p>
          )}
        </section>
        {message ? <p className="text-sm">{message}</p> : null}
      </div>
    </AppLayout>
  );
}
