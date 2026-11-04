"use client";

import { useState } from "react";
import { useCopilotAction, useCopilotChat } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import {
  ApplicationActionCards,
  CampaignActionCards,
  CampaignDraftCard,
  CompareTable,
  ConfirmToolCard,
  CreatorMatchWithActions,
  RoiEstimateCard,
} from "./generative";
import { HomeViewToggle } from "@/components/home/HomeViewToggle";
import type { HomeView } from "@/lib/home-view";

function ConfirmAction({
  name,
  tool,
  title,
  label,
}: {
  name: string;
  tool: string;
  title: string;
  label: string;
}) {
  useCopilotAction({
    name,
    available: "disabled",
    render: ({ result }) => {
      const proposal = result as
        | { needsConfirmation?: boolean; summary?: string; action?: string; input?: Record<string, unknown> }
        | undefined;
      if (!proposal?.needsConfirmation || !proposal.input) {
        return <p className="text-sm text-slate-500">Saved.</p>;
      }
      return (
        <ConfirmToolCard
          title={proposal.action ?? title}
          summary={proposal.summary ?? title}
          tool={tool}
          input={proposal.input}
          confirmLabel={label}
        />
      );
    },
  });
  return null;
}

function SuggestedPrompts({ prompts }: { prompts: readonly string[] }) {
  const { appendMessage, isLoading } = useCopilotChat();
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={isLoading}
          onClick={() =>
            void appendMessage(
              {
                id: crypto.randomUUID(),
                role: "user",
                content: prompt,
              } as never
            )
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
  const [chatError, setChatError] = useState<string | null>(null);
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
    name: "applications_withdraw",
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
          title="Withdraw application"
          summary={proposal.summary ?? "Withdraw this application."}
          tool="applications.withdraw"
          input={proposal.input}
          confirmLabel="Withdraw"
        />
      );
    },
  });
  useCopilotAction({
    name: "messages_status",
    available: "disabled",
    render: ({ result }) => {
      const data = result as { message?: string; threads?: { id: string | null; applicationId?: string; title: string; withName: string }[] } | undefined;
      return (
        <div className="rounded-xl border border-border bg-white p-3 text-sm dark:bg-surface-dark">
          <p>{data?.message ?? "No conversations yet."}</p>
          {data?.threads?.length ? (
            <ul className="mt-2 space-y-1">
              {data.threads.map((thread) => (
                <li key={thread.id ?? thread.applicationId}>{thread.title} with {thread.withName}</li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    },
  });

  return (
    <div className="flex h-full min-h-[28rem] flex-col gap-3">
      <ConfirmAction name="messages_send" tool="messages.send" title="Send message" label="Send" />
      <ConfirmAction name="invites_create" tool="invites.create" title="Invite creator" label="Send invite" />
      <ConfirmAction name="invites_respond" tool="invites.respond" title="Respond to invite" label="Confirm" />
      <ConfirmAction name="collab_submit" tool="collab.submit" title="Submit content" label="Submit" />
      <ConfirmAction name="collab_revision" tool="collab.revision" title="Request revision" label="Request revision" />
      <ConfirmAction name="collab_approve" tool="collab.approve" title="Approve content" label="Approve" />
      <ConfirmAction name="collab_proof" tool="collab.proof" title="Submit proof" label="Mark complete" />
      <ConfirmAction name="collab_rate" tool="collab.rate" title="Leave a rating" label="Submit rating" />
      <SuggestedPrompts prompts={prompts} />
      <div className="min-h-[24rem] flex-1">
        {chatError ? (
          <div role="alert" data-testid="chat-error" className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {chatError}
          </div>
        ) : null}
        <CopilotChat
          className="h-full"
          onError={() => {
            setChatError("The assistant hit an error. Nothing was changed.");
          }}
          labels={{
            title: role === "brand" ? "Lynk for brands" : "Lynk for creators",
            initial:
              role === "brand"
                ? "Ask me to find creators, review applicants, or draft a campaign. I won’t publish anything until you confirm."
                : "Ask me which campaigns fit you, or what’s pending. Messages open after a collaboration is accepted.",
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
