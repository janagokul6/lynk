export default function PublicHomePage() {
  const features = [
    {
      icon: "link",
      title: "Connect",
      description: "Link your brand account securely. Our system instantly maps your current audience demographics.",
    },
    {
      icon: "donut_large",
      title: "Analyze",
      description: "Our AI scans audience authenticity, engagement rates, and overlap to filter out bots.",
    },
    {
      icon: "person_search",
      title: "Match",
      description: "Get instant influencer matches with predicted ROI scores before you send a single DM.",
    },
  ];

  const benefits = [
    { icon: "check_circle", text: "Audience Quality Score" },
    { icon: "check_circle", text: "Cost-Per-Engagement Prediction" },
    { icon: "check_circle", text: "Brand Safety Analysis" },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-b-slate-200/80 dark:border-b-border/50">
        <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Lynk</span>
          </div>
          <a href="/login" className="text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground text-sm font-semibold transition-colors">Login</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex flex-col items-center justify-center p-4 overflow-hidden">
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 hero-glow pointer-events-none z-0"></div>

          {/* Abstract Background */}
          <div
            className="absolute inset-0 z-0 opacity-40 mix-blend-screen"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-LL2qvzXoW8UxzY84Pe7cIZStVuPKTdtQ6tlT-FNrWID771cdr_XYJwHcJLLeHjUjQsqyqcEGmxMf2h17v21du-6BTulNTIyOf4TI45G-THU5KAUP90MQQSsZslJRjW3prUVRGZMfrfKdxXy2OwNx5BEDUxw3WRlHobCupzyN2mryeIjp4ni-c5kiTmymHPmwi_KcNg4l6r_ubB7AQqQlsc70Vf1MzIUkIs4j24fysYLqf9xp7sZNb4Gd_slUeCqDE5osmz7NmRY')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-lg flex flex-col gap-6 text-center mt-8">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mx-auto backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              <span className="text-primary-500 text-xs font-bold uppercase tracking-wider">AI v2.0 Live</span>
            </div>

            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white text-glow">
              Predict Your ROI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-blue-200 to-primary-500">Before You Post.</span>
            </h1>

            <p className="text-slate-600 dark:text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto font-medium opacity-90">
              The world's first AI-driven marketplace that matches brands with influencers based on data, not just followers.
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto pt-4">
              <a
                href="/agent"
                className="w-full h-12 rounded-xl bg-primary-500 hover:bg-blue-500 text-white font-bold text-base shadow-[0_0_20px_rgba(19,164,236,0.3)] transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Try the brand agent</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
              <p className="text-slate-500 dark:text-muted-foreground text-xs">Single search bar — match creators conversationally.</p>
            </div>
          </div>

          {/* ROI Widget */}
          <div className="relative z-10 mt-12 w-full max-w-md">
            <div className="glass-panel rounded-2xl p-4 border border-slate-200/80 dark:border-border/50 shadow-2xl transform translate-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-slate-500 dark:text-muted-foreground text-xs font-semibold uppercase">Predicted Reach</span>
                  <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                    2.4M <span className="text-primary-500 text-sm font-normal">+124%</span>
                  </span>
                </div>
                <div className="bg-primary-500/20 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary-500">trending_up</span>
                </div>
              </div>

              {/* Graph */}
              <div className="h-24 w-full flex items-end justify-between gap-1">
                {[30, 45, 40, 60, 55, 75, 90].map((height, index) => (
                  <div
                    key={index}
                    className={`w-full rounded-t-sm relative group ${
                      index === 6
                        ? "bg-primary-500 shadow-[0_0_15px_rgba(19,164,236,0.5)]"
                        : index === 5
                        ? "bg-primary-500/40 animate-pulse"
                        : "bg-slate-300/80 dark:bg-surface-dark/30"
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    {index === 6 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-100 dark:bg-surface-dark text-primary-500 text-[10px] font-bold px-2 py-1 rounded border border-primary-500/20 whitespace-nowrap">
                        AI Pick
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <div className="w-full overflow-hidden bg-slate-100/80 dark:bg-surface-dark/50 border-y border-slate-200 dark:border-border py-6">
          <p className="text-center text-slate-500 dark:text-muted-foreground text-xs font-semibold tracking-widest uppercase mb-4">Trusted by modern brands</p>
          <div className="flex justify-center gap-8 opacity-40 grayscale mix-blend-screen">
            <span className="material-symbols-outlined text-3xl">token</span>
            <span className="material-symbols-outlined text-3xl">verified_user</span>
            <span className="material-symbols-outlined text-3xl">rocket_launch</span>
            <span className="material-symbols-outlined text-3xl">diamond</span>
            <span className="material-symbols-outlined text-3xl">hub</span>
          </div>
        </div>

        {/* Features Section */}
        <section className="px-4 py-16 bg-gradient-to-b from-slate-50 to-white dark:from-background-dark dark:to-surface-dark relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="text-primary-500 text-sm font-bold uppercase tracking-wider mb-2">How Our AI Works</h2>
              <h3 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white">Smart Matching Technology</h3>
              <p className="text-slate-600 dark:text-muted-foreground mt-2 max-w-lg">We analyze millions of data points to find the perfect creator for your brand.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl bg-white/80 dark:bg-surface-card/40 p-6 border border-slate-200 dark:border-border hover:border-primary-500/50 transition-colors duration-300 shadow-sm dark:shadow-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-surface-dark/50 flex items-center justify-center mb-4 text-primary-500 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-[28px]">{feature.icon}</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{feature.title}</h4>
                  <p className="text-slate-600 dark:text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Predictive Performance */}
        <section className="px-4 py-16 bg-slate-100 dark:bg-surface-dark border-t border-slate-200 dark:border-border">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <span className="text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">Predictive Engine</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Data-Driven Certainty.</h3>
              <p className="text-slate-600 dark:text-muted-foreground mb-6">
                Stop guessing. Visualize campaign performance outcomes based on historical data and real-time trend analysis.
              </p>
              <div className="flex flex-col gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-500">{benefit.icon}</span>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-border shadow-2xl bg-white dark:bg-surface-card">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCI0wpFOIAb_FJqZUJRcWAGWCTuMc6v11CPC-62LhiIlBB_9LhlXwOjRvlWeXZKYGD3GfTsTHIcrMKnYkpRtA3P9fyz-Gv0KQaJVnOrD_mcX5TSgTgCZNuE7UmOt2LxuLdj3el3mcfaRMl7Q7hVzLz46drsimkvc_l2b6K4gM4_RTMahPV_mOJu9V1QtVoA-CUavAdNwrbl0pYg28p70kHCPKsKllJ7aXE0xuibEZfkWH-SHcAuXKY-zbB2L_1PSzR2YsIzvfE48YE')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-surface-dark via-transparent to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-xl border border-slate-200/80 dark:border-border/50">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-slate-500 dark:text-muted-foreground text-xs mb-1">Estimated ROI</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">4.8x</p>
                    </div>
                    <button className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-500 text-xs font-bold py-2 px-3 rounded-lg transition-colors">
                      View Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 text-center bg-gradient-to-b from-slate-100 to-slate-50 dark:from-surface-dark dark:to-background-dark relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">Ready to Optimize Your Spend?</h2>
            <p className="text-slate-600 dark:text-muted-foreground mb-8">Join 5,000+ brands using Lynk to maximize their influencer marketing ROI.</p>
            <button className="w-full sm:w-auto h-14 px-8 rounded-xl bg-primary-500 hover:bg-blue-500 text-white font-bold text-lg shadow-[0_0_25px_rgba(19,164,236,0.4)] transition-all transform hover:-translate-y-1">
              Start Your Free Trial
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-border bg-slate-100 dark:bg-background-dark py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <span className="material-symbols-outlined text-[20px] text-slate-700 dark:text-slate-300">auto_awesome</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">Lynk</span>
        </div>
        <p className="text-slate-500 dark:text-muted-foreground text-xs">© 2026 Lynk. All rights reserved.</p>
      </footer>
    </div>
  );
}
