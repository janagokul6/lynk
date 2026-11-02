import { ReactNode } from "react";
import { BottomNav, NavItem } from "./BottomNav";
import { InfluencerDashboardNav } from "./nav/InfluencerDashboardNav";
import { BrandDashboardNav } from "./nav/BrandDashboardNav";
import { AdminDashboardNav } from "./nav/AdminDashboardNav";

type DashboardVariant = "influencer" | "brand" | "admin";

export interface AppLayoutProps {
    children: ReactNode;
    header?: ReactNode;
    /** When set, uses the corresponding dashboard nav (no navItems needed). */
    variant?: DashboardVariant;
    /** Required when variant is set; optional when using navItems. */
    activeTab?: string;
    /** Legacy: use when variant is not set. */
    navItems?: NavItem[];
    hideBottomNav?: boolean;
}

export function AppLayout({ children, header, variant, activeTab, navItems, hideBottomNav = false }: AppLayoutProps) {
    const renderNav = () => {
        if (hideBottomNav) return null;
        if (variant === "influencer") return <InfluencerDashboardNav activeTab={activeTab ?? ""} />;
        if (variant === "brand") return <BrandDashboardNav activeTab={activeTab ?? ""} />;
        if (variant === "admin") return <AdminDashboardNav activeTab={activeTab ?? ""} />;
        return <BottomNav items={navItems} activeTab={activeTab} />;
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark lg:pl-64 w-full">
            {renderNav()}

            {/* Header Wrapper */}
            {header && (
                <div className="sticky top-0 z-40 w-full shrink-0">
                    {header}
                </div>
            )}

            {/* Main Content Area - naturally pushed correct amount */}
            <main className="flex-1 flex flex-col w-full pb-20 lg:pb-4">
                {children}
            </main>
        </div>
    );
}
