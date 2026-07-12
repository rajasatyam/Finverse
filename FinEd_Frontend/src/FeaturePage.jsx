import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot,
  TrendingDown,
  Newspaper,
  Users,
  ArrowRight,
  CheckCircle2,
  Wallet,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { auth } from './firebase.js';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Beams from './components/Beams';

const features = [
  {
    id: 'ai-mentor',
    icon: Bot,
    title: 'AI Money Mentor',
    subtitle: 'Your Personal Finance Guide',
    description: 'Chat with an AI assistant that explains financial concepts in plain language and answers questions as they come up.',
    benefits: [
      'Plain-language explanations for any financial topic',
      'Answers tailored to what you ask',
      'Available whenever you need it',
    ],
    cta: 'Chat with AI Mentor',
    activeClass: 'bg-violet-500/10 border-violet-500/40 shadow-[0_4px_25px_rgba(139,92,246,0.12)]',
    iconActive: 'bg-violet-500 text-black border-violet-500',
    numColor: 'text-violet-400',
    iconInactive: 'text-violet-400',
    accentColor: '#a78bfa',
    consoleBorder: 'border-violet-500/20',
    btnGradient: 'from-violet-500 to-purple-600 hover:shadow-[0_8px_30px_rgba(139,92,246,0.35)]',
    previewBg: 'bg-violet-500/5 border-violet-500/15',
    pillBg: 'bg-violet-500/10 border-violet-500/20 text-violet-400'
  },
  {
    id: 'credit-simulator',
    icon: TrendingDown,
    title: 'Credit & Debt Simulator',
    subtitle: 'Learn Without Real Consequences',
    description: 'Experiment with borrowing, repayments, and interest in a safe sandbox to understand the long-term impact of debt.',
    benefits: [
      'Visualize how debt compounds over time',
      'Compare different repayment strategies',
      'Understand what drives a credit score',
      'Practice without any real financial risk',
    ],
    cta: 'Launch Credit Simulator',
    activeClass: 'bg-rose-500/10 border-rose-500/40 shadow-[0_4px_25px_rgba(244,63,94,0.12)]',
    iconActive: 'bg-rose-500 text-black border-rose-500',
    numColor: 'text-rose-400',
    iconInactive: 'text-rose-400',
    accentColor: '#f43f5e',
    consoleBorder: 'border-rose-500/20',
    btnGradient: 'from-rose-500 to-red-600 hover:shadow-[0_8px_30px_rgba(244,63,94,0.35)]',
    previewBg: 'bg-rose-500/5 border-rose-500/15',
    pillBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
  },
  {
    id: 'stock',
    icon: BarChart3,
    title: 'Investment Simulator',
    subtitle: 'Learn Investing Risk-Free',
    description: 'Practice investing with a simulated portfolio and market data, without using real money.',
    benefits: [
      'Trade with a virtual portfolio',
      'Practice with simulated market data',
      'Learn the basics of diversification',
      'Review your simulated performance over time',
    ],
    cta: 'Open Investment Simulator',
    activeClass: 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_4px_25px_rgba(16,185,129,0.12)]',
    iconActive: 'bg-emerald-500 text-black border-emerald-500',
    numColor: 'text-emerald-400',
    iconInactive: 'text-emerald-400',
    accentColor: '#10b981',
    consoleBorder: 'border-emerald-500/20',
    btnGradient: 'from-emerald-500 to-green-600 hover:shadow-[0_8px_30px_rgba(16,185,129,0.35)]',
    previewBg: 'bg-emerald-500/5 border-emerald-500/15',
    pillBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
  },
  {
    id: 'expense-tracker',
    icon: Wallet,
    title: 'Expense & Savings Tracker',
    subtitle: 'Track Spending, Set Goals',
    description: 'Log your day-to-day expenses and set savings goals in one dashboard.',
    benefits: [
      'Categorize and track your expenses',
      'Set and monitor savings goals',
      'See spending broken down by category',
    ],
    cta: 'Open Expense Tracker',
    activeClass: 'bg-sky-500/10 border-sky-500/40 shadow-[0_4px_25px_rgba(56,189,248,0.12)]',
    iconActive: 'bg-sky-500 text-black border-sky-500',
    numColor: 'text-sky-400',
    iconInactive: 'text-sky-400',
    accentColor: '#38bdf8',
    consoleBorder: 'border-sky-500/20',
    btnGradient: 'from-sky-500 to-blue-600 hover:shadow-[0_8px_30px_rgba(56,189,248,0.35)]',
    previewBg: 'bg-sky-500/5 border-sky-500/15',
    pillBg: 'bg-sky-500/10 border-sky-500/20 text-sky-400'
  },
  {
    id: 'finance-news',
    icon: Newspaper,
    title: 'Finance News',
    subtitle: 'Stay Informed',
    description: 'Browse curated financial news to build awareness of market trends that affect everyday decisions.',
    benefits: [
      'Curated financial news feed',
      'Coverage of topics relevant to personal finance',
    ],
    cta: 'Browse Finance News',
    activeClass: 'bg-amber-500/10 border-amber-500/40 shadow-[0_4px_25px_rgba(251,191,36,0.12)]',
    iconActive: 'bg-amber-500 text-black border-amber-500',
    numColor: 'text-amber-400',
    iconInactive: 'text-amber-400',
    accentColor: '#fbbf24',
    consoleBorder: 'border-amber-500/20',
    btnGradient: 'from-amber-500 to-orange-600 hover:shadow-[0_8px_30px_rgba(251,191,36,0.35)]',
    previewBg: 'bg-amber-500/5 border-amber-500/15',
    pillBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
  },
  {
    id: 'community',
    icon: Users,
    title: 'Community Forum',
    subtitle: 'Learn Together',
    description: 'Connect with other learners to share experiences, ask questions, and swap financial tips.',
    benefits: [
      'Share progress and learn from others',
      'Ask questions in a supportive space',
      'Discuss real scenarios with peers',
    ],
    cta: 'Join the Discussion',
    activeClass: 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_4px_25px_rgba(99,102,241,0.12)]',
    iconActive: 'bg-indigo-500 text-black border-indigo-500',
    numColor: 'text-indigo-400',
    iconInactive: 'text-indigo-400',
    accentColor: '#6366f1',
    consoleBorder: 'border-indigo-500/20',
    btnGradient: 'from-indigo-500 to-blue-600 hover:shadow-[0_8px_30px_rgba(99,102,241,0.35)]',
    previewBg: 'bg-indigo-500/5 border-indigo-500/15',
    pillBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
  },
];

