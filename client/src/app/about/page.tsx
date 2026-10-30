import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    },
    {
      name: 'David Miller',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    },
    {
      name: 'Marcus Johnson',
      role: 'VP Marketing',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
  ];

  const milestones = [
    {
      year: '2023 - The Beginning',
      title: 'AI Algorithm Launch',
      description:
        'We developed our core matching engine to analyze creator authenticity beyond vanity metrics.',
      isActive: false,
    },
    {
      year: '2024 - Present',
      title: '10k Influencers Onboarded',
      description: 'A thriving ecosystem of creators ready to partner with forward-thinking brands.',
      isActive: true,
    },
    {
      year: 'Future Vision',
      title: 'Global Automated Partnerships',
      description: 'Expanding to 50+ countries with instant, smart-contract powered collaborations.',
      isActive: false,
      isFuture: true,
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-white dark:bg-background-dark shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <Link
          href="/"
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white"
        >
          <Icon name="arrow_back_ios_new" size={20} />
        </Link>
        <h2 className="text-base font-bold leading-tight tracking-tight text-center">About Us</h2>
        <div className="size-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Hero Section */}
        <div className="relative px-6 pt-8 pb-12">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 size-64 rounded-full bg-primary/10 blur-3xl"></div>
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
            Our Story
          </span>
          <h1 className="relative text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-6">
            Democratizing <br />
            <span className="text-primary">Influence.</span>
          </h1>
          <p className="relative text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400">
            We&apos;re on a mission to bring transparency to influencer marketing. Our AI-driven platform connects
            brands with authentic voices, ensuring every partnership is built on trust.
          </p>
        </div>

        {/* Stats / Trust Indicators */}
        <div className="flex items-center justify-between px-6 py-8 border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">10k+</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Creators</div>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">98%</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Accuracy</div>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">50M</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Reach</div>
          </div>
        </div>

        {/* Values Section */}
        <div className="px-6 py-12">
          <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Core Values</h3>
          <div className="grid gap-4">
            {/* Value Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-6 border border-slate-100 dark:border-slate-800 transition-all hover:border-primary/30">
              <div className="mb-4 inline-flex items-center justify-center size-12 rounded-xl bg-white dark:bg-slate-700 text-primary shadow-sm group-hover:scale-110 transition-transform">
                <Icon name="analytics" size={28} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Data-Driven Trust</h4>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                No more guessing games. We use advanced AI to analyze engagement metrics, ensuring you pay for real
                influence, not just followers.
              </p>
            </div>

            {/* Value Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-6 border border-slate-100 dark:border-slate-800 transition-all hover:border-primary/30">
              <div className="mb-4 inline-flex items-center justify-center size-12 rounded-xl bg-white dark:bg-slate-700 text-primary shadow-sm group-hover:scale-110 transition-transform">
                <Icon name="diversity_2" size={28} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Authentic Connections</h4>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                We match brands with creators who actually love their products, fostering genuine storytelling that
                resonates with audiences.
              </p>
            </div>
          </div>
        </div>

        {/* Meet the Team */}
        <div className="py-10 bg-slate-50 dark:bg-slate-900/30">
          <div className="px-6 mb-6 flex justify-between items-end">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Meet the Team</h3>
              <p className="text-sm text-slate-500 mt-1">Built by marketers, for marketers.</p>
            </div>
            <a href="#" className="text-sm font-semibold text-primary">
              View All
            </a>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="flex overflow-x-auto px-6 gap-4 pb-4 hide-scrollbar snap-x snap-mandatory">
            {teamMembers.map((member) => (
              <div key={member.name} className="snap-start flex-none w-36 flex flex-col items-center">
                <div className="size-36 rounded-2xl overflow-hidden bg-slate-200 mb-3 relative group">
                  <img
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    src={member.image}
                  />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</h4>
                <p className="text-xs text-slate-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap / Timeline */}
        <div className="px-6 py-12 relative overflow-hidden">
          <h3 className="text-xl font-bold mb-8 text-slate-900 dark:text-white">Our Journey</h3>
          <div className="relative space-y-8 pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-6">
                <div
                  className={`absolute -left-[9px] top-1 size-4 rounded-full ring-4 ring-white dark:ring-background-dark ${milestone.isActive
                      ? 'bg-primary'
                      : milestone.isFuture
                        ? 'border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                ></div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${milestone.isActive ? 'text-primary' : 'text-slate-400'
                    }`}
                >
                  {milestone.year}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{milestone.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-8"></div>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3 max-w-md mx-auto z-40">
        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          <span>Join the Revolution</span>
          <Icon name="arrow_forward" size={20} />
        </button>
        <div className="flex justify-center gap-6 text-xs text-slate-500 font-medium">
          <a href="#" className="hover:text-primary transition-colors">
            Careers
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Press
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
