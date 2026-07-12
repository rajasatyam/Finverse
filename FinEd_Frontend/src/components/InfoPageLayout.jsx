import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

const InfoPageLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-ink text-white">
      <SiteHeader />

      {/* Back to home — pinned to the top-left corner of the page, full-width row */}
      <div className="pt-24 md:pt-28">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gold text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 md:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-16 pt-10"
        >
          {/* Left: title + subtitle, sticky on wide screens so it stays in view while reading */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h1
              className={`font-display text-3xl md:text-5xl font-bold mb-4 leading-[1.1] ${
                typeof title === 'string'
                  ? 'bg-gradient-to-br from-gold to-gold-dark bg-clip-text text-transparent'
                  : 'text-white'
              }`}
            >
              {title}
            </h1>
            {subtitle && <p className="text-gray-400 text-base md:text-lg leading-relaxed">{subtitle}</p>}
          </div>

          {/* Right: body content */}
          <div className="space-y-10 text-gray-300 leading-relaxed max-w-2xl">
            {children}
          </div>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default InfoPageLayout;
