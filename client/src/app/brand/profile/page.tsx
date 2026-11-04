"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

type Brand = { companyName: string; logoUrl: string | null; category: string | null; website: string | null };

export default function BrandProfilePage() {
  const [account, setAccount] = useState<{ name?: string; email?: string }>({});
  const [profile, setProfile] = useState<Brand>({ companyName: "", logoUrl: "", category: "", website: "" });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void api.get<{ user?: { name?: string; email?: string } }>("/api/me").then((response) => setAccount(response.data.user ?? {}));
    void api.get<{ brand: Brand | null }>("/api/profiles/me").then((response) => {
      if (response.data.brand) {
        setProfile({
          companyName: response.data.brand.companyName,
          logoUrl: response.data.brand.logoUrl ?? "",
          category: response.data.brand.category ?? "",
          website: response.data.brand.website ?? "",
        });
      }
    });
  }, []);

  return (
    <AppLayout variant="brand" activeTab="Campaigns">
      <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
        <h1 className="text-2xl font-bold">Company profile</h1>
        <p className="text-sm text-slate-500">{account.name} · {account.email}</p>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void api
              .put("/api/profiles/brand", {
                companyName: profile.companyName,
                logoUrl: profile.logoUrl || "",
                category: profile.category || undefined,
                website: profile.website || "",
              })
              .then(() => setMessage("Company profile saved."));
          }}
        >
          <label className="block text-sm font-semibold">
            Company name
            <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={profile.companyName} onChange={(event) => setProfile({ ...profile, companyName: event.target.value })} required />
          </label>
          <label className="block text-sm font-semibold">
            Logo URL
            <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={profile.logoUrl ?? ""} onChange={(event) => setProfile({ ...profile, logoUrl: event.target.value })} />
          </label>
          <label className="block text-sm font-semibold">
            Category
            <select className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={profile.category ?? ""} onChange={(event) => setProfile({ ...profile, category: event.target.value })}>
              <option value="">Choose</option>
              {CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Website
            <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={profile.website ?? ""} onChange={(event) => setProfile({ ...profile, website: event.target.value })} />
          </label>
          <button className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-white" type="submit">Save</button>
        </form>
        {message ? <p className="text-sm">{message}</p> : null}
        <Link href="/settings" className="text-sm font-semibold text-primary">Account settings</Link>
      </div>
    </AppLayout>
  );
}
