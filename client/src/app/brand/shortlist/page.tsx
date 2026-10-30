import { AppLayout } from "@/components/layout/AppLayout";

export default function ShortlistComparePage() {
  const candidates = [
    {
      name: "@sarah_creative",
      location: "New York, USA",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyMQASG2B_S6WHq9fEfGMsNJEDNqN6E6zFOI4_dSKT3KU0mMWCxTUHlyywTUJUFmlI1WnyRyhhMjnVVw0jinZS1auPtDbj436naT24OSenKrNXjZNemhp_xKs5GN21XfBXY5qtqVN72fMV33SJ1HlUjOP0YHBm5dnMWp8WpOnhAcnlt06vwGRELEWOZEhqPlq_d4hKsgkE8htdXRq-OUr4tVBxpewNLztlr9ACqpfOR2OJ5Sm8TI5tnel_9hwvBdKBPYKq_KnfjhU",
      platform: "instagram",
      matchScore: 98,
      audience: "1.2M",
      audienceGrowth: "+12%",
      engagement: "4.5%",
      engagementChange: "+2.1%",
      avgLikes: "85K",
      price: "₹2.5k",
      cpm: "₹12",
      overlap: "Unique",
      isRecommended: true,
    },
    {
      name: "@alex_style",
      location: "London, UK",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYPOCS-U4XM0mD3YSE3FP-BgE_zAIrVY1cKyoJXPsC3YUWlhKKy9Qcfi0IrslwMwDY9jzatU37-9j35qy_xZBIwxS9W19HYQ3KSJXsXdAML0DeN417Lnt4pEEWaviFicyyrEJnP96LpYyOI0RVGFvj2r1Apd3f1a9vK3M35N3VfCmTn96oXitRhmTt3FZafIh6hjaNCAlb9W01ZIevc7e26JJlmhjfOyGOvCn4aMADtaBIUYLkfRKmWmzIv-BJ0qNjwR4mg3AUFpE",
      platform: "tiktok",
      matchScore: 84,
      audience: "850K",
      audienceGrowth: "+5%",
      engagement: "3.2%",
      engagementChange: "-0.5%",
      avgLikes: "42K",
      price: "₹1.8k",
      cpm: "₹15",
      overlap: "High",
      isRecommended: false,
    },
    {
      name: "@john_vlogs",
      location: "Los Angeles, USA",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnch0NTEWAlaOlnXitl0e-y12WD77DSLNJr2DJ8wNkqkAKtUmp0vEAPB5gou82zoRkPW3RIN6RWWeNbdc0yPHRSOvWNJ2ZKJvmLcA-0lMi3LjsChaxoqLSoPLUW6htAJ4TBNg5BspAZUBg_-9XJSYkCacHkk-4ExzsUNEN9tp2R3l-WhqnfPM5nOgxSjN21P9HzQf-tdUH7qPMLzQwasGevR8nmOoFNLNEK5_FviAhTkNyOiB4Nhy1DwKF_jS7aFhENgf0bwoSTeo",
      platform: "youtube",
      matchScore: 76,
      audience: "2.1M",
      audienceGrowth: "+8%",
      engagement: "1.8%",
      engagementChange: "0%",
      avgLikes: "35K",
      price: "₹5.0k",
      cpm: "₹22",
      overlap: "Low",
      isRecommended: false,
    },
  ];

  return (
    <AppLayout
      variant="brand"
      activeTab="Campaigns"
      header={
        <div className="flex items-center justify-between p-4 bg-surface-card border-b border-border shadow-sm">
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-dark text-muted-foreground">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight">Compare Shortlist</h1>
          </div>
          <button className="flex items-center gap-1 text-primary-500 font-bold text-sm bg-primary-500/10 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-lg">tune</span>
            Filter
          </button>
        </div>
      }
    >
      {/* Main Comparison Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Sticky Labels Column */}
          <div className="w-[120px] shrink-0 bg-surface-card border-r border-border z-10 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
            <div className="h-[260px] flex flex-col justify-end p-4 border-b border-border bg-surface-card">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Metrics</span>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="flex flex-col">
                <div className="h-16 flex items-center px-4 border-b border-border text-sm font-semibold text-muted-foreground">Match Score</div>
                <div className="h-24 flex items-center px-4 border-b border-border text-sm font-semibold text-muted-foreground">Audience</div>
                <div className="h-24 flex items-center px-4 border-b border-border text-sm font-semibold text-muted-foreground">Engagement</div>
                <div className="h-24 flex items-center px-4 border-b border-border text-sm font-semibold text-muted-foreground">Avg. Likes</div>
                <div className="h-24 flex items-center px-4 border-b border-border text-sm font-semibold text-muted-foreground">Price/Post</div>
                <div className="h-32 flex items-center px-4 text-sm font-semibold text-muted-foreground">Overlap</div>
              </div>
            </div>
          </div>

          {/* Horizontal Scrollable Data Area */}
          <div className="flex-1 overflow-auto no-scrollbar relative">
            <div className="flex w-max">
              {candidates.map((candidate, index) => (
                <div key={index} className="w-[220px] flex flex-col border-r border-border relative group">
                  {/* Header Profile */}
                  <div className="h-[260px] p-4 flex flex-col items-center justify-between border-b border-border bg-surface-card/50 backdrop-blur-sm sticky top-0 z-10">
                    {candidate.isRecommended && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">RECOMMENDED</span>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-3 mt-4">
                      <div className="relative">
                        <div
                          className={`w-20 h-20 rounded-full bg-cover bg-center border-2 shadow-lg ${candidate.isRecommended ? "border-primary-500 shadow-primary-500/20" : "border-border grayscale hover:grayscale-0 transition-all"
                            }`}
                          style={{ backgroundImage: `url('${candidate.avatarUrl}')` }}
                        ></div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center border border-border">
                          {candidate.platform === "instagram" && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                            </svg>
                          )}
                          {candidate.platform === "tiktok" && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"></path>
                            </svg>
                          )}
                          {candidate.platform === "youtube" && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-lg leading-tight">{candidate.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{candidate.location}</p>
                      </div>
                    </div>

                    <button
                      className={`w-full h-9 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${candidate.isRecommended
                        ? "bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/20"
                        : "bg-surface-dark hover:bg-surface-dark/80"
                        }`}
                    >
                      {candidate.isRecommended && <span className="material-symbols-outlined text-sm">check</span>}
                      Select
                    </button>
                  </div>

                  {/* Data Rows */}
                  <div className="flex flex-col bg-background">
                    {/* Match Score */}
                    <div className="h-16 px-4 flex items-center border-b border-border">
                      <div className={`flex items-center gap-2 ${!candidate.isRecommended && "opacity-60"}`}>
                        <div className={`text-3xl font-black ${candidate.isRecommended ? "text-primary-500" : ""}`}>{candidate.matchScore}</div>
                        <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${candidate.isRecommended ? "text-primary-500 bg-primary-500/10" : "text-muted-foreground bg-surface-dark"}`}>
                          AI
                        </div>
                      </div>
                    </div>

                    {/* Audience */}
                    <div className={`h-24 px-4 flex flex-col justify-center gap-2 border-b border-border ${candidate.isRecommended && "bg-primary-500/5"}`}>
                      <div className="flex items-end gap-1.5">
                        <span className={`text-2xl font-bold ${!candidate.isRecommended && "text-muted-foreground"}`}>{candidate.audience}</span>
                        <span className="text-xs font-medium text-emerald-500 mb-1 flex items-center">
                          <span className="material-symbols-outlined text-[14px]">arrow_upward</span> {candidate.audienceGrowth}
                        </span>
                      </div>
                      <div className="w-full bg-surface-dark h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${candidate.isRecommended ? "bg-primary-500 w-[98%]" : "bg-primary-500/40 w-[65%]"}`}></div>
                      </div>
                    </div>

                    {/* Engagement */}
                    <div className="h-24 px-4 flex flex-col justify-center gap-2 border-b border-border">
                      <div className="flex items-end gap-1.5">
                        <span className={`text-2xl font-bold ${!candidate.isRecommended && "text-muted-foreground"}`}>{candidate.engagement}</span>
                        <span
                          className={`text-xs font-medium mb-1 flex items-center ${candidate.engagementChange.startsWith("+") ? "text-emerald-500" : candidate.engagementChange === "0%" ? "text-muted-foreground" : "text-red-400"
                            }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {candidate.engagementChange.startsWith("+") ? "arrow_upward" : candidate.engagementChange === "0%" ? "remove" : "arrow_downward"}
                          </span>{" "}
                          {candidate.engagementChange}
                        </span>
                      </div>
                      <div className="w-full bg-surface-dark h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${candidate.isRecommended ? "bg-primary-500 w-[85%]" : "bg-primary-500/40 w-[60%]"}`}></div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {candidate.isRecommended ? "Very high for this category" : candidate.matchScore > 80 ? "Average for this category" : "Below average for this category"}
                      </p>
                    </div>

                    {/* Avg Likes */}
                    <div className="h-24 px-4 flex flex-col justify-center gap-2 border-b border-border">
                      <div className="flex items-end gap-1.5">
                        <span className={`text-2xl font-bold ${!candidate.isRecommended && "text-muted-foreground"}`}>{candidate.avgLikes}</span>
                      </div>
                      <div className="w-full bg-surface-dark h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${candidate.isRecommended ? "bg-primary-500/60 w-[92%]" : "bg-primary-500/40 w-[50%]"}`}></div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="h-24 px-4 flex flex-col justify-center gap-2 border-b border-border">
                      <div className="flex items-end gap-1.5">
                        <span className={`text-2xl font-bold ${!candidate.isRecommended && "text-muted-foreground"}`}>{candidate.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${candidate.isRecommended ? "text-primary-500 bg-primary-500/10" : "text-muted-foreground bg-surface-dark"}`}>
                          CPM {candidate.cpm}
                        </span>
                      </div>
                    </div>

                    {/* Overlap */}
                    <div className="h-32 px-4 flex items-center justify-center relative">
                      <div className={`relative w-20 h-20 ${!candidate.isRecommended && "opacity-60"}`}>
                        <div className={`absolute inset-0 rounded-full border-2 ${candidate.isRecommended ? "border-primary-500/30 bg-primary-500/10" : "border-muted-foreground/30 bg-muted-foreground/10"}`}></div>
                        <div className="absolute top-0 -right-4 w-16 h-16 rounded-full border-2 border-border/10 bg-border/5 mix-blend-overlay"></div>
                        <div className={`absolute inset-0 flex items-center justify-center font-bold text-xs ${candidate.isRecommended ? "" : "text-muted-foreground"}`}>
                          {candidate.overlap}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New */}
              <div className="w-[100px] flex flex-col items-center justify-start p-4 bg-background/50">
                <button className="mt-20 w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Fade effect on right */}
          <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-20"></div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4 z-40">
        <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-4 rounded-full shadow-[0_8px_30px_rgba(19,164,236,0.4)] transition-transform active:scale-95 font-bold">
          <span className="material-symbols-outlined">send</span>
          <span>Contact Top Pick</span>
        </button>
      </div>
    </AppLayout>
  );
}
