"use client";

import { useCopilotAction, useCopilotChatHeadless_c } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import {
  ApplicationActionCards,
  CampaignActionCards,
  CampaignDraftCard,
  CompareTable,
  ConfirmToolCard,
  CreatorMatchWithActions,
  RoiEstimateCard,
  UnavailableCard,
} from "./generative";
import { HomeViewToggle } from "@/components/home/HomeViewToggle";
import type { HomeView } from "@/lib/home-view";

function SuggestedPrompts({ prompts }: { prompts: readonly string[] }) {
  const { sendMessage, isLoading } = useCopilotChatHeadless_c();
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={isLoading}
          onClick={() =>
            sendMessage({
              id: crypto.randomUUID(),
              role: "user",
              content: prompt,
            })
          }
          className="rounded-full border border-border px-3 py-1 text-left text-[11px] font-semibold text-slate-600 hover:border-primary hover:text-primary disabled:opacity-50 dark:text-slate-300"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

export function RoleAgentChat({
  role,
  prompts,
  view,
  onToggle,
}: {
  role: "brand" | "influencer";
  prompts: readonly string[];
  view: HomeView;
  onToggle: () => void;
}) {
  useCopilotAction({
    name: "creators_match",
    available: "disabled",
    render: ({ status, result }) => (
      <CreatorMatchWithActions status={status} result={result as { creators?: [] } | undefined} />
    ),
  });
  useCopilotAction({
    name: "creators_compare",
    available: "disabled",
    render: ({ status, result }) =>
      status === "executing" || status === "inProgress" ? (
        <p className="text-sm text-slate-500">Comparing…</p>
      ) : (
        <CompareTable creators={(result as { creators?: [] } | undefined)?.creators ?? []} />
      ),
  });
  useCopilotAction({
    name: "marketplace_search",
    available: "disabled",
    render: ({ status, result }) =>
      status === "executing" || status === "inProgress" ? (
        <p className="text-sm text-slate-500">Searching campaigns…</p>
      ) : (
        <CampaignActionCards
          campaigns={(result as { campaigns?: [] } | undefined)?.campaigns ?? []}
          canApply={role === "influencer"}
        />
      ),
  });
  useCopilotAction({
    name: "applications_mine",
    available: "disabled",
    render: ({ result }) => (
      <ApplicationActionCards
        applications={(result as { applications?: [] } | undefined)?.applications ?? []}
        canDecide={false}
      />
    ),
  });
  useCopilotAction({
    name: "applications_incoming",
    available: "disabled",
    render: ({ result }) => (
      <ApplicationActionCards
        applications={(result as { applications?: [] } | undefined)?.applications ?? []}
        canDecide={role === "brand"}
      />
    ),
  });
  useCopilotAction({
    name: "roi_estimate",
    available: "disabled",
    render: ({ result }) => <RoiEstimateCard result={result as { label?: string } | undefined} />,
  });
  useCopilotAction({
    name: "campaigns_preview",
    available: "disabled",
    render: ({ result }) => <CampaignDraftCard result={result as { note?: string } | undefined} />,
  });
  useCopilotAction({
    name: "campaigns_create",
    available: "disabled",
    render: ({ result }) => <CampaignDraftCard result={result as { summary?: string } | undefined} />,
  });
  useCopilotAction({
    name: "applications_apply",
    available: "disabled",
    render: ({ result }) => {
      const proposal = result as
        | { needsConfirmation?: boolean; summary?: string; input?: Record<string, unknown> }
        | undefined;
      if (!proposal?.needsConfirmation || !proposal.input) {
        return <p className="text-sm text-slate-500">Application updated.</p>;
      }
      return (
        <ConfirmToolCard
          title="Apply to campaign"
          summary={proposal.summary ?? "Send this application."}
          tool="applications.apply"
          input={proposal.input}
          confirmLabel="Send application"
        />
      );
    },
  });
  useCopilotAction({
    name: "applications_decide",
    available: "disabled",
    render: ({ result }) => {
      const proposal = result as
        | { needsConfirmation?: boolean; summary?: string; action?: string; input?: Record<string, unknown> }
        | undefined;
      if (!proposal?.needsConfirmation || !proposal.input) {
        return <p className="text-sm text-slate-500">Decision saved.</p>;
      }
      return (
        <ConfirmToolCard
          title={proposal.action ?? "Update application"}
          summary={proposal.summary ?? "Confirm this decision."}
          tool="applications.decide"
          input={proposal.input}
          confirmLabel="Confirm"
        />
      );
    },
  });
  useCopilotAction({
    name: "messages_status",
    available: "disabled",
    render: ({ result }) => (
      <UnavailableCard message={(result as { message?: string } | undefined)?.message ?? "Messaging is not available yet."} />
    ),
  });

  return (
    <div className="flex h-full min-h-[28rem] flex-col gap-3">
      <SuggestedPrompts prompts={prompts} />
      <div className="min-h-0 flex-1">
        <CopilotChat
          className="h-full"
          labels={{
            title: role === "brand" ? "Lynk for brands" : "Lynk for creators",
            initial:
              role === "brand"
                ? "Ask me to find creators, review applicants, or draft a campaign. I won’t publish anything until you confirm."
                : "Ask me which campaigns fit you, or what’s pending on your applications. Messaging isn’t available yet.",
            placeholder: role === "brand" ? "Find creators or draft a campaign…" : "Search live campaigns…",
          }}
        />
      </div>
      <div className="flex justify-end">
        <HomeViewToggle view={view} onToggle={onToggle} testId="home-view-toggle-composer" />
      </div>
    </div>
  );
}
