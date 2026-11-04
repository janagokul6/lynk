"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@lynk/shared";
import { USER_ROLES, homePathForRole } from "@lynk/shared";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { APP_NAME } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("brand");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      role,
    } as Parameters<typeof authClient.signUp.email>[0] & { role: UserRole });
    setPending(false);
    if (error) {
      toast.error(error.message ?? "Signup failed");
      return;
    }
    toast.success("Account created");
    router.push(homePathForRole(role));
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background-light dark:bg-background-dark">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-white/80 dark:bg-surface-dark p-6 shadow-sm"
      >
        <div>
          <p className="text-sm font-semibold text-primary">{APP_NAME}</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
        </div>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
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
          minLength={8}
          required
        />
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">I am a</span>
          <select
            className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            {USER_ROLES.filter((r) => r !== "admin").map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating…" : "Sign up"}
        </Button>
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
