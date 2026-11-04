"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Row = { id: string; name: string; email: string; role: string; emailVerified: boolean };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Row[] | null>(null);
  useEffect(() => {
    void api.get<{ users: Row[] }>("/api/admin/users").then((response) => setUsers(response.data.users));
  }, []);
  return (
    <AppLayout variant="admin" activeTab="Users">
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-8">
        <h1 className="text-2xl font-bold">Users</h1>
        <ul className="space-y-2 text-sm">
          {users?.map((user) => (
            <li key={user.id} className="rounded-xl border border-border p-3">
              {user.name} · {user.email} · {user.role} · {user.emailVerified ? "verified" : "unverified"}
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
