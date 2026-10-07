import React from 'react';
import { BookOpen, ArrowLeft, Video, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';

interface KnowledgeCenterViewProps {
  onBack: () => void;
}

export const KnowledgeCenterView: React.FC<KnowledgeCenterViewProps> = ({ onBack }) => {
  const guides = [
    {
      title: 'How to scale Pakistani COD dropshipping to Rs. 100k daily profit',
      category: 'Scaling Playbook',
      readTime: '6 min read',
      summary: 'Learn how to test winning products on Meta & TikTok Ads, filter out high-risk buyers using Profit Guard, and dispatch through Trax Sonic.',
    },
    {
      title: 'Understanding courier COD remittance cycles and RTO freight deductions',
      category: 'Logistics Guide',
      readTime: '4 min read',
      summary: 'Bi-weekly payout reconciliation schedule, how return fees are calculated by PostEx and TCS, and minimizing doorstep refusals.',
    },
    {
      title: 'Connecting Shopify & WooCommerce to YourMart with 1-click auto-fulfillment',
      category: 'Store Automation',
      readTime: '5 min read',
      summary: 'Full tutorial on configuring webhook API tokens, pushing product descriptions in Urdu, and syncing warehouse inventories.',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 p-6 sm:p-8 border border-emerald-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">YourMart Academy & E-Commerce Knowledge Base</h2>
            <p className="text-xs text-slate-300">
              Master Pakistani wholesale sourcing, viral video creatives, courier negotiations, and risk guard strategies.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((g, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-3xl bg-slate-900 p-6 border border-slate-800 hover:border-slate-700 transition space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="text-emerald-400 font-bold">{g.category}</span>
                <span>{g.readTime}</span>
              </div>
              <h3 className="font-bold text-white text-base leading-snug">{g.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{g.summary}</p>
            </div>

            <button
              onClick={() => alert(`Opening Academy Guide: ${g.title}`)}
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-slate-200 transition cursor-pointer"
            >
              Read Full Academy Guide
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
