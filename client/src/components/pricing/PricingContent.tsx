import Link from "next/link";

export function PricingContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pricing</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Lynk does not charge yet. Every new account is on the free plan. Pro is a layout flag: on a wide screen, chat and the dashboard sit side by side. There is no trial, no annual discount, and no checkout.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-border p-5">
          <h2 className="text-xl font-bold">Free</h2>
          <p className="mt-2 text-sm">Campaigns, applications, messages, profiles, and the assistant, within the server’s request limits.</p>
          <Link href="/signup" className="mt-4 inline-block rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-white">Create a free account</Link>
        </article>
        <article className="rounded-2xl border border-border p-5">
          <h2 className="text-xl font-bold">Pro</h2>
          <p className="mt-2 text-sm">Same product, with chat and the dashboard together on large screens. An operator sets this on the account. You cannot buy it in the app.</p>
        </article>
      </div>
    </div>
  );
}
