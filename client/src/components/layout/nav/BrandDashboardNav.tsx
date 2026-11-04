import { BottomNav } from "../BottomNav";
import type { NavItem } from "../BottomNav";

const BRAND_NAV_ITEMS: NavItem[] = [
  { label: "Discover", icon: "explore", href: "/brand/discovery" },
  { label: "Calculator", icon: "calculate", href: "/brand/roi-calculator" },
  { label: "Campaigns", icon: "campaign", href: "/brand/campaigns" },
  { label: "Profile", icon: "person", href: "/brand/profile" },
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
