"use client";

type CreatorHit = {
  id: string;
  platform: string;
  handle: string;
  displayName: string;
  imageUrl?: string | null;
  followerCount?: number | null;
  engagementRate?: number | null;
  niches?: string[];
  country?: string | null;
};

type MatchResult = {
  count?: number;
  creators?: CreatorHit[];
};

function formatFollowers(n?: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function CreatorMatchResults({
  status,
  result,
}: {
  status: string;
  result?: MatchResult;
}) {
  if (status === "inProgress" || status === "executing") {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 text-sm text-slate-600 dark:text-slate-300">
        Searching creators…
      </div>
    );
  }

  if (!result) return null;

  const creators = result.creators ?? [];

  return (
    <div className="rounded-xl border border-border bg-white/90 dark:bg-surface-dark p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Creator matches</h3>
        <span className="text-xs font-semibold text-primary">
          {result.count ?? creators.length} found
        </span>
      </div>
      {creators.length === 0 ? (
        <p className="text-sm text-slate-500">
          No creators matched. Try a broader niche or platform.
        </p>
      ) : (
        <ul className="space-y-2">
          {creators.map((c) => (
            <li
              key={c.id}
              className="flex items-start gap-3 rounded-lg border border-border-subtle bg-slate-50 dark:bg-black/20 px-3 py-2"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold uppercase text-primary">
                {(c.displayName || c.handle).slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {c.displayName}
                  </span>
                  <span className="truncate text-xs text-slate-500">@{c.handle}</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <span className="capitalize">{c.platform}</span>
                  <span>{formatFollowers(c.followerCount)} followers</span>
                  {c.country ? <span>{c.country}</span> : null}
                  {c.engagementRate != null ? (
                    <span>{c.engagementRate.toFixed(1)}% eng</span>
                  ) : null}
                </div>
                {c.niches && c.niches.length > 0 ? (
                  <p className="text-[11px] text-slate-500">{c.niches.join(" · ")}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-slate-500">
        Next: ask me to refine by platform, followers, or draft a campaign around these creators.
      </p>
    </div>
  );
}
