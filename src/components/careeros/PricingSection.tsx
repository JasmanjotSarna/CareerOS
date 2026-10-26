'use client';

import React from 'react';
import { PRICING_DATA } from '@/data/pricing';
import { OfferPath } from './ContactOverlayPanel';

interface PricingSectionProps {
  onSelectPath: (path: OfferPath) => void;
}

export function PricingSection({ onSelectPath }: PricingSectionProps) {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 space-y-12 select-none">
      <div className="max-w-3xl space-y-3">
        <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
          Transparent Pricing
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          Simple plans. No hidden costs.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#94A3B8] leading-relaxed">
          Predictable pricing designed for university budgets and self-serve students alike. Easily editable and fully transparent.
        </p>
      </div>

      {/* Main Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PRICING_DATA.tiers.map((tier) => (
          <div
            key={tier.id}
            className={`p-7 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 transition-all ${
              tier.popular
                ? 'bg-indigo-50/40 dark:bg-[#131D33] border-2 border-[#4361EE] shadow-xl relative'
                : 'bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10'
            }`}
          >
            {tier.popular && (
              <span className="absolute top-4 right-4 px-2.5 py-1 rounded font-mono text-[10px] uppercase font-bold tracking-wider bg-[#4361EE] text-white">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              <span className="font-mono text-xs text-[#FF6B6B] uppercase font-semibold">
                {tier.badge}
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">{tier.name}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                {tier.description}
              </p>

              <div className="flex items-baseline gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <span className="text-4xl font-bold font-mono text-slate-900 dark:text-white">{tier.price}</span>
                <span className="text-xs text-slate-500 dark:text-[#94A3B8] font-mono">{tier.period}</span>
              </div>

              {/* Core Features */}
              <div className="space-y-2 pt-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-900 dark:text-white font-semibold block">
                  Core Inclusions:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#E2E8F0]">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <span className="text-[#4361EE] font-bold mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPath(tier.ctaAction as OfferPath)}
              className={`w-full py-3 px-5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                tier.popular
                  ? 'bg-[#4361EE] hover:bg-[#3451db] text-white shadow-md'
                  : 'bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white border border-slate-300 dark:border-white/15'
              }`}
            >
              {tier.ctaText} →
            </button>
          </div>
        ))}
      </div>

      {/* Pay Per Use Grid */}
      <div className="p-7 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 space-y-6">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
            Pay As You Go
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
            Pay per use for individual tools.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#94A3B8]">
            Need just one specific check without a monthly commitment? Pick any module on demand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING_DATA.payPerUse.map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-xl bg-white dark:bg-[#1E293B]/40 border border-slate-200 dark:border-white/5 flex flex-col justify-between space-y-3 shadow-sm dark:shadow-none"
            >
              <div className="space-y-1">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white block">
                  {item.price}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{item.name}</h4>
                <p className="text-[11px] text-slate-600 dark:text-[#94A3B8] leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectPath('students')}
                className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-mono text-slate-800 dark:text-white transition-colors"
              >
                Select tool
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
