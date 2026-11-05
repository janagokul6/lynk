"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { APP_NAME } from "@/lib/constants";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { homePathForRole } from "@lynk/shared";
import { API_BASE_URL } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [google, setGoogle] = useState(false);

  useEffect(() => {
    void fetch(`${API_BASE_URL}/api/config`)
      .then((response) => response.json())
      .then((body: { googleLogin?: boolean }) => setGoogle(Boolean(body.googleLogin)))
      .catch(() => setGoogle(false));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const { error } = await authClient.signIn.email({ email, password });
    setPending(false);
    if (error) {
      toast.error(error.message ?? "Login failed");
      return;
    }
    toast.success("Welcome back");
    try {
      const me = await api.get<{ user?: { role?: string; roleChosenAt?: string | null } } | null>("/api/me");
      const account = me.data?.user;
      if (!account) return;
      if (account.role !== "admin" && !account.roleChosenAt) {
        router.push("/role");
        return;
      }
      router.push(homePathForRole(account.role));
    } catch {
      toast.error("Signed in, but the session could not be loaded.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background-light dark:bg-background-dark">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-white/80 dark:bg-surface-dark p-6 shadow-sm"
      >
        <div>
          <p className="text-sm font-semibold text-primary">{APP_NAME}</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Log in</h1>
        </div>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
        {google ? (
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              void authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/role` });
            }}
          >
            Continue with Google
          </Button>
        ) : (
          <p className="text-xs text-slate-500">Google sign-in is not configured.</p>
        )}
        <p className="text-sm">
          <Link href="/forgot-password" className="text-primary font-semibold">
            Forgot password
          </Link>
        </p>
        <p className="text-sm text-slate-500">
          New here?{" "}
          <Link href="/signup" className="text-primary font-semibold">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
