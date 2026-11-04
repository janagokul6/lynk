"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Invite = { id: string; campaignTitle: string; status: string };

export default function InvitesPage() {
  const router = useRouter();
  const [invites, setInvites] = useState<Invite[] | null>(null);

  function load() {
    return api.get<{ invites: Invite[] }>("/api/invites").then((response) => setInvites(response.data.invites));
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <AppLayout variant="influencer" activeTab="Invites">
      <div className="mx-auto max-w-xl space-y-3 px-4 py-8">
        <h1 className="text-2xl font-bold">Invites</h1>
        {invites?.length === 0 ? <p className="text-sm text-slate-500">No invites yet.</p> : null}
        <ul className="space-y-3">
          {invites?.map((invite) => (
            <li key={invite.id} className="rounded-xl border border-border p-4">
              <p className="font-semibold">{invite.campaignTitle}</p>
              <p className="text-sm uppercase text-slate-500">{invite.status}</p>
              {invite.status === "pending" ? (
                <div className="mt-2 flex gap-2">
                  <button type="button" className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white" onClick={() => void api.post(`/api/invites/${invite.id}/accept`).then((response) => {
                    const id = (response.data as { applicationId?: string }).applicationId;
                    if (id) router.push(`/collab/${id}`);
                    else void load();
                  })}>Accept</button>
                  <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm font-bold" onClick={() => void api.post(`/api/invites/${invite.id}/decline`).then(() => load())}>Decline</button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
        <Link href="/influencer/home" className="text-sm font-semibold text-primary">Home</Link>
      </div>
    </AppLayout>
  );
}
