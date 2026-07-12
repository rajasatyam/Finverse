import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Beams from './components/Beams';
import {
  ArrowRight,
  CreditCard,
  Coins,
  TrendingUp,
  LayoutDashboard,
  MessageSquare,
  Users
} from 'lucide-react';

const tools = [
  {
    title: 'Credit Card Simulator',
    description: 'A full billing cycle, modeled month by month.',
    icon: CreditCard,
    path: '/credit',
    cta: 'Try simulator',
    highlights: [
      'Set your own credit limit and APR',
      'Track statements, minimum payments, and interest charges',
      'See what missed payments actually cost you',
    ],
  },
  {
    title: 'Loan Simulator',
    description: 'See a loan the way a lender does.',
    icon: Coins,
    path: '/loan',
    cta: 'Try simulator',
    highlights: [
      'Build amortization schedules from real inputs',
      'Compare interest rates side by side',
      'See total cost, not just the monthly payment',
    ],
  },
  {
    title: 'Stock Simulator',
    description: 'Trade against real market behavior, no money on the line.',
    icon: TrendingUp,
    path: '/stock',
    cta: 'Try simulator',
    highlights: [
      'Buy and sell across a simulated market',
      'Track your holdings and trade history',
      'Learn key terms as you go, in context',
    ],
  },
  {
    title: 'Expense Tracker',
    description: 'Where your money actually goes, laid out plainly.',
    icon: LayoutDashboard,
    path: '/tracker',
    cta: 'Start tracking',
    highlights: [
      'Log day-to-day spending by category',
      'Set and follow custom savings goals',
      'Spot patterns over weeks and months',
    ],
  },
  {
    title: 'AI Study Companion',
    description: 'Ask a question, get a plain-language answer.',
    icon: MessageSquare,
    path: '/chatbot',
    cta: 'Ask a question',
    highlights: [
      'Explains finance concepts in everyday terms',
      'Answers grounded in what you\'re working on',
      'No jargon dumps, just direct explanations',
    ],
  },
  {
    title: 'Community',
    description: 'A space to compare notes with other learners.',
    icon: Users,
    path: '/community',
    cta: 'Join discussion',
    highlights: [
      'Discuss strategies from the simulators',
      'See how others approached the same problem',
      'Ask questions outside the AI chat',
    ],
  },
];

// Animation presets
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// Hero Section — gold/black Beams canvas scoped to just this section
const HeroSection = ({ isLoaded, onExplore, onJoinCommunity }) => (
  <section className="relative min-h-screen overflow-hidden flex flex-col justify-center bg-black">
    {/* Beams Canvas Background — fills the entire hero, tuned to read clearly as a real 3D effect */}
    <div className="absolute inset-0 z-0">
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

    {/* Light spotlight vignette: only just enough to keep the copy readable, not to hide the beams */}
    <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(ellipse_50%_38%_at_50%_40%,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.1)_60%,transparent_100%)]" />
    <div className="absolute inset-x-0 bottom-0 h-32 z-1 pointer-events-none bg-gradient-to-b from-transparent to-[#0a0a0a]" />

    <main className="relative flex flex-col items-center justify-center text-center px-6 md:px-8 pt-36 pb-20 min-h-screen z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Hero Title */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight mb-8 text-white max-w-3xl">
          Master Your Money,
          <br />
          <span className="relative bg-gradient-to-r from-gold via-amber-400 to-gold-dark bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(255,215,0,0.15)]">
            Shape Your Future
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12 font-sans font-medium">
          FinEd is a hands-on learning platform. Simulate credit card debt, model loan repayments, 
          practice stock trading, and budget with our AI companion—all in one zero-risk environment.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto">
          <button
            onClick={onExplore}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider text-black bg-gradient-to-br from-gold to-gold-dark shadow-[0_8px_30px_rgba(255,215,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,215,0,0.55)] cursor-pointer"
          >
            Explore Simulators
            <ArrowRight className="w-4 h-4 text-black transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={onJoinCommunity}
            className="w-full sm:w-auto px-9 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider text-gold border-2 border-gold/45 bg-black/40 hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer"
          >
            Join Community
          </button>
        </div>
      </motion.div>
    </main>
  </section>
);

// Tools / features grid
const ToolsSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative px-6 md:px-8 py-28 bg-[#0b0b0d] border-t border-gold/15">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header: eyebrow + title on the left, supporting copy on the right */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end mb-16"
        >
          <div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold leading-[1.1] text-white">
              Practice first.
              <br />
              <span className="text-gray-500">Understand it after.</span>
            </h2>
          </div>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed lg:pb-2">
            Every tool below is live and interactive. Set your own numbers, make the decision,
            and see exactly what happens — the same way it would with real money, minus the risk.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => navigate(tool.path)}
              className="group cursor-pointer bg-white/[0.03] border border-white/[0.08] hover:border-gold/30 rounded-2xl p-5 transition-colors duration-300 hover:shadow-[0_15px_45px_rgba(0,0,0,0.5),0_0_25px_rgba(255,215,0,0.05)] flex flex-col"
            >
              <div className="w-11 h-11 shrink-0 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all duration-300 mb-4">
                <tool.icon className="w-5 h-5" />
              </div>

              <h3 className="font-sans text-sm font-bold text-white group-hover:text-gold transition-colors mb-1.5 leading-snug">
                {tool.title}
              </h3>

              <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{tool.description}</p>

              <span className="mt-auto inline-flex items-center gap-1 text-gold text-xs font-semibold group-hover:translate-x-1 transition-transform duration-300">
                {tool.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Main Landing Page Component
const FinEdLanding = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleExplore = () => {
    navigate('/features');
  };

  const handleJoinCommunity = () => {
    navigate('/community');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between overflow-x-hidden">
      <SiteHeader />
      <div className="flex-grow w-full flex flex-col">
        <HeroSection isLoaded={isLoaded} onExplore={handleExplore} onJoinCommunity={handleJoinCommunity} />
        <ToolsSection />
      </div>
      <SiteFooter />
    </div>
  );
};

export default FinEdLanding;
