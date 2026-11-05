"use client";

import { PublicChrome } from "@/components/public/PublicChrome";
import { useState } from "react";

const FAQS = [
  {
    question: "How does matching work?",
    answer: "Search uses creator niches, handles, and stored follower counts. When an OpenAI key is configured, search embeddings come from that model. Otherwise Lynk uses a local fallback. It does not predict revenue.",
  },
  {
    question: "When do creators get paid?",
    answer: "Payouts are not live. Brands and creators agree on the pay band in the campaign and settle outside Lynk.",
  },
  {
    question: "What does Pro include?",
    answer: "Pro shows chat and the dashboard side by side on a wide screen. There is no checkout. New accounts are on the free plan.",
  },
  {
    question: "How do I verify my email?",
    answer: "Lynk emails a verification link when you sign up, if a mail provider is configured. In local development the link is written to the server log. You can resend it from Settings.",
  },
  {
    question: "How do I connect Instagram or YouTube?",
    answer: "From your creator profile, use Connect when the server has OAuth credentials. If it does not, the page says the connection is not configured.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState(0);
  return (
    <PublicChrome>
      <h1 className="text-3xl font-bold">Help</h1>
      <div className="mt-6 space-y-2">
        {FAQS.map((item, index) => (
          <button
            key={item.question}
            type="button"
            className="block w-full rounded-xl border border-border p-4 text-left"
            onClick={() => setOpen(index)}
          >
            <span className="font-semibold">{item.question}</span>
            {open === index ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.answer}</p> : null}
          </button>
        ))}
      </div>
    </PublicChrome>
  );
}
