"use client";

import { api } from "@/lib/api";
import { CATEGORIES } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BrandOnboardingPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-lg space-y-4 px-4 py-10">
      <p className="text-xs font-bold uppercase text-primary">Company profile</p>
      <h1 className="text-3xl font-bold">Set up your brand</h1>
      <p className="text-sm text-slate-500">This is saved on your account and used as the name on new campaigns.</p>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          void api
            .put("/api/profiles/brand", {
              companyName,
              logoUrl,
              category: category || undefined,
              website,
            })
            .then(() => router.push("/brand/home"))
            .catch(() => setError("Could not save the company profile. Check that the logo and website are full URLs, or leave them blank."));
        }}
      >
        <label className="block text-sm font-semibold">
          Company name
          <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={companyName} onChange={(event) => setCompanyName(event.target.value)} required />
        </label>
        <label className="block text-sm font-semibold">
          Logo URL
          <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="https://" />
        </label>
        <label className="block text-sm font-semibold">
          Category
          <select className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Choose</option>
            {CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Website
          <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://" />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" type="submit">Save and continue</button>
      </form>
    </main>
  );
}