const FeaturesPage = () => {
  const navigate = useNavigate();
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const activeFeature = features[activeFeatureIndex];

  const handleDemoClick = (featureId) => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
    switch (featureId) {
      case 'ai-mentor': navigate('/chatbot'); break;
      case 'credit-simulator': navigate('/creditOrLoan'); break;
      case 'finance-news': navigate('/news'); break;
      case 'community': navigate('/community'); break;
      case 'stock': navigate('/stock'); break;
      case 'expense-tracker': navigate('/tracker'); break;
      default: break;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden flex flex-col justify-between">
      <SiteHeader />

      {/* Subtle fixed beams background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <Beams
          beamWidth={3.2}
          beamHeight={30}
          beamNumber={20}
          lightColor="#FFD700"
          speed={2.4}
          noiseIntensity={2.6}
          scale={0.18}
          rotation={16}
        />
      </div>

      {/* Main Feature Explorer */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-8 pt-16 pb-20 flex-grow">
        
        {/* Eyebrow & Title */}
        <div className="mb-12 text-left">
          <h1 className="font-sans text-3xl md:text-5xl font-extrabold text-white mt-1 leading-tight">
            Learn Finance by <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">Doing</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
            Click through our specialized modules to inspect and interact with simulated preview versions of our capabilities.
          </p>
        </div>

        {/* Feature Explorer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Feature Selection Timeline */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {features.map((feature, index) => {
              const isActive = activeFeatureIndex === index;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeatureIndex(index)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 items-start ${
                    isActive
                      ? feature.activeClass
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                    isActive
                      ? feature.iconActive
                      : `bg-white/[0.04] border-white/10 ${feature.iconInactive}`
                  }`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold transition-colors duration-300 ${isActive ? feature.numColor : 'text-gray-500'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className={`font-sans text-base font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                      {feature.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Simulated Preview Console */}
          <div className="lg:col-span-7">
            <div className={`bg-black/60 border rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-md relative overflow-hidden min-h-[460px] flex flex-col justify-between transition-all duration-300 ${activeFeature.consoleBorder}`}>
              {/* Grid Background overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,215,0,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.3) 1px,transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              <div>
                {/* Console Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <span className="text-[10px] text-gray-500 font-mono tracking-widest ml-2 uppercase">
                      PREVIEW_MODE // {activeFeature.id}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors duration-300 ${activeFeature.pillBg}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest font-mono">Live Demo</span>
                  </div>
                </div>

                {/* Simulated Feature Display */}
                <div className="relative z-10 min-h-[220px] mb-6 flex flex-col justify-center">
                  <RenderPreview featureId={activeFeature.id} />
                </div>
              </div>

              {/* Bottom Details and Navigation trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/10 pt-6 mt-auto relative z-10">
                <div className="max-w-md text-left">
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {activeFeature.description}
                  </p>
                  <ul className="hidden sm:flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                    {activeFeature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-1.5 text-gray-300 text-[11px] leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" style={{ color: activeFeature.accentColor }} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleDemoClick(activeFeature.id)}
                  className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-sans font-bold text-xs sm:text-sm uppercase tracking-wider text-black bg-gradient-to-br transition-all duration-500 cursor-pointer flex-shrink-0 ${activeFeature.btnGradient}`}
                >
                  {activeFeature.cta}
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

function RenderPreview({ featureId }) {
  switch (featureId) {
    case 'ai-mentor':
      return (
        <div className="flex flex-col gap-4 font-sans text-sm text-left">
          {/* User message */}
          <div className="self-end max-w-[85%] bg-white/5 border border-white/10 rounded-2xl rounded-tr-sm px-4 py-3 text-gray-200">
            <p className="text-[10px] text-gray-500 font-mono mb-1">User Question</p>
            <p className="font-medium text-xs sm:text-sm">What is APR and how does it affect my credit card bill?</p>
          </div>
          {/* AI Response */}
          <div className="self-start max-w-[85%] bg-violet-500/5 border border-violet-500/15 rounded-2xl rounded-tl-sm px-4 py-3 text-violet-400">
            <p className="text-[10px] text-violet-400/60 font-mono mb-1">AI Money Mentor</p>
            <p className="text-xs sm:text-sm leading-relaxed">
              APR stands for **Annual Percentage Rate**. It represents the yearly interest rate charged if you carry a balance. If you don't pay your full balance by the due date, interest is calculated daily based on this rate.
            </p>
          </div>
          {/* typing cursor */}
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono self-start ml-2">
            <span className="w-1.5 h-2 bg-violet-500 animate-pulse" />
            <span>AI is ready for your questions...</span>
          </div>
        </div>
      );

    case 'credit-simulator':
      return (
        <div className="flex flex-col gap-4 font-sans text-sm text-left">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Statement Balance</p>
                <p className="text-xl font-bold text-white mt-0.5">₹15,000.00</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold tracking-wider text-rose-400">Interest Charged</p>
                <p className="text-lg font-bold text-rose-400 mt-0.5">+₹250.00 / mo</p>
              </div>
            </div>
            
            {/* Pay Sliders simulation preview */}
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Payment Amount</span>
                  <span className="text-rose-400 font-bold">₹500.00 (Minimum)</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[5%] rounded-full" />
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-3 text-xs leading-relaxed mt-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Paying only the minimum will take **120 months** to pay off this balance and cost you **₹12,400 in interest**!</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'stock':
      return (
        <div className="flex flex-col gap-3 font-sans text-sm text-left">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Simulated Portfolio</p>
                <p className="text-2xl font-black text-white tracking-tight mt-0.5">₹78,430.50</p>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-1 rounded-lg text-xs font-bold">
                <span>+₹4,200.12 (5.66%)</span>
              </div>
            </div>

            {/* SVG line graph mock */}
            <div className="h-24 w-full relative overflow-hidden bg-black/20 rounded-xl border border-white/5 flex items-end">
              <svg className="w-full h-full text-emerald-400" viewBox="0 0 300 80" preserveAspectRatio="none">
                <path
                  d="M0,70 Q40,65 80,45 T160,50 T240,25 T300,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M0,70 Q40,65 80,45 T160,50 T240,25 T300,10 L300,80 L0,80 Z"
                  fill="url(#emerald-gradient)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute top-2 right-2 text-[9px] font-mono text-gray-500">Stock Ticker Mock</span>
            </div>

            <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Reliance: +1.8%</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> Infosys: -0.4%</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> HDFC Bank: +2.1%</span>
            </div>
          </div>
        </div>
      );

    case 'expense-tracker':
      return (
        <div className="flex flex-col gap-3 font-sans text-sm text-left">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Monthly Budget Usage</p>
              <p className="text-xl font-bold text-white mt-0.5">₹8,700 / ₹15,000 limit</p>
            </div>
            
            {/* Category Bars */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Food & Dining</span>
                  <span className="text-gray-400">₹4,200 / ₹5,000 (84%)</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 w-[84%] rounded-full" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Entertainment</span>
                  <span className="text-gray-400">₹1,500 / ₹3,000 (50%)</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[50%] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Savings Target</span>
                  <span className="text-sky-400 font-bold">₹3,000 saved (Goal: ₹5,000)</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 w-[60%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'finance-news':
      return (
        <div className="flex flex-col gap-3 font-sans text-sm text-left">
          <div className="space-y-3">
            <div className="bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/30 rounded-xl p-3.5 transition-colors">
              <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/15">
                Market Trend
              </span>
              <h4 className="text-sm font-semibold text-white mt-2 leading-snug">
                Inflation index adjustments could impact yield on local savings accounts.
              </h4>
              <p className="text-xs text-gray-500 mt-1">5 hours ago • Curated Insights</p>
            </div>
            
            <div className="bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/30 rounded-xl p-3.5 transition-colors">
              <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/15">
                Investing 101
              </span>
              <h4 className="text-sm font-semibold text-white mt-2 leading-snug">
                How to analyze asset diversification without getting lost in spreadsheet formulas.
              </h4>
              <p className="text-xs text-gray-500 mt-1">1 day ago • Personal Finance News</p>
            </div>
          </div>
        </div>
      );

    case 'community':
      return (
        <div className="flex flex-col gap-3 font-sans text-sm text-left">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400 font-bold">FN</div>
                <div>
                  <span className="text-xs font-semibold text-white">@finance_newbie</span>
                  <span className="text-[10px] text-gray-500 ml-2">2h ago</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                Should I pay off my credit card statement balance in full every month, or keep a small outstanding amount to build my credit history?
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500 text-black flex items-center justify-center text-[10px] font-bold">WC</div>
                <div>
                  <span className="text-xs font-semibold text-white">@wealth_coach</span>
                  <span className="text-[10px] text-indigo-400 ml-2">Advisor</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-indigo-400 mt-2 leading-relaxed bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-2.5">
                Always pay it in full! Keeping a balance only drains your money via interest fees. The idea that it helps build credit is a common myth. Pay in full and save your money!
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default FeaturesPage;
