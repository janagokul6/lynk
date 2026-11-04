import { BottomNav } from "../BottomNav";
import type { NavItem } from "../BottomNav";

const INFLUENCER_NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: "chat", href: "/influencer/home" },
  { label: "Find", icon: "search", href: "/marketplace" },
  { label: "Profile", icon: "person", href: "/influencer/profile" },
  { label: "Invites", icon: "mail", href: "/influencer/invites" },
  { label: "Inbox", icon: "chat_bubble", href: "/messages" },
];

export interface InfluencerDashboardNavProps {
  activeTab: string;
}

export function InfluencerDashboardNav({ activeTab }: InfluencerDashboardNavProps) {
  return (
    <BottomNav
      items={INFLUENCER_NAV_ITEMS}
      activeTab={activeTab}
      logoLabel="Lynk"
      logoIcon="link"
    />
  );
}
