import { Link, useNavigate } from 'react-router-dom';

const SiteFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-[#111111] border-t border-gold/10 px-6 md:px-8 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 mb-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/faviconb.png" alt="FinEd logo" className="w-9 h-9 rounded-full object-cover" />
              <span className="font-sans text-2xl font-extrabold text-white">
                <span className="bg-gradient-to-br from-gold to-gold-dark bg-clip-text text-transparent">Fin</span>
                <span>Ed</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Practical financial education through simulations, an AI study companion, and a learning community — built to make money management easier to understand.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-sans font-semibold text-sm mb-1">Platform</h4>
              <button onClick={() => navigate('/features')} className="text-left text-gray-400 hover:text-gold text-sm transition-colors cursor-pointer">Features</button>
              <button onClick={() => navigate('/community')} className="text-left text-gray-400 hover:text-gold text-sm transition-colors cursor-pointer">Community</button>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-sans font-semibold text-sm mb-1">Company</h4>
              <Link to="/about" className="text-gray-400 hover:text-gold text-sm transition-colors">About Us</Link>
              <Link to="/contact" className="text-gray-400 hover:text-gold text-sm transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-sans font-semibold text-sm mb-1">Support</h4>
              <Link to="/help" className="text-gray-400 hover:text-gold text-sm transition-colors">Help Center</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-gold text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-gold text-sm transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
          <p className="text-gray-500 text-sm">© 2026 FinEd. All rights reserved.</p>
          <div className="flex gap-3">
            <a
              href="https://www.youtube.com/watch?v=1QaKuIKHQtE"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Demo Video"
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:bg-gold hover:text-black hover:border-gold hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M23.498 6.186a2.95 2.95 0 00-2.079-2.094C19.544 3.5 12 3.5 12 3.5s-7.544 0-9.419.592A2.95 2.95 0 00.502 6.186C0 8.071 0 12 0 12s0 3.929.502 5.814a2.95 2.95 0 002.079 2.094C4.456 20.5 12 20.5 12 20.5s7.544 0 9.419-.592a2.95 2.95 0 002.079-2.094C24 15.929 24 12 24 12s0-3.929-.502-5.814zM9.75 15.568V8.432L15.5 12l-5.75 3.568z"/>
              </svg>
            </a>
            <a
              href="https://github.com/a6hinandh/FinEd"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:bg-gold hover:text-black hover:border-gold hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
