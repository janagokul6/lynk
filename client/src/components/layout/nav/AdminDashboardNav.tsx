import { BottomNav } from "../BottomNav";
import type { NavItem } from "../BottomNav";

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/admin/dashboard" },
  { label: "Users", icon: "group", href: "/admin/user-management" },
  { label: "Trust", icon: "verified_user", href: "/admin/verification-queue" },
  { label: "Settings", icon: "settings", href: "#" },
];

export interface AdminDashboardNavProps {
  activeTab: string;
}

export function AdminDashboardNav({ activeTab }: AdminDashboardNavProps) {
  return (
    <BottomNav
      items={ADMIN_NAV_ITEMS}
      activeTab={activeTab}
      logoLabel="OPS CENTER"
      logoIcon="ecg_heart"
    />
  );
}
