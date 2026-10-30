import { AppLayout } from "@/components/layout/AppLayout";

export default function ApplicationReviewPage() {
  const applications = [
    {
      name: "Sarah Jenkins",
      handle: "@sarahstyles",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLFjzD6drQRz-E4nM1kAOy001Las6UcdQX5zX39GIM-DeEtymk2LPqEW5q8lchay32hQGra0hD0H9CH4m7LbB8CzhLyoIWQFFKbyT_iHkIzKayfGP-9RHhqKvAMRLLx6klDw8qdEbxZmOwtIjkfCJ6xOWtR_euSdAUsguXVeIRuCaRWdKZOLoxcrTJmEW57o9txq2Skjx02QteOU_wM9sapzwj_EobgwQ6GzZsMQAz2wlMf7xaRpI9clU7XkMI0yxinBNUaOAb8LY",
      verified: true,
      matchScore: 98,
      roi: "5.2x",
      followers: "250k",
      engagement: "4.5%",
      avgLikes: "12.5k",
      platform: "instagram",
      portfolioImages: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCYMckIwkjZ-qArsGEvDgFb0MJJJqUkTfyViMNlHtdx44lqLBsB96LUAJ79E6JQ9Bm08y8yRJIe20yupxgCR7ynOK8XkWPwyxtbkzIxjWbH96mxQeDfbqXkfWwDCRjz9CYJYf_LFhRLMLCuOu2s3bhvZp9Yi6R26Yaa94XSPiZ5Fld4jQlKg_BttZBKHjuWqeXLZTmOebddjQ0l6oMV5yCMjS1qfKKg3W2EMtcBdj_e5XxFzxhOe3szc2CF5eeA9nauTyUEXtKfGK4",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCclUtM11Rzpg6b0F2WUh1qE2BPEJR1yuuQfVoCzcemugcVAMvQrEDDbgjU-hkUe_QhQVkObZG2-OCcPg9nCeD5I5kz9Xr-wPCJ-6jd4kZ8KEZCU1sxY75nn4q61eFEyIoFMKJXUaTw3-yYNhra2nF3cIf52CFW_ZCMOnfl1VXWoEQZuS6v8WjKGt-ybvVR3_RfEGIYsQLnqhXoEl0PTxkbBrDqjoeiOMCktNX3jwpeHun_E0OYya18Y1qaqzKOPdoSBlcZSRCRF9o",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDIBYd9pLlLcc2xR0g8h3ndO1H6rwWnYKW9Ng6so9bsQobot_rvELFlD_GJjii8Vi_SSLlff3PJcsZHVQb0UlW62M-B4Qqm0oVhrXSjzDyZfkggKgf5gJLfERR-22uTBtTiwsuX3ElLTqRuRRDBUh4HOvC86WmFtZ-yVvE77cIBHtXzSmql_uBKNGbETimarcl8-7flKL6zM_OUAb2KTl2iEsaVy-im6IBzf3BN1prmV-GkDpU1FVmyI-egAImmUoRKKDwJzMY9hJ0",
      ],
      isHighMatch: true,
    },
    {
      name: "TechGuru",
      handle: "@tech_guru_daily",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGwHlM5r973YyOKGBWEmcV1XF3Jbfn9-Ibakn1E1ih3bqskbLr9UGPhkkCCd-5yZcs8BjuvJ2HKaHbC0pIi89kO5GaHjjjPRfsthvMLPpMwZVxwk9O8Djzvp6bRRju-1nWTkTHt5MWKxe6vTMxIJ6wXRxgAp0ImIeyBdpLGwqDSTa2jv8LTGzFTuIa-ultzxAvf7kNjMXkGwD9BPVrkZhcxfIyqrS6vGkXrQPb9ofF8NOMjF0Aw3lf3h1WULs9yYODcDNbHIVPXOE",
      verified: false,
      matchScore: 85,
      roi: "3.1x",
      followers: "850k",
      engagement: "1.2%",
      avgLikes: "450k",
      platform: "tiktok",
      isHighMatch: false,
    },
    {
      name: "Monica G.",
      handle: "@monica_fitness",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtWDmg2ZO6ZrBY7dI2SI9RiCtWEMVPNQBynsn6lcp5yzly9UTHxXzrHJOWEat5DQoug6oDoO8ww8tWk-gIu306zsHMWHOViAe6B4J4uMR-7djXeQ3SJsOB43hRSTev-Ky9LEdP2fdIP4Df9gky8Mrc3VRgrzCa7FFOZZFut-yv_bpNr8pofJYgWfpbJpkzBgz_K4DkeoTZcjMUpj-ixTTsW0nwbZlCsDVn8xJqTBvUIlzGgSUreZV7UHWd-ZN60hxuIG5kjJzjwQA",
      verified: false,
      matchScore: 62,
      roi: "1.5x",
      followers: "120k",
      engagement: "3.2%",
      avgLikes: "8k",
      platform: "instagram",
      isHighMatch: false,
    },
  ];

  const filters = [
    { label: "Highest Potential", active: true },
    { label: "Est. ROI", active: false },
    { label: "Engagement Rate", active: false },
    { label: "Followers", active: false },
  ];

  return (
    <AppLayout
      variant="brand"
      activeTab="Campaigns"
      header={
        <div className="flex flex-col bg-surface-dark/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-surface-card transition-colors text-muted-foreground hover:text-foreground">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col items-center">
              <h1 className="text-sm font-medium text-muted-foreground">Campaign Review</h1>
              <h2 className="text-base font-bold leading-tight">Summer Launch 2024</h2>
            </div>
            <button className="flex items-center justify-center p-2 -mr-2 rounded-full hover:bg-surface-card transition-colors text-muted-foreground hover:text-foreground">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-3">
            <div className="relative flex items-center w-full h-10 rounded-lg focus-within:ring-2 focus-within:ring-primary-500/50 bg-surface-card overflow-hidden transition-all">
              <div className="grid place-items-center h-full w-10 text-muted-foreground">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                className="peer h-full w-full outline-none text-sm pr-2 bg-transparent placeholder-muted-foreground"
                placeholder="Search applicants by name or handle..."
                type="text"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto hide-scrollbar snap-x">
            {filters.map((filter, index) => (
              <button
                key={index}
                className={`snap-start shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${filter.active
                    ? "bg-primary-500 text-white shadow-[0_0_10px_rgba(19,164,236,0.3)] border-primary-500"
                    : "bg-surface-card border-border text-muted-foreground hover:bg-surface-card/80 hover:text-foreground transition-colors"
                  }`}
              >
                <span>{filter.label}</span>
                <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
              </button>
            ))}
          </div>
        </div>
      }
    >
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain bg-background p-4 space-y-4">
        {applications.map((app, index) => (
          <article
            key={index}
            className={`relative flex flex-col gap-3 p-4 rounded-xl bg-surface-card border shadow-lg transition-all group ${app.isHighMatch ? "border-primary-500/30 hover:border-primary-500/50" : "border-border hover:border-border/80"
              } ${!app.isHighMatch && "opacity-75 hover:opacity-100"}`}
          >
            {/* Header Row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img alt={app.name} className="w-12 h-12 rounded-full object-cover border-2 border-border" src={app.avatarUrl} />
                  <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-[2px]">
                    {app.platform === "instagram" ? (
                      <img
                        alt="Instagram"
                        className="w-4 h-4"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA47x53IW933LzMWGmNWGfvmza4xLiQ8OU4neqUu5Rza4-3Mp3BJU5MfP0LjqpyeXhxjH9yb4-ixPwHtyrP_o8mOt47s1dfbVjHvRblPguKcc0rjofmypqQriWx5iFUs-a5pk7FdzvBYBGu0lT_8ot4W4-fp7y0ZIs2wZHvNqWQtSBeZ-OcWf35LBoFjNXN3h_TyyLAXtfagqRq4t1GIVww7kvMr4DHz0CYHDqGgWQ5qwiVbuxyvhpeYbZrBYWrpg6FwO_CU4dMnhY"
                      />
                    ) : (
                      <span className="block w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-black fill-current" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-base">{app.name}</h3>
                    {app.verified && <span className="material-symbols-outlined text-primary-500 text-[16px]">verified</span>}
                  </div>
                  <p className="text-muted-foreground text-xs font-medium">{app.handle}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded border mb-1 ${app.isHighMatch
                      ? "bg-primary-500/10 border-primary-500/20 text-primary-500"
                      : "bg-surface-dark/50 border-border text-muted-foreground"
                    }`}
                >
                  {app.isHighMatch && <span className="material-symbols-outlined text-[16px]">auto_awesome</span>}
                  <span className="text-xs font-bold">{app.matchScore}% Match</span>
                </div>
                <p className={`text-xs font-bold ${app.isHighMatch ? "text-emerald-400" : "text-muted-foreground"}`}>Est. {app.roi} ROI</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-border border-dashed">
              <div className="flex flex-col items-center justify-center p-2 rounded bg-surface-dark/50">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Followers</span>
                <span className="text-sm font-bold">{app.followers}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded bg-surface-dark/50">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Engagement</span>
                <span className="text-sm font-bold">{app.engagement}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded bg-surface-dark/50">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
                  {app.platform === "tiktok" ? "Avg. Views" : "Avg. Likes"}
                </span>
                <span className="text-sm font-bold">{app.avgLikes}</span>
              </div>
            </div>

            {/* Portfolio Preview */}
            {app.portfolioImages && (
              <div className="flex gap-2 overflow-hidden h-20 rounded-lg relative">
                {app.portfolioImages.map((img, idx) => (
                  <img key={idx} alt="Portfolio" className="w-1/3 object-cover opacity-80 hover:opacity-100 transition-opacity" src={img} />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                  <span className="text-xs font-medium">Tap to view portfolio</span>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex gap-2 pt-1">
              <button className="flex-1 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-surface-dark hover:text-foreground transition-colors text-sm font-semibold">
                Decline
              </button>
              <button className="flex-1 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-surface-dark hover:text-foreground transition-colors text-sm font-semibold">
                Shortlist
              </button>
              <button
                className={`flex-[1.5] h-9 flex items-center justify-center gap-1.5 rounded-lg transition-all text-sm font-bold ${app.isHighMatch
                    ? "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                    : "bg-surface-dark hover:bg-surface-dark/80 border border-border"
                  }`}
              >
                {app.isHighMatch && <span className="material-symbols-outlined text-[18px]">check</span>}
                Approve
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4 z-20">
        <button className="w-12 h-12 bg-primary-500 text-white rounded-full shadow-lg shadow-primary-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[24px]">sort</span>
        </button>
      </div>
    </AppLayout>
  );
}
