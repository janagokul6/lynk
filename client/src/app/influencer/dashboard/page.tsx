import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/cards/StatCard";
import { CampaignCard } from "@/components/cards/CampaignCard";
import { ApplicationTimeline } from "@/components/sections/ApplicationTimeline";

export default function InfluencerDashboardPage() {
  const userData = {
    name: "Sarah Jenkins",
    role: "Welcome back",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbfE76chEJIW3_Tk0RLn5gOcVW0stmCX-xrauIsA2-_eyd95qbongV19IeAx73BNJy4LRCDRBfaAsF1wgJEjjMaFWIpmTyxBgVGsH_JkaCbH9GkspuhOWyJg9Cli8QdbZKpxQNQWpqNC_yz93wyeNVsMLPeBuTbhUkIJiraMkJH6bn3NRbUOKQQmBfukM0O8GZxvPrNBRHWKXDLivn1IX1ArpsvaTQ33h-1ejV-wsgfNvi6KMJqCRSlVL1QA8JjnotAP4nvRfmwWY",
    isOnline: true,
  };

  const stats = [
    { icon: "currency_rupee", label: "Earnings", value: "₹4,200", change: "+12%", changeType: "positive" as const, iconColor: "text-primary-500" },
    { icon: "handshake", label: "Active", value: "3", subtitle: "Collabs", iconColor: "text-purple-400" },
    { icon: "bar_chart", label: "Reach", value: "125k", change: "+5%", changeType: "positive" as const, iconColor: "text-orange-400" },
  ];

  const campaigns = [
    {
      brandName: "Nike Running",
      campaignTitle: "Summer Run Challenge",
      brandLogo: "fitness_center",
      tags: ["#FitnessNiche", "#MaleAudience", "#HighEngagement"],
      compensation: "₹1,500 - ₹2,200",
      matchScore: 98,
      isPrimary: true,
    },
    {
      brandName: "Sony Electronics",
      campaignTitle: "XM5 Review Campaign",
      brandLogo: "headphones",
      tags: ["#TechReviewer", "#Unboxing"],
      compensation: "₹800 + Product",
      matchScore: 85,
      isPrimary: false,
    },
  ];

  const applications = [
    {
      title: "Sephora Glow Campaign",
      status: "Reviewing" as const,
      description: "Application submitted 2 days ago.",
      icon: "hourglass_top",
    },
    {
      title: "HelloFresh Q3",
      status: "Approved" as const,
      description: "Contract ready for signature.",
      icon: "check_circle",
      actionLabel: "Sign Contract",
    },
  ];

  return (
    <AppLayout
      variant="influencer"
      activeTab="Work"
      header={
        <div className="bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
          <Header
            userName={userData.name}
            userRole={userData.role}
            avatarUrl={userData.avatarUrl}
            showNotificationDot={true}
            isOnline={userData.isOnline}
          >
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </Header>
        </div>
      }
    >
      <div className="p-4">
        <div className="flex flex-col gap-8 max-w-screen-lg mx-auto">
          {/* AI Recommended Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary-500">auto_awesome</span>
                AI Recommended
              </h2>
              <a href="#" className="text-xs font-bold text-primary-500 hover:text-primary-600">
                View All
              </a>
            </div>

            <div className="flex flex-col gap-4">
              {campaigns.map((campaign, index) => (
                <CampaignCard key={index} {...campaign} />
              ))}
            </div>
          </section>

          {/* Application Pipeline */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Application Status</h2>
            </div>

            <ApplicationTimeline items={applications} />
          </section>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 lg:bottom-12 right-5 z-20">
        <button className="flex items-center justify-center size-14 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/40 hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    </AppLayout>
  );
}
