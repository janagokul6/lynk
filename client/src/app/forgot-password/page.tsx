"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-md space-y-4 px-4 py-16">
      <h1 className="text-2xl font-bold">Reset password</h1>
      <p className="text-sm text-slate-500">If an account exists, we send a reset link. In local development the link is also in the server log.</p>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void authClient.requestPasswordReset({
            email,
            redirectTo: `${window.location.origin}/reset-password`,
          }).then(() => setMessage("If that email has an account, check it for a reset link."));
        }}
      >
        <label className="block text-sm font-semibold">
          Email
          <input type="email" required className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" type="submit">Send reset link</button>
      </form>
      {message ? <p className="text-sm">{message}</p> : null}
      <Link href="/login" className="text-sm font-semibold text-primary">Back to log in</Link>
    </main>
  );
}
