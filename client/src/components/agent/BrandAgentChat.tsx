"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { CreatorMatchResults } from "./CreatorMatchResults";

type MatchResult = {
  count?: number;
  creators?: Array<{
    id: string;
    platform: string;
    handle: string;
    displayName: string;
    imageUrl?: string | null;
    followerCount?: number | null;
    engagementRate?: number | null;
    niches?: string[];
    country?: string | null;
  }>;
};

export function BrandAgentChat() {
  useCopilotAction({
    name: "creators_match",
    available: "disabled",
    render: ({ status, result }) => (
      <CreatorMatchResults status={status} result={result as MatchResult | undefined} />
    ),
  });

  return (
    <CopilotChat
      className="h-full"
      labels={{
        title: "Lynk Brand Agent",
        initial:
          "Tell me who you want to find — niche, platform, region, or campaign goal — and I’ll match creators.",
        placeholder: "Find beauty creators on Instagram in India…",
      }}
    />
  );
}
