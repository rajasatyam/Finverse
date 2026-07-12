import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CreditCard,
  Landmark,
  BarChart3,
  TrendingUp,
  Wallet,
  CalendarClock,
  Calculator,
  Scale,
} from 'lucide-react';

const rotatingWords = [
  'interest',
  'billing cycles',
  'credit scores',
  'repayment',
  'penalties',
];

const tracks = [
  {
    key: 'credit',
    index: '01',
    icon: CreditCard,
    label: 'Credit Card',
    headline: 'Live a billing cycle, month by month.',
    description:
      'Spend against a limit, generate a statement, then decide how to pay it down. Watch interest, utilization, and your score react to every choice.',
    points: [
      { icon: BarChart3, label: 'Interest on carried balances' },
      { icon: TrendingUp, label: 'Credit-score impact' },
      { icon: Wallet, label: 'Minimum vs full payment' },
    ],
    startPath: '/credit',
    helpPath: '/credit!help',
    startLabel: 'Launch credit simulator',
  },
  {
    key: 'loan',
    index: '02',
    icon: Landmark,
    label: 'Loan & EMI',
    headline: 'See a loan the way a lender does.',
    description:
      'Set a principal, rate, and term, then work through the amortization one EMI at a time — paying on time, prepaying, or delaying to feel the cost.',
    points: [
      { icon: CalendarClock, label: 'Month-by-month schedule' },
      { icon: Calculator, label: 'EMI & total-cost math' },
      { icon: Scale, label: 'Prepay vs delay trade-offs' },
    ],
    startPath: '/loan',
    helpPath: '/loan!help',
    startLabel: 'Launch loan simulator',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const FinancialSimulatorLanding = () => {
  const [word, setWord] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setWord((prev) => (prev + 1) % rotatingWords.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      <SiteHeader />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-12%] left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-gold/[0.05] rounded-full blur-[190px]" />
        <div className="absolute bottom-[8%] right-[-8%] w-[420px] h-[420px] bg-gold-dark/[0.04] rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10">
        {/* Hero */}
        <section className="px-6 md:px-8 pt-36 pb-16">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-4xl">
              <motion.h1
                variants={fadeUp}
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-6"
              >
                Learn how debt really works —
                <br className="hidden sm:block" />{' '}
                <span className="inline-flex items-baseline">
                  <span className="text-gray-500">the&nbsp;</span>
                  <span className="relative inline-block min-w-[6ch]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={word}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-gradient-to-r from-gold via-amber-400 to-gold-dark bg-clip-text text-transparent"
                      >
                        {rotatingWords[word]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl"
              >
                Two interactive simulators put you in the driver's seat of a credit card and a loan.
                Make the calls, see the consequences, keep none of the risk.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Track chooser */}
        <section className="px-6 md:px-8 pb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {tracks.map((track) => (
                <motion.article
                  key={track.key}
                  variants={fadeUp}
                  className="group relative flex flex-col bg-white/[0.03] border border-white/[0.08] hover:border-gold/30 rounded-[28px] p-8 sm:p-9 overflow-hidden transition-colors duration-300"
                >
                  {/* Corner glow on hover */}
                  <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gold/[0.06] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative flex items-start justify-between mb-7">
                    <div className="w-14 h-14 rounded-2xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all duration-300">
                      <track.icon className="w-7 h-7" />
                    </div>
                    <span className="font-display text-5xl font-bold text-white/[0.06] leading-none select-none">
                      {track.index}
                    </span>
                  </div>

                  <span className="relative text-gold text-xs font-bold uppercase tracking-widest mb-3">
                    {track.label}
                  </span>
                  <h2 className="relative font-display text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
                    {track.headline}
                  </h2>
                  <p className="relative text-gray-400 text-[15px] leading-relaxed mb-7">
                    {track.description}
                  </p>

                  <ul className="relative flex flex-col gap-3 mb-8">
                    {track.points.map((p) => (
                      <li key={p.label} className="flex items-center gap-3 text-gray-300 text-sm">
                        <span className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gold/80 flex-shrink-0">
                          <p.icon className="w-4 h-4" />
                        </span>
                        {p.label}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-auto flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate(track.startPath)}
                      className="group/btn flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-black bg-gradient-to-br from-gold to-gold-dark shadow-[0_8px_30px_rgba(255,215,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,215,0,0.4)] cursor-pointer"
                    >
                      {track.startLabel}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                    <button
                      onClick={() => navigate(track.helpPath)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-gold border border-gold/25 bg-transparent hover:bg-gold/10 hover:border-gold/50 transition-all duration-300 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      How it works
                    </button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
};

export default FinancialSimulatorLanding;
