import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

// Renders the plain-text guide content: blank-line separated paragraphs,
// "- " bullet lines, and "Label:" lead-ins get a highlighted label.
const GuideContent = ({ text }) => {
  const lines = text.split('\n');
  const blocks = [];
  let list = null;

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (line.startsWith('-')) {
      if (!list) {
        list = [];
        blocks.push({ type: 'list', items: list, key: `list-${i}` });
      }
      list.push(line.substring(1).trim());
      return;
    }
    list = null;
    if (line) blocks.push({ type: 'p', text: line, key: `p-${i}` });
  });

  const renderInline = (text) => {
    const colonIdx = text.indexOf(':');
    if (colonIdx > 0 && colonIdx < 45) {
      return (
        <>
          <span className="text-white font-semibold">{text.slice(0, colonIdx + 1)}</span>
          {text.slice(colonIdx + 1)}
        </>
      );
    }
    return text;
  };

  return (
    <div className="flex flex-col gap-3.5">
      {blocks.map((block) =>
        block.type === 'list' ? (
          <ul key={block.key} className="flex flex-col gap-2 pl-1">
            {block.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2.5 text-gray-400 text-sm leading-relaxed">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gold/60 flex-shrink-0" />
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={block.key} className="text-gray-400 text-sm sm:text-[15px] leading-relaxed">
            {renderInline(block.text)}
          </p>
        )
      )}
    </div>
  );
};

const SimulatorGuide = ({
  title,
  titleAccent,
  subtitle,
  backPath,
  ctaPath,
  ctaLabel,
  stats,
  sections,
  howToUse,
  insights,
  example,
  footerNote,
}) => {
  const [openSections, setOpenSections] = useState({ [sections[0]?.id]: true });
  const navigate = useNavigate();

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      <SiteHeader />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gold/[0.04] rounded-full blur-[180px]" />
      </div>

      {/* Back link, pinned top-left */}
      <div className="relative z-10 pt-28">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <button
            onClick={() => navigate(backPath)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gold text-sm font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to simulators
          </button>
        </div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 pb-24 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-16">
          {/* ===== LEFT STICKY RAIL ===== */}
          <motion.aside
            initial="hidden"
            animate="show"
            variants={stagger}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <motion.p variants={fadeUp} className="text-gold text-xs font-bold uppercase tracking-widest mb-4">
              Guide
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold leading-[1.12] tracking-tight mb-4">
              {title}{' '}
              <span className="bg-gradient-to-r from-gold via-amber-400 to-gold-dark bg-clip-text text-transparent">
                {titleAccent}
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 text-[15px] leading-relaxed mb-7">
              {subtitle}
            </motion.p>

            {/* Quick stats as compact rows */}
            <motion.div variants={fadeUp} className="flex flex-col gap-2.5 mb-7">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-3">
                  <span className="w-9 h-9 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold flex-shrink-0">
                    <stat.icon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="font-display text-sm font-bold text-white leading-none">{stat.value}</div>
                    <div className="text-gray-500 text-[11px] mt-1 leading-none">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.button
              variants={fadeUp}
              onClick={() => navigate(ctaPath)}
              className="group w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-black bg-gradient-to-br from-gold to-gold-dark shadow-[0_8px_30px_rgba(255,215,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,215,0,0.45)] cursor-pointer"
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </motion.aside>

          {/* ===== RIGHT CONTENT ===== */}
          <div className="min-w-0">
            {/* Accordion sections */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              variants={stagger}
              className="flex flex-col gap-3 mb-16"
            >
              {sections.map((section) => {
                const isOpen = !!openSections[section.id];
                return (
                  <motion.div
                    key={section.id}
                    variants={fadeUp}
                    className={`bg-white/[0.02] border rounded-2xl overflow-hidden transition-colors duration-300 ${
                      isOpen ? 'border-gold/25' : 'border-white/[0.08] hover:border-white/[0.16]'
                    }`}
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-10 h-10 flex-shrink-0 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                          isOpen ? 'bg-gold text-black border-gold' : 'bg-gold/5 text-gold border-gold/15 group-hover:bg-gold/10'
                        }`}>
                          <section.icon className="w-5 h-5" />
                        </span>
                        <h3 className="font-sans text-base sm:text-lg font-bold text-white">{section.title}</h3>
                      </div>
                      <ChevronDown className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold' : ''}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/[0.06]">
                            <div className="pt-5">
                              <GuideContent text={section.content} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* How to use */}
            <motion.section
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="mb-16"
            >
              <motion.h2 variants={fadeUp} className="font-display text-2xl font-bold mb-8">
                {howToUse.title}
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                {howToUse.steps.map((step, i) => (
                  <motion.div key={step.title} variants={fadeUp} className="flex gap-4">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-gold to-gold-dark text-black flex items-center justify-center font-display font-bold shadow-[0_4px_16px_rgba(255,215,0,0.25)]">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base mb-1.5">{step.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Key insights */}
            <motion.section
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="mb-16"
            >
              <motion.h2 variants={fadeUp} className="font-display text-2xl font-bold mb-8">
                Key financial insights
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {insights.map((insight) => (
                  <motion.div
                    key={insight.title}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="bg-white/[0.02] border border-white/[0.08] hover:border-gold/25 rounded-2xl p-6 transition-colors duration-300"
                  >
                    <div className="w-10 h-10 mb-4 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold">
                      <insight.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-bold text-base mb-2">{insight.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{insight.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Example block (optional) */}
            {example && (
              <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                className="mb-4"
              >
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-7 sm:p-8">
                  <h2 className="font-display text-xl font-bold mb-2 text-center">{example.title}</h2>
                  <p className="text-gold text-sm font-semibold text-center mb-7">{example.scenario}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {example.items.map((item) => (
                      <div key={item.label} className="bg-gold/[0.04] border border-gold/15 rounded-2xl px-4 py-5 text-center">
                        <div className="text-gray-500 text-xs font-medium mb-1.5">{item.label}</div>
                        <div className="font-display text-lg sm:text-xl font-bold text-gold">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-amber-300/90 text-sm text-center font-medium bg-amber-400/[0.06] border border-amber-400/15 rounded-xl px-5 py-3.5">
                    {example.note}
                  </p>
                </div>
              </motion.section>
            )}

            <p className="text-gray-600 text-sm leading-relaxed mt-8">{footerNote}</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default SimulatorGuide;
