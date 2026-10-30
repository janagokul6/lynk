import { BottomNav } from "../BottomNav";
import type { NavItem } from "../BottomNav";

export const INFLUENCER_NAV_ITEMS: NavItem[] = [
  { label: "Find", icon: "search", href: "/marketplace" },
  { label: "Work", icon: "work", href: "/influencer/dashboard" },
  { label: "Profile", icon: "person", href: "/influencer/profile" },
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
