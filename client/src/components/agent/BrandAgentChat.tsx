"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import type { CreatorMatchResult } from "@lynk/shared";
import { CreatorMatchResults } from "./CreatorMatchResults";

export function BrandAgentChat() {
  useCopilotAction({
    name: "creators_match",
    available: "disabled",
    render: ({ status, result }) => (
      <CreatorMatchResults status={status} result={result as CreatorMatchResult | undefined} />
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
