'use client';

import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';
import { useState } from 'react';

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(0);

  const topics = [
    { icon: 'rocket_launch', title: 'Getting Started', subtitle: 'Setup & Basics', color: 'primary' },
    { icon: 'payments', title: 'Payments', subtitle: 'Billing & Payouts', color: 'secondary' },
    { icon: 'account_circle', title: 'Account', subtitle: 'Security & Profile', color: 'accent' },
  ];

  const faqs = [
    {
      question: 'How does the AI matching work?',
      answer:
        'Our AI analyzes thousands of data points including audience demographics, engagement rates, and content style to pair brands with the perfect influencers. This ensures higher campaign ROI and authentic partnerships.',
    },
    {
      question: 'When do influencers get paid?',
      answer: 'Influencers typically receive payment within 2-5 business days after campaign completion and approval.',
    },
    {
      question: 'Can I cancel my brand subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings. No questions asked.',
    },
    {
      question: 'How do I verify my influencer account?',
      answer:
        'Connect your social media accounts and complete the verification process in your profile settings. Our team will review within 24-48 hours.',
    },
  ];

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text min-h-screen flex flex-col antialiased">
      {/* Top nav bar – same as home page */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-b-slate-200/80 dark:border-b-border/50">
        <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex size-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-hover transition-colors shrink-0"
              aria-label="Back to home"
            >
              <Icon name="arrow_back" size={20} />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white shrink-0">
                <Icon name="auto_awesome" size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-text hidden sm:inline">Influence.AI</span>
            </Link>
          </div>
          <button className="text-text-muted hover:text-text text-sm font-semibold transition-colors">Login</button>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16 shrink-0" aria-hidden />
      {/* Page header: title, search, tabs */}
      <header className="sticky top-16 z-40 bg-background-light dark:bg-background-dark border-b border-border-subtle shrink-0">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-lg font-bold text-text mb-4">Help Center</h1>
          <div className="group relative flex w-full items-center rounded-xl bg-surface-subtle transition-all focus-within:ring-2 focus-within:ring-primary/50">
            <div className="flex h-12 w-12 items-center justify-center text-text-muted group-focus-within:text-primary">
              <Icon name="search" size={20} />
            </div>
            <input
              className="h-12 w-full border-none bg-transparent pr-4 text-base text-text placeholder:text-text-muted focus:ring-0 focus:outline-none"
              placeholder="How can we help?"
              type="text"
            />
          </div>
        </div>
        <div className="hide-scrollbar overflow-x-auto px-4 pb-0">
          <div className="flex min-w-full border-b border-border-subtle">
            {['All', 'For Brands', 'For Influencers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                className={`flex flex-1 flex-col items-center justify-center pb-3 pt-2 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase().replace(' ', '-')
                    ? 'text-primary border-primary'
                    : 'text-text-muted border-transparent hover:text-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Popular Topics Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-text">Browse by Topic</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {topics.map((topic, index) => (
              <button
                key={index}
                className="flex flex-col items-start gap-3 rounded-xl border border-border-subtle bg-surface p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md text-left"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    topic.color === 'primary'
                      ? 'bg-primary/10 text-primary'
                      : topic.color === 'secondary'
                      ? 'bg-secondary-500/10 text-secondary-500'
                      : 'bg-accent-500/10 text-accent-500'
                  }`}
                >
                  <Icon name={topic.icon} size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-text text-sm">{topic.title}</h3>
                  <p className="text-xs text-text-muted mt-1">{topic.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-text">Top Questions</h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`group rounded-xl overflow-hidden transition-all ${
                  expandedFAQ === index
                    ? 'border border-primary/20 bg-surface shadow-sm ring-1 ring-primary/10'
                    : 'border border-border-subtle bg-surface hover:border-primary/30'
                }`}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? -1 : index)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="text-base font-semibold text-text">{faq.question}</span>
                  <Icon
                    name="expand_more"
                    size={24}
                    className={`text-text-muted transition-transform group-hover:text-primary ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm leading-relaxed text-text-muted">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-auto mb-6">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center border border-primary/10">
            <div className="mb-3 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
              <Icon name="support_agent" size={24} />
            </div>
            <h3 className="text-lg font-bold text-text">Still need help?</h3>
            <p className="mb-4 text-sm text-text-muted">
              Our support team is available 24/7 to assist you with any questions.
            </p>
            <button className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Contact Support
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
