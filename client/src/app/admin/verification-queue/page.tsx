"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Row = { id: string; name: string; email: string; emailVerified: boolean };

export default function VerificationQueuePage() {
  const [users, setUsers] = useState<Row[] | null>(null);
  useEffect(() => {
    void api.get<{ users: Row[] }>("/api/admin/users").then((response) => {
      setUsers(response.data.users.filter((user) => !user.emailVerified));
    });
  }, []);
  return (
    <AppLayout variant="admin" activeTab="Trust">
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-8">
        <h1 className="text-2xl font-bold">Unverified emails</h1>
        <p className="text-sm text-slate-500">These accounts have not confirmed their email. There is no manual approval queue.</p>
        {users?.length === 0 ? <p className="text-sm">Everyone with an account in this list has verified their email.</p> : null}
        <ul className="space-y-2 text-sm">
          {users?.map((user) => (
            <li key={user.id} className="rounded-xl border border-border p-3">{user.name} · {user.email}</li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
