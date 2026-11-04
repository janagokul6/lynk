import type { UserRole } from "./roles.js";
import { toolNames, type ToolName } from "./tools.js";

export type ToolCaller = { kind: "key" } | { kind: "session"; role: string };

type ToolPolicy = {
  roles: readonly UserRole[];
  agentKey: boolean;
};

export const toolPolicies: Record<ToolName, ToolPolicy> = {
  "health.check": { roles: ["brand", "influencer", "admin"], agentKey: true },
  "creators.match": { roles: ["brand", "admin"], agentKey: true },
  "creators.enqueue_sync": { roles: ["brand", "admin"], agentKey: false },
  "creators.compare": { roles: ["brand"], agentKey: false },
  "shortlist.list": { roles: ["brand"], agentKey: false },
  "shortlist.add": { roles: ["brand"], agentKey: false },
  "shortlist.remove": { roles: ["brand"], agentKey: false },
  "shortlist.group": { roles: ["brand"], agentKey: false },
  "roi.estimate": { roles: ["brand"], agentKey: false },
  "campaigns.preview": { roles: ["brand"], agentKey: false },
  "campaigns.create": { roles: ["brand"], agentKey: false },
  "applications.incoming": { roles: ["brand"], agentKey: false },
  "applications.decide": { roles: ["brand"], agentKey: false },
  "marketplace.search": { roles: ["influencer"], agentKey: false },
  "applications.mine": { roles: ["influencer"], agentKey: false },
  "applications.apply": { roles: ["influencer"], agentKey: false },
  "applications.withdraw": { roles: ["influencer"], agentKey: false },
  "insights.public": { roles: ["influencer"], agentKey: false },
  "messages.status": { roles: ["brand", "influencer"], agentKey: false },
};

export function toolCallerAllowed(name: ToolName, caller: ToolCaller): boolean {
  const policy = toolPolicies[name];
  if (caller.kind === "key") return policy.agentKey;
  return policy.roles.includes(caller.role as UserRole);
}

export function toolsForCaller(caller: ToolCaller): ToolName[] {
  return toolNames.filter((name) => toolCallerAllowed(name, caller));
}
