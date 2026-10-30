import { Header } from "@/components/layout/Header";
import { AppLayout } from "@/components/layout/AppLayout";
import { ROIChart } from "@/components/sections/ROIChart";
import { MetricsGrid } from "@/components/sections/MetricsGrid";
import { ApplicationCard } from "@/components/cards/ApplicationCard";

export default function BrandDashboardPage() {
  // Hardcoded data matching design reference
  const userData = {
    name: "Nike Running",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOdSPwOMp76e2KLaTkvA9W5T9yM2jeM-ayzywO5pF8yerIH7VGslXSPEmA6HoMOqLq9P5b1eNS6AQ2bjyaZcCi2Fn5n-yYFoOusteXJCSxRF6KsPLF-x5nP8wL2q4m8dJvhHafSSSsEJJ5IhQef_iWPyqCVq8t72TdW_jNJp023BItCphjIaw9mUd9KTvEQfOBuUJGNo1bmSYymq-h5jVRozDKjqpjauC6Mk7d1nB2Xdz40QoNVBto1nnAxANH0jR0yimw2zng-iY",
  };

  const roiData = {
    title: "ROI Trend",
    value: "+320%",
    change: "+12%",
    changeType: "positive" as const,
    dataPoints: [80, 70, 40, 50, 60, 20, 30, 38, 10],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };

  const metrics = [
    { icon: "group", label: "Active", value: "24" },
    { icon: "visibility", label: "Reach", value: "1.2M" },
    { icon: "favorite", label: "Engagement", value: "4.8%" },
    { icon: "currency_rupee", label: "Spend", value: "₹12.5k" },
  ];

  const applications = [
    {
      influencerName: "Sarah Jenkins",
      influencerHandle: "@sarah.runs",
      influencerCategory: "Lifestyle",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8f-X3bzacbKQGsStcfENlZmRDZWB2t4dTJ9cI3t5ADZULkT0mb0EPrHqQJ7zZuihUeF4HXW1SQD3PQXXXdXTH2OeN-AYsRffayw5KeTqGe8-9ug8Qk5eltfDqMs3JqA5-YMSEZEG4plXtN2ExwLDrN7cLroyxkXaGmyCHNnZHqmOtW4sHwLaYbAOlfhGJTO1aTImznt1YdekTrcmaRF9PwlcbmVC94sLTw9imUKU0vkRb_-ahJxjI58tHCQbPVJY-1VO5P_z2INY",
      matchScore: 98,
      followers: "500k",
      avgLikes: "24k",
      engagementRate: "5.2%",
      showFullActions: true,
    },
    {
      influencerName: "Marcus Chen",
      influencerHandle: "@techguy_99",
      influencerCategory: "Tech",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAELaxEO6JeE4qzlpPN7QjcjCeZyaDdN5mP1BcXxxpmVf6chWcpbKBXVnDFhC4OWx3J9qXorPN_H8AWC3p_y3Zn2SuzuhH_8rzI0BHzixtEwNJRwiqdF_ZShkKMnudCotmqkFSV4kY8ZqhkYAvhz81I5kvwVHmt4p0zP58zvnAUyWM4PpqUbx8dy7YUtRmmvmHcGokt9ojIyuUQeGoTBybzdAp5YcuVdGrHToXSWK0lKJMakPH93-0NTl0KCHy--9Z2MXaCfp3u9Hw",
      matchScore: 92,
      followers: "120k",
      avgLikes: "8.5k",
      engagementRate: "7.1%",
      showFullActions: true,
    },
    {
      influencerName: "Jessica Alba",
      influencerHandle: "@jess_yoga",
      influencerCategory: "Fitness",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFua3GeApjlKcjWgmqoYbfoSag0Togun3d8x722QJDPFl2lmr8fli9Ck1SfkGxcWIeDh8LJQWYBdmJoz_iUCqT50wps3vYY2rzAU8afADbgpI5yxHgXz-zJP41iPCbLmNXtG_qEpdMaNan9JTIIXy6T2o-TaIak2wOY-CnU33xX3kSEsa0Fg554aYczW6egmx31ArWPZ8f7H3B1yqfis5YWbhQTwURXtNdzwAB9xmgxxbdisF0Ar7ZhxtPmW8bR2pR8b3QlokoSQc",
      matchScore: 88,
      followers: "85k",
      avgLikes: "5.2k",
      engagementRate: "6.1%",
      showFullActions: false,
    },
  ];

  return (
    <AppLayout
      variant="brand"
      activeTab="Dashboard"
      header={
        <Header
          userName={userData.name}
          userRole="Welcome back"
          avatarUrl={userData.avatarUrl}
          showNotificationDot={true}
          showCreateButton={true}
        />
      }
    >
      <div className="p-4 mx-auto max-w-screen-lg flex flex-col gap-6 w-full">
        {/* Campaign Performance Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Campaign Performance</h2>
            <button className="text-xs text-primary-500 font-semibold flex items-center gap-1 text-slate-700 dark:text-slate-200">
              Last 7 Days
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          </div>

          {/* ROI Chart */}
          <ROIChart {...roiData} />

          {/* Metrics Grid */}
          <MetricsGrid metrics={metrics} scrollable={true} />
        </section>

        {/* New Applications Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">New Applications</h2>
              <span className="bg-primary-500/20 text-primary-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary-500/20">
                AI RANKED
              </span>
            </div>
            <button className="text-xs text-slate-500 dark:text-muted-foreground">View All</button>
          </div>

          <div className="flex flex-col gap-3">
            {applications.map((app, index) => (
              <ApplicationCard key={index} {...app} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
