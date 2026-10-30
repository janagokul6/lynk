'use client';

import { Icon } from '@/components/ui/Icon';
import { useState } from 'react';

/**
 * Reusable pricing content (hero, tiers, comparison, benefits).
 * Use as-is on the public /pricing page (no sidebar/bottom nav).
 * When used inside brand or influencer dashboard panels, wrap with AppLayout
 * (or dashboard layout) so sidebar and navigation match the panel design.
 */
export function PricingContent() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const features = [
    { name: 'AI ROI Prediction', starter: false, professional: true, enterprise: true },
    { name: 'Smart Matching', starter: 'Basic', professional: 'Advanced', enterprise: 'Custom' },
    { name: 'Fraud Detection', starter: 'Standard', professional: 'Enhanced', enterprise: 'Priority' },
    { name: 'Authenticity Reports', starter: '5/mo', professional: '50/mo', enterprise: 'Unlimited' },
    { name: 'API Access', starter: false, professional: false, enterprise: true },
    { name: 'Dedicated Manager', starter: false, professional: false, enterprise: true },
    { name: 'Whitelabeling', starter: false, professional: false, enterprise: true },
  ];

  return (
    <div className="w-full max-w-md mx-auto md:max-w-4xl lg:max-w-none lg:mx-0 px-0">
      {/* Hero Section */}
      <section className="px-6 pt-8 md:pt-12 pb-6 md:pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
          <Icon name="stars" size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">Rated 4.8/5 on G2</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-text">Unlock AI-Driven Growth</h1>
        <p className="text-text-muted max-w-md mx-auto leading-relaxed text-base md:text-lg">
          Scale your influencer campaigns with precision using our advanced AI-powered ROI tools and authenticity scoring.
        </p>
      </section>

      {/* Billing Toggle */}
      <section className="px-6 mb-8 md:mb-10">
        <div className="flex justify-center">
          <div className="bg-surface-subtle p-1 rounded-xl flex items-center w-full max-w-xs">
            <button
              type="button"
              onClick={() => setBillingPeriod('monthly')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                billingPeriod === 'monthly' ? 'bg-surface shadow-sm text-text' : 'text-text-muted'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('annual')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                billingPeriod === 'annual' ? 'bg-surface shadow-sm text-text' : 'text-text-muted'
              }`}
            >
              Annual
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-bold">-20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards - responsive grid */}
      <section className="px-6 space-y-6 pb-12 md:pb-16 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0 lg:max-w-6xl lg:mx-auto lg:px-8">
        {/* Tier 1: Starter */}
        <div className="rounded-xl p-6 relative overflow-hidden group bg-surface border border-border-subtle">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-text">Starter</h3>
              <p className="text-sm text-text-muted">For individual creators</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-text">₹49</span>
              <span className="text-text-muted text-sm">/mo</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-text">
              <Icon name="check_circle" className="text-primary text-xl" />
              Basic AI Influencer Search
            </li>
            <li className="flex items-center gap-3 text-sm text-text">
              <Icon name="check_circle" className="text-primary text-xl" />
              5 Authenticity Reports /mo
            </li>
            <li className="flex items-center gap-3 text-sm text-text-muted line-through">
              <Icon name="block" className="text-text-muted text-xl" />
              AI ROI Calculator
            </li>
          </ul>
          <button type="button" className="w-full py-3 rounded-lg border border-border-subtle font-bold text-text hover:bg-surface-hover transition-colors">
            Start Free Trial
          </button>
        </div>

        {/* Tier 2: Professional (Highlighted) */}
        <div className="bg-surface-subtle border-2 border-primary rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">
            Recommended
          </div>
          <div className="flex justify-between items-start mb-6 pt-2">
            <div>
              <h3 className="text-xl font-extrabold text-text">Professional</h3>
              <p className="text-sm text-primary font-medium">Powering top brands</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-text">₹149</span>
              <span className="text-text-muted text-sm">/mo</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-text font-medium">
              <Icon name="check_circle" className="text-primary text-xl fill-1" />
              AI ROI Calculator
            </li>
            <li className="flex items-center gap-3 text-sm text-text font-medium">
              <Icon name="check_circle" className="text-primary text-xl fill-1" />
              Priority AI Recommendations
            </li>
            <li className="flex items-center gap-3 text-sm text-text font-medium">
              <Icon name="check_circle" className="text-primary text-xl fill-1" />
              50 Authenticity Reports /mo
            </li>
            <li className="flex items-center gap-3 text-sm text-text font-medium">
              <Icon name="check_circle" className="text-primary text-xl fill-1" />
              Audience Demographics AI
            </li>
          </ul>
          <button type="button" className="w-full py-4 rounded-lg bg-primary text-white font-extrabold shadow-lg shadow-primary/25 hover:brightness-110 transition-all">
            Get Professional Now
          </button>
        </div>

        {/* Tier 3: Enterprise */}
        <div className="bg-surface border border-border-subtle rounded-xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-text">Enterprise</h3>
              <p className="text-sm text-text-muted">Scale without limits</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-text">Custom</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm font-medium text-text">
              <Icon name="check_circle" className="text-primary text-xl" />
              Advanced Authenticity Scoring
            </li>
            <li className="flex items-center gap-3 text-sm text-text">
              <Icon name="check_circle" className="text-primary text-xl" />
              Full API & Webhook Access
            </li>
            <li className="flex items-center gap-3 text-sm text-text">
              <Icon name="check_circle" className="text-primary text-xl" />
              Dedicated Account Manager
            </li>
            <li className="flex items-center gap-3 text-sm text-text">
              <Icon name="check_circle" className="text-primary text-xl" />
              Custom Influencer Whitelabeling
            </li>
          </ul>
          <button type="button" className="w-full py-3 rounded-lg border border-border-subtle font-bold text-text hover:bg-surface-hover transition-colors">
            Contact Sales
          </button>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="px-6 py-10 md:py-12 bg-surface-subtle">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-text">Compare Features</h2>
        <div className="overflow-x-auto max-w-4xl mx-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="py-4 px-2 text-sm font-bold text-text-muted">Feature</th>
                <th className="py-4 px-2 text-sm font-bold text-center text-text">Starter</th>
                <th className="py-4 px-2 text-sm font-bold text-center text-primary">Professional</th>
                <th className="py-4 px-2 text-sm font-bold text-center text-text">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {features.map((feature, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-2 text-sm font-medium text-text">{feature.name}</td>
                  <td className="py-4 px-2 text-center">
                    {typeof feature.starter === 'boolean' ? (
                      feature.starter ? (
                        <Icon name="check" className="text-primary font-bold inline-block" />
                      ) : (
                        <Icon name="close" className="text-text-muted text-sm inline-block" />
                      )
                    ) : (
                      <span className="text-sm text-text">{feature.starter}</span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center">
                    {typeof feature.professional === 'boolean' ? (
                      feature.professional ? (
                        <Icon name="check" className="text-primary font-bold inline-block" />
                      ) : (
                        <Icon name="close" className="text-text-muted text-sm inline-block" />
                      )
                    ) : (
                      <span className="text-sm font-bold text-primary">{feature.professional}</span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center">
                    {typeof feature.enterprise === 'boolean' ? (
                      feature.enterprise ? (
                        <Icon name="check" className="text-primary font-bold inline-block" />
                      ) : (
                        <Icon name="close" className="text-text-muted text-sm inline-block" />
                      )
                    ) : (
                      <span className="text-sm font-bold text-text">{feature.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Benefit Section */}
      <section className="px-6 py-12 md:py-16 bg-surface">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-10 text-center text-text">Why top marketers choose us</h2>
        <div className="grid gap-8 max-w-3xl mx-auto md:grid-cols-3 md:max-w-none">
          {[
            {
              icon: 'calculate',
              title: 'AI ROI Calculator',
              description: 'Predict campaign results with 94% accuracy before spending a single dollar.',
            },
            {
              icon: 'verified_user',
              title: 'Authenticity Scoring',
              description: 'Our deep-learning models detect fake followers and engagement pods instantly.',
            },
            {
              icon: 'auto_awesome',
              title: 'Smart Recommendations',
              description: 'Discover niche creators who actually align with your brand values and goals.',
            },
          ].map((benefit, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon name={benefit.icon} className="text-primary" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold mb-1 text-text">{benefit.title}</h4>
                <p className="text-sm text-text-muted">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Trust */}
      <section className="px-6 py-10 md:py-12 text-center opacity-60">
        <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-6">Trusted by 500+ High-Growth Brands</p>
        <div className="flex flex-wrap justify-center gap-8 items-center grayscale invert dark:invert-0">
          <span className="font-black text-xl italic tracking-tighter text-text">LUXE</span>
          <span className="font-black text-xl italic tracking-tighter text-text">GLO</span>
          <span className="font-black text-xl italic tracking-tighter text-text">VIBE</span>
          <span className="font-black text-xl italic tracking-tighter text-text">PULSE</span>
        </div>
      </section>
    </div>
  );
}
