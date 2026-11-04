"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState("");
  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
  }, []);

  return (
    <main className="mx-auto max-w-md space-y-4 px-4 py-16">
      <h1 className="text-2xl font-bold">Choose a new password</h1>
      {!token ? <p className="text-sm text-red-600">This reset link is missing a token.</p> : null}
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void authClient.resetPassword({ newPassword: password, token }).then((result) => {
            setMessage(result.error ? result.error.message ?? "Could not reset the password" : "Password updated. You can log in.");
          });
        }}
      >
        <label className="block text-sm font-semibold">
          New password
          <input type="password" minLength={8} required className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" type="submit" disabled={!token}>Update password</button>
      </form>
      {message ? <p className="text-sm">{message}</p> : null}
      <Link href="/login" className="text-sm font-semibold text-primary">Log in</Link>
    </main>
  );
}
