import { PublicChrome } from "@/components/public/PublicChrome";
import Link from "next/link";

export default function PublicHomePage() {
  return (
    <PublicChrome>
      <section className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Find creators and run a collaboration in one place.</h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Lynk is a marketplace for brands and creators. Brands publish campaigns, creators apply, and both sides can message, submit work, and rate a finished collaboration.
        </p>
        <div className="flex gap-3">
          <Link href="/signup" className="rounded-xl bg-primary-500 px-5 py-3 font-bold text-white">Create an account</Link>
          <Link href="/login" className="rounded-xl border border-border px-5 py-3 font-bold">Log in</Link>
        </div>
      </section>
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          ["Publish", "Write a brief, set a pay band in INR, and list the campaign."],
          ["Apply", "Creators search live campaigns and send a short pitch."],
          ["Finish", "After acceptance, submit the work, approve it, add the live post, and leave a rating."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-border p-4">
            <h2 className="font-bold">{title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
          </article>
        ))}
      </section>
    </PublicChrome>
  );
}
