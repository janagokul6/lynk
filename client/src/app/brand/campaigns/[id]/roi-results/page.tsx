 'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function ROIPredictionResultsPage() {
  const [campaignName, setCampaignName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [primaryPlatform, setPrimaryPlatform] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [revenue, setRevenue] = useState('');
  const [spend, setSpend] = useState('');
  const [impressions, setImpressions] = useState('');
  const [clicks, setClicks] = useState('');
  const [conversions, setConversions] = useState('');
  const [aov, setAov] = useState('');
  const [engagementRate, setEngagementRate] = useState('');

  const [influencerHandle, setInfluencerHandle] = useState('');
  const [creatorCount, setCreatorCount] = useState('');
  const [collaborationType, setCollaborationType] = useState('');

  const [satisfaction, setSatisfaction] = useState('4');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const payload = {
      campaignName,
      brandName,
      primaryPlatform,
      startDate,
      endDate,
      metrics: {
        revenue,
        spend,
        impressions,
        clicks,
        conversions,
        aov,
        engagementRate,
      },
      collaboration: {
        influencerHandle,
        creatorCount,
        collaborationType,
      },
      outcome: {
        satisfaction: Number(satisfaction),
        notes,
      },
    };

    // Stub: replace with real API call (e.g. POST /api/campaign-results)
    // eslint-disable-next-line no-console
    console.log('campaignResultsFeedback', payload);

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-x-hidden antialiased selection:bg-primary/30">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/brand/campaigns"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
        >
          <Icon name="arrow_back" size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Share campaign results</h1>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
          <Icon name="more_horiz" size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 p-4 pb-24">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Intro */}
            <section className="bg-surface border border-border-subtle rounded-2xl p-4 flex flex-col gap-2">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Help us learn from this campaign
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Share how this campaign actually performed. We&apos;ll use this data to improve future ROI
                predictions and make recommendations that better match your brand.
              </p>
            </section>

            {/* Campaign basics */}
            <section className="bg-surface border border-border-subtle rounded-2xl p-4 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Campaign basics</h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Campaign name
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Summer Glow Launch"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Brand / account
                    </label>
                    <input
                      className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="e.g. Nike Running"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Primary platform
                    </label>
                    <select
                      className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                      value={primaryPlatform}
                      onChange={(e) => setPrimaryPlatform(e.target.value)}
                    >
                      <option value="">Select platform</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="ugc">UGC / Paid Social</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Start date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      End date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Performance metrics */}
            <section className="bg-surface border border-border-subtle rounded-2xl p-4 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Performance metrics</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Share ballpark numbers – they don&apos;t need to be perfect. Even rough data helps our models learn.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Total revenue generated
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 12450"
                    inputMode="decimal"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Total campaign spend
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 5000"
                    inputMode="decimal"
                    value={spend}
                    onChange={(e) => setSpend(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Impressions / reach
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 50200"
                    inputMode="decimal"
                    value={impressions}
                    onChange={(e) => setImpressions(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Clicks</label>
                  <input
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 842"
                    inputMode="decimal"
                    value={clicks}
                    onChange={(e) => setClicks(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Conversions / orders
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 128"
                    inputMode="decimal"
                    value={conversions}
                    onChange={(e) => setConversions(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Avg. order value (optional)
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 42"
                    inputMode="decimal"
                    value={aov}
                    onChange={(e) => setAov(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Engagement rate (optional)
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 4.5%"
                    value={engagementRate}
                    onChange={(e) => setEngagementRate(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Collaboration details */}
            <section className="bg-surface border border-border-subtle rounded-2xl p-4 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Influencer & collaboration details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Main influencer handle (optional)
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="@creator_handle"
                    value={influencerHandle}
                    onChange={(e) => setInfluencerHandle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Number of creators (optional)
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 3"
                    inputMode="decimal"
                    value={creatorCount}
                    onChange={(e) => setCreatorCount(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Collaboration type
                  </label>
                  <select
                    className="w-full rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    value={collaborationType}
                    onChange={(e) => setCollaborationType(e.target.value)}
                  >
                    <option value="">Select type</option>
                    <option value="one-off">One-off collaboration</option>
                    <option value="always-on">Always-on / evergreen</option>
                    <option value="whitelisting">Whitelisting / paid social</option>
                    <option value="ugc-only">UGC only</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Outcome & notes */}
            <section className="bg-surface border border-border-subtle rounded-2xl p-4 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Outcome & notes</h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Overall, how satisfied were you with this campaign?
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSatisfaction(String(value))}
                        className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                          satisfaction === String(value)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-background-light dark:bg-background-dark border-border-subtle text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    1 = Very disappointed, 5 = Delighted with the results.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Anything else we should know? (optional)
                  </label>
                  <textarea
                    className="w-full min-h-[96px] rounded-lg border border-border-subtle bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                    placeholder="Share what worked, what didn’t, or the type of creators you want to work with next time."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="sticky bottom-0 left-0 right-0 pt-2 pb-4 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/90 dark:via-background-dark/90 to-transparent">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="hourglass_top" size={18} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Icon name="check_circle" size={18} />
                    Submit results
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <section className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="max-w-md w-full bg-surface border border-border-subtle rounded-3xl p-6 text-center flex flex-col items-center gap-3">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <Icon name="auto_awesome" size={24} className="text-primary" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Thanks for sharing your results
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your campaign data will help us train better models, improve ROI predictions, and recommend creators
                that are more likely to work for your brand.
              </p>
              <Link
                href="/brand/campaigns"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-semibold shadow-md shadow-primary/25 hover:brightness-110 transition-colors"
              >
                <Icon name="arrow_back" size={18} />
                Back to campaigns
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
