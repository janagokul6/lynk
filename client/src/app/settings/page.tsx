"use client";

import { AccountLinks } from "@/components/account/AccountLinks";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Me = { user?: { id?: string; name?: string; email?: string; role?: string; emailVerified?: boolean } };

export default function SettingsPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me["user"] | null>(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Me | null>("/api/me")
      .then((response) => {
        if (!response.data?.user) {
          router.replace("/login");
          return;
        }
        setMe(response.data.user);
        setName(response.data.user.name ?? "");
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const home = me?.role === "influencer" ? "/influencer/home" : me?.role === "admin" ? "/admin/dashboard" : "/brand/home";

  return (
    <main className="mx-auto max-w-xl space-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <AccountLinks />
      </div>
      <Link href={home} className="text-sm font-semibold text-primary">Back home</Link>
      <p className="text-sm text-slate-500">{me?.email}</p>
      <p className="text-sm">{me?.emailVerified ? "Email verified." : "Email is not verified yet."}</p>
      {!me?.emailVerified ? (
        <button
          type="button"
          className="rounded-xl border border-border px-4 py-2 text-sm font-bold"
          onClick={() => {
            void authClient.sendVerificationEmail({ email: me?.email ?? "", callbackURL: window.location.origin }).then(() => {
              setMessage("Verification email sent. In local development it is also in the server log.");
            });
          }}
        >
          Resend verification email
        </button>
      ) : null}
      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          void authClient.updateUser({ name }).then(() => setMessage("Name saved."));
        }}
      >
        <h2 className="font-semibold">Name</h2>
        <input className="w-full rounded-xl border border-border px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} />
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" type="submit">Save name</button>
      </form>
      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          void authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true }).then((result) => {
            setMessage(result.error ? result.error.message ?? "Could not change password" : "Password updated.");
          });
        }}
      >
        <h2 className="font-semibold">Password</h2>
        <input type="password" className="w-full rounded-xl border border-border px-3 py-2" placeholder="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
        <input type="password" className="w-full rounded-xl border border-border px-3 py-2" placeholder="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} required />
        <button className="rounded-xl border border-border px-4 py-2 text-sm font-bold" type="submit">Change password</button>
      </form>
      <button
        type="button"
        className="rounded-xl border border-border px-4 py-2 text-sm font-bold"
        onClick={() => {
          void api.get("/api/me/export").then((response) => {
            const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "lynk-export.json";
            anchor.click();
            URL.revokeObjectURL(url);
          });
        }}
      >
        Download my data (JSON)
      </button>
      <form
        className="space-y-2 rounded-2xl border border-red-200 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void authClient.deleteUser({ password: deletePassword }).then((result) => {
            if (result.error) {
              setMessage(result.error.message ?? "Could not delete the account");
              return;
            }
            router.push("/");
          });
        }}
      >
        <h2 className="font-semibold text-red-700">Delete account</h2>
        <p className="text-sm text-slate-500">This removes your Lynk account and the campaigns, applications, and messages tied to it.</p>
        <input type="password" className="w-full rounded-xl border border-border px-3 py-2" placeholder="Confirm with your password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} required />
        <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white" type="submit">Delete account</button>
      </form>
      {message ? <p className="text-sm">{message}</p> : null}
    </main>
  );
}
