"use client";

import { useEffect, useState } from "react";
import { TOOL_CONFIRM_HEADER, type CreatorMatchHit } from "@lynk/shared";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

type CampaignCard = {
  id: string;
  title: string;
  brandName?: string | null;
  niches?: string[];
  platforms?: string[];
  payMin?: string;
  payMax?: string;
  location?: string | null;
  compensationType?: string;
};

type ApplicationCard = {
  id: string;
  status: string;
  message?: string | null;
  campaignTitle?: string;
  influencerName?: string;
  campaignId?: string;
};

function formatFollowers(n?: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function ConfirmToolCard({
  title,
  summary,
  tool,
  input,
  confirmLabel,
}: {
  title: string;
  summary: string;
  tool: string;
  input: Record<string, unknown>;
  confirmLabel: string;
}) {
  const [state, setState] = useState<"idle" | "pending" | "done">("idle");
  const [detail, setDetail] = useState<string | null>(null);

  async function approve() {
    setState("pending");
    try {
      const res = await api.post(`/api/tools/${tool}`, input, {
        headers: { [TOOL_CONFIRM_HEADER]: "1" },
      });
      const result = res.data?.result as { status?: string; title?: string; published?: boolean } | undefined;
      setState("done");
      if (result?.published) setDetail(`Posted “${result.title ?? "campaign"}” to the marketplace.`);
      else if (result?.status) setDetail(`Saved. Status: ${result.status}.`);
      else setDetail("Saved.");
    } catch {
      setState("idle");
    }
  }

  return (
    <div className="rounded-xl border border-amber-300/80 bg-amber-50 p-4 text-sm dark:border-amber-500/40 dark:bg-amber-500/10">
      <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">Confirm</p>
      <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-slate-700 dark:text-slate-200">{summary}</p>
      {state === "done" ? (
        <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">{detail}</p>
      ) : (
        <button
          type="button"
          disabled={state === "pending"}
          onClick={approve}
          className="mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
        >
          {state === "pending" ? "Saving…" : confirmLabel}
        </button>
      )}
    </div>
  );
}

export function CreatorActionCards({ creators }: { creators: CreatorMatchHit[] }) {
  const [campaigns, setCampaigns] = useState<CampaignCard[]>([]);
  const [inviteFor, setInviteFor] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState("");

  useEffect(() => {
    api
      .get<CampaignCard[]>("/api/campaigns")
      .then((res) => setCampaigns(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCampaigns([]));
  }, []);

  async function shortlist(creator: CreatorMatchHit) {
    await api.post("/api/shortlist", { creatorId: creator.id });
    toast.success(`Shortlisted @${creator.handle}`);
  }

  const selected = campaigns.find((campaign) => campaign.id === campaignId);

  return (
    <div className="space-y-2">
      {creators.map((creator) => (
        <article key={creator.id} className="rounded-xl border border-border bg-white p-3 dark:bg-surface-dark">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{creator.displayName}</h3>
              <p className="text-xs text-slate-500">
                @{creator.handle} · {creator.platform} · {formatFollowers(creator.followerCount)} followers
                {creator.engagementRate != null ? ` · ${creator.engagementRate}% eng` : ""}
              </p>
              {creator.niches?.length ? (
                <p className="mt-1 text-[11px] text-slate-500">{creator.niches.join(" · ")}</p>
              ) : null}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-white"
              onClick={() => shortlist(creator)}
            >
              Shortlist
            </button>
            <button
              type="button"
              className="rounded-md border border-border px-2.5 py-1 text-[11px] font-bold"
              onClick={() => setInviteFor(inviteFor === creator.id ? null : creator.id)}
            >
              Invite to campaign
            </button>
          </div>
          {inviteFor === creator.id ? (
            <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-2 dark:bg-black/20">
              {campaigns.length === 0 ? (
                <p className="text-xs text-slate-500">Create a campaign before inviting. This does not message the creator.</p>
              ) : (
                <>
                  <select
                    className="w-full rounded-md border border-border bg-white px-2 py-1 text-xs dark:bg-surface-dark"
                    value={campaignId}
                    onChange={(event) => setCampaignId(event.target.value)}
                  >
                    <option value="">Choose a campaign</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </option>
                    ))}
                  </select>
                  {selected ? (
                    <ConfirmToolCard
                      title={`Invite @${creator.handle}`}
                      summary={`Invite @${creator.handle} to “${selected.title}”. They are notified in the app and by email when they have a Lynk account.`}
                      tool="invites.create"
                      input={{ creatorId: creator.id, campaignId: selected.id }}
                      confirmLabel="Send invite"
                    />
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function CompareTable({
  creators,
}: {
  creators: Array<CreatorMatchHit & { sufficient?: boolean }>;
}) {
  if (creators.length === 0) {
    return <p className="text-sm text-slate-500">Pick at least two creators to compare.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-black/20">
          <tr>
            <th className="px-3 py-2 font-semibold">Creator</th>
            <th className="px-3 py-2 font-semibold">Platform</th>
            <th className="px-3 py-2 font-semibold">Followers</th>
            <th className="px-3 py-2 font-semibold">Engagement</th>
            <th className="px-3 py-2 font-semibold">Niches</th>
          </tr>
        </thead>
        <tbody>
          {creators.map((creator) => (
            <tr key={creator.id} className="border-t border-border">
              <td className="px-3 py-2">
                {creator.displayName}
                <div className="text-slate-500">@{creator.handle}</div>
              </td>
              <td className="px-3 py-2 capitalize">{creator.platform}</td>
              <td className="px-3 py-2">{formatFollowers(creator.followerCount)}</td>
              <td className="px-3 py-2">{creator.engagementRate == null ? "—" : `${creator.engagementRate}%`}</td>
              <td className="px-3 py-2">{creator.niches?.join(", ") || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CreatorMatchWithActions({
  status,
  result,
}: {
  status: string;
  result?: { creators?: CreatorMatchHit[]; count?: number; missingIds?: string[] } | null;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [compared, setCompared] = useState<CreatorMatchHit[] | null>(null);

  if (status === "inProgress" || status === "executing") {
    return <p className="text-sm text-slate-500">Searching creators…</p>;
  }
  const creators = result?.creators ?? [];
  if (creators.length === 0) return <p className="text-sm text-slate-500">No creators matched.</p>;

  async function toggleCompare(id: string) {
    const next = picked.includes(id) ? picked.filter((item) => item !== id) : [...picked, id].slice(-4);
    setPicked(next);
    if (next.length < 2) {
      setCompared(null);
      return;
    }
    const res = await api.post("/api/tools/creators.compare", { creatorIds: next });
    setCompared(res.data?.result?.creators ?? []);
  }

  return (
    <div className="space-y-3">
      <CreatorActionCards creators={creators} />
      <div className="flex flex-wrap gap-2">
        {creators.map((creator) => (
          <button
            key={creator.id}
            type="button"
            onClick={() => toggleCompare(creator.id)}
            className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
              picked.includes(creator.id) ? "border-primary text-primary" : "border-border text-slate-500"
            }`}
          >
            Compare @{creator.handle}
          </button>
        ))}
      </div>
      {compared ? <CompareTable creators={compared} /> : null}
    </div>
  );
}

export function CampaignActionCards({
  campaigns,
  canApply,
}: {
  campaigns: CampaignCard[];
  canApply: boolean;
}) {
  const [pending, setPending] = useState<CampaignCard | null>(null);
  if (campaigns.length === 0) return <p className="text-sm text-slate-500">No live campaigns matched.</p>;
  return (
    <div className="space-y-2">
      {campaigns.map((campaign) => (
        <article key={campaign.id} className="rounded-xl border border-border bg-white p-3 dark:bg-surface-dark">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{campaign.title}</h3>
          <p className="text-xs text-slate-500">
            {campaign.brandName || "Brand"} · {campaign.compensationType || "Pay"} {campaign.payMin}–{campaign.payMax}
            {campaign.location ? ` · ${campaign.location}` : ""}
          </p>
          {campaign.niches?.length ? <p className="mt-1 text-[11px] text-slate-500">{campaign.niches.join(" · ")}</p> : null}
          {canApply ? (
            <button
              type="button"
              className="mt-2 rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-white"
              onClick={() => setPending(campaign)}
            >
              Apply
            </button>
          ) : null}
        </article>
      ))}
      {pending ? (
        <ConfirmToolCard
          title={`Apply to ${pending.title}`}
          summary="This sends your application to the brand. You can withdraw it later while it is pending."
          tool="applications.apply"
          input={{ campaignId: pending.id }}
          confirmLabel="Send application"
        />
      ) : null}
    </div>
  );
}

export function ApplicationActionCards({
  applications,
  canDecide,
}: {
  applications: ApplicationCard[];
  canDecide: boolean;
}) {
  if (applications.length === 0) return <p className="text-sm text-slate-500">No applications.</p>;
  return (
    <div className="space-y-2">
      {applications.map((application) => (
        <article key={application.id} className="rounded-xl border border-border bg-white p-3 text-sm dark:bg-surface-dark">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {application.campaignTitle || application.influencerName || "Application"}
            </h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase text-slate-600 dark:bg-white/10">
              {application.status}
            </span>
          </div>
          {application.influencerName ? (
            <p className="text-xs text-slate-500">{application.influencerName}</p>
          ) : null}
          {application.message ? <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{application.message}</p> : null}
          {canDecide && application.status === "pending" ? (
            <div className="mt-2 flex gap-2">
              <ConfirmToolCard
                title="Accept applicant"
                summary={`Accept ${application.influencerName ?? "this applicant"}.`}
                tool="applications.decide"
                input={{ applicationId: application.id, decision: "accepted" }}
                confirmLabel="Accept"
              />
              <ConfirmToolCard
                title="Reject applicant"
                summary={`Reject ${application.influencerName ?? "this applicant"}.`}
                tool="applications.decide"
                input={{ applicationId: application.id, decision: "rejected" }}
                confirmLabel="Reject"
              />
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function RoiEstimateCard({
  result,
}: {
  result?: {
    label?: string;
    sufficient?: boolean;
    reason?: string;
    assumptions?: string[];
    inputs?: { budget?: number | null; budgetSource?: string };
    combined?: {
      expectedEngagements?: { low: number; high: number };
      costPerEngagement?: { low: number; high: number };
    };
  } | null;
}) {
  if (!result) return null;
  return (
    <div className="rounded-xl border border-border bg-white p-4 text-sm dark:bg-surface-dark">
      <p className="text-xs font-bold uppercase tracking-wide text-primary">Estimate</p>
      <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">Cost per engagement</h3>
      {result.sufficient === false ? (
        <p className="mt-2 text-slate-600 dark:text-slate-300">{result.reason}</p>
      ) : (
        <div className="mt-2 space-y-1 text-slate-700 dark:text-slate-200">
          {result.combined?.expectedEngagements ? (
            <p>
              Expected engagements: {result.combined.expectedEngagements.low}–{result.combined.expectedEngagements.high}
            </p>
          ) : null}
          {result.combined?.costPerEngagement ? (
            <p>
              Cost per engagement: {result.combined.costPerEngagement.low}–{result.combined.costPerEngagement.high}
            </p>
          ) : (
            <p>No cost range. Add a budget or a campaign with pay.</p>
          )}
          {result.inputs?.budget != null ? <p>Budget used: {result.inputs.budget} ({result.inputs.budgetSource})</p> : null}
        </div>
      )}
      {result.assumptions?.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-500">
          {result.assumptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function CampaignDraftCard({
  result,
}: {
  result?: {
    needsConfirmation?: boolean;
    summary?: string;
    input?: Record<string, unknown>;
    draft?: Record<string, unknown>;
    note?: string;
    saved?: boolean;
  } | null;
}) {
  if (!result) return null;
  const draft = (result.draft ?? result.input ?? {}) as {
    title?: string;
    description?: string;
    payMin?: string;
    payMax?: string;
    publish?: boolean;
  };
  const input = { ...(result.input ?? result.draft ?? {}), publish: false };
  return (
    <div className="space-y-2 rounded-xl border border-border bg-white p-4 text-sm dark:bg-surface-dark">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Campaign draft</p>
      <h3 className="font-semibold text-slate-900 dark:text-white">{draft.title || "Untitled campaign"}</h3>
      {draft.description ? <p className="text-slate-600 dark:text-slate-300">{draft.description}</p> : null}
      {draft.payMin || draft.payMax ? (
        <p className="text-xs text-slate-500">
          Pay {draft.payMin}–{draft.payMax}
        </p>
      ) : null}
      <p className="text-xs text-slate-500">{result.note || result.summary || "Nothing is published until you confirm."}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <ConfirmToolCard
          title="Save draft"
          summary="Saves this campaign as a draft. It stays off the marketplace."
          tool="campaigns.create"
          input={{ ...input, publish: false }}
          confirmLabel="Save draft"
        />
        <ConfirmToolCard
          title="Post to marketplace"
          summary="Posts this campaign live so creators can apply."
          tool="campaigns.create"
          input={{ ...input, publish: true }}
          confirmLabel="Post campaign"
        />
      </div>
    </div>
  );
}

export function UnavailableCard({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-4 text-sm text-slate-600 dark:text-slate-300">
      {message}
    </div>
  );
}
