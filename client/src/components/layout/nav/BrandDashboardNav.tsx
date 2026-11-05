import { BottomNav } from "../BottomNav";
import type { NavItem } from "../BottomNav";

const BRAND_NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: "chat", href: "/brand/home" },
  { label: "Discover", icon: "explore", href: "/brand/discovery" },
  { label: "Campaigns", icon: "campaign", href: "/brand/campaigns" },
  { label: "Applicants", icon: "group", href: "/brand/applications" },
  { label: "Inbox", icon: "mail", href: "/messages" },
];

export interface BrandDashboardNavProps {
  activeTab: string;
}

export function BrandDashboardNav({ activeTab }: BrandDashboardNavProps) {
  return (
    <BottomNav
      items={BRAND_NAV_ITEMS}
      activeTab={activeTab}
      logoLabel="Lynk"
      logoIcon="link"
    />
  );
}
