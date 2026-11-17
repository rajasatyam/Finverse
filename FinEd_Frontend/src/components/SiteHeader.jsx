import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import {
  ChevronDown,
  CreditCard,
  TrendingUp,
  Coins,
  MessageSquare,
  Newspaper,
  Info,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
  HelpCircle,
  ArrowRight,
  GraduationCap,
  LineChart
} from 'lucide-react';

const SiteHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'simulators' | 'tools' | 'resources' | null

  const navRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const mobileRef = useRef(null);

  // Monitor scroll for header background styling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        navRef.current && !navRef.current.contains(e.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target))
      ) {
        setActiveDropdown(null);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setProfileOpen(false);
  }, [location]);

  const handleNavClick = (to, requiresAuth = false) => {
    if (requiresAuth && !user) {
      navigate('/login');
      return;
    }
    if (to.startsWith('http://') || to.startsWith('https://')) {
      window.location.href = to;
      return;
    }
    navigate(to);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setProfileOpen(false);
      navigate('/');
    });
  };

  const simulators = [
    {
      title: 'Credit Card Simulator',
      desc: 'Master card mechanics, interest fees, and credit scores.',
      icon: CreditCard,
      to: '/credit',
      requiresAuth: true
    },
    {
      title: 'Loan Simulator',
      desc: 'Calculate interest rates, amortization, and total cost of borrowing.',
      icon: Coins,
      to: '/loan',
      requiresAuth: true
    },
    {
      title: 'Stock Simulator',
      desc: 'Test trading strategies and portfolios without real-money risks.',
      icon: TrendingUp,
      to: '/stock',
      requiresAuth: true
    },
    {
      title: 'Paper Trading',
      desc: 'Live simulated paper trading on Numatix.',
      icon: LineChart,
      to: 'https://numatix-web.vercel.app/trading',
      requiresAuth: false
    }
  ];

  const tools = [
    {
      title: 'Tracker & Budgeting',
      desc: 'Monitor spending habits and track your custom savings goals.',
      icon: LayoutDashboard,
      to: '/tracker',
      requiresAuth: true
    },
    {
      title: 'AI Study Companion',
      desc: 'Get immediate, plain-language answers to finance queries.',
      icon: MessageSquare,
      to: '/chatbot',
      requiresAuth: true
    }
  ];

  const resources = [
    {
      title: 'Learning',
      desc: 'Master the stock market with Zerodha Varsity video modules.',
      icon: GraduationCap,
      to: '/learning'
    },
    {
      title: 'Market Insights',
      desc: 'Keep up with real-world financial events and news articles.',
      icon: Newspaper,
      to: '/news',
      requiresAuth: true
    },
    {
      title: 'Help Center',
      desc: 'Guides, simulator walk-throughs, and FAQs.',
      icon: HelpCircle,
      to: '/help'
    },
    {
      title: 'About',
      desc: 'Who we are and what we\'re building.',
      icon: Info,
      to: '/about'
    }
  ];

  const navGroups = [
    { key: 'simulators', label: 'Simulators', items: simulators },
    { key: 'tools', label: 'Tools & Companion', items: tools },
    { key: 'resources', label: 'Resources', items: resources }
  ];

  const activeGroup = navGroups.find((g) => g.key === activeDropdown);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-md border-b border-gold/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-black/30 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>

        {/* Left: Logo & Wordmark */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/faviconb.png"
            alt="FinEd logo"
            className="w-9 h-9 rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="font-sans text-xl font-extrabold tracking-tight text-white flex items-center">
            <span className="bg-gradient-to-br from-gold to-gold-dark bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300">Fin</span>
            <span className="text-white group-hover:text-gold transition-colors duration-300">Ed</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav
          ref={navRef}
          onMouseLeave={() => setActiveDropdown(null)}
          className="hidden md:flex items-center gap-4"
        >
          {navGroups.map((group) => (
            <button
              key={group.key}
              onClick={() => setActiveDropdown(activeDropdown === group.key ? null : group.key)}
              onMouseEnter={() => setActiveDropdown(group.key)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-sans text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                group.key === 'tools' ? 'w-[220px]' : 'w-[180px]'
              } ${
                activeDropdown === group.key ? 'text-gold bg-gold/10' : 'text-gray-300 hover:text-gold hover:bg-gold/5'
              }`}
            >
              {group.label}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === group.key ? 'rotate-180 text-gold' : ''}`} />
            </button>
          ))}
        </nav>

        {/* Right: Auth Action Trigger */}
        <div className="flex items-center gap-4 justify-self-end">
          {user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="profile-btn flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full font-sans text-xs md:text-sm font-semibold text-black bg-gradient-to-br from-gold to-gold-dark hover:brightness-110 transition-all duration-300 shadow-[0_2px_15px_rgba(255,215,0,0.25)] hover:shadow-[0_4px_20px_rgba(255,215,0,0.4)] cursor-pointer"
              >
                <User className="w-4 h-4 text-black" />
                <span className="max-w-[120px] truncate">{user.displayName || 'Account'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-black" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="absolute right-0 mt-2.5 w-52 bg-[#0a0a0a] border border-gold/25 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-[1010]"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1.5">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-gold/60">Signed In As</div>
                      <div className="text-xs text-white font-semibold truncate mt-0.5">{user.displayName || 'Student'}</div>
                      <div className="text-[10px] text-gray-400 truncate leading-none mt-0.5">{user.email}</div>
                    </div>

                    <button
                      onClick={() => handleNavClick('/features')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-gold hover:bg-gold/10 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left border-t border-white/5 mt-1 pt-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="hidden md:inline-flex flex-shrink-0 whitespace-nowrap px-5 py-2 rounded-full font-sans text-sm font-semibold text-gray-300 border border-white/15 transition-all duration-300 hover:border-gold hover:text-gold hover:bg-gold/5 cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="group flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-1.5 md:px-6 md:py-2.5 rounded-full font-sans text-xs md:text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-br from-gold to-gold-dark shadow-[0_3px_20px_rgba(255,215,0,0.25)] hover:shadow-[0_6px_25px_rgba(255,215,0,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform duration-300 flex-shrink-0" />
              </button>
            </>
          )}

          {/* Burger menu button for mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-gold hover:bg-gold/5 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navbar expansion — full-width panel that grows out of the header itself, styled as a clean
          Asana-style column: uppercase underlined label, plain text list, bottom utility strip */}
      {/* Navbar expansion — consolidated single dropdown for simulators, tools, and resources */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setActiveDropdown(activeDropdown || 'simulators')}
            onMouseLeave={() => setActiveDropdown(null)}
            className="hidden md:block w-full overflow-hidden bg-[#0a0a0a] border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 pb-6 grid grid-cols-[1fr_auto_1fr]">
              <div />
              <div className="flex gap-4">
                {/* Column 1: Simulators */}
                <div className="w-[180px]">
                  <div className="text-[11px] uppercase font-bold tracking-widest text-gray-500 pb-2.5 mb-1 border-b border-white/10">
                    Simulators
                  </div>
                  <div className="flex flex-col">
                    {simulators.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleNavClick(item.to, item.requiresAuth)}
                        className="text-left py-2.5 text-[15px] text-gray-300 hover:text-gold transition-colors duration-150 whitespace-nowrap cursor-pointer"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 2: Tools & Companion */}
                <div className="w-[220px]">
                  <div className="text-[11px] uppercase font-bold tracking-widest text-gray-500 pb-2.5 mb-1 border-b border-white/10">
                    Tools & Companion
                  </div>
                  <div className="flex flex-col">
                    {tools.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleNavClick(item.to, item.requiresAuth)}
                        className="text-left py-2.5 text-[15px] text-gray-300 hover:text-gold transition-colors duration-150 whitespace-nowrap cursor-pointer"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 3: Resources */}
                <div className="w-[180px]">
                  <div className="text-[11px] uppercase font-bold tracking-widest text-gray-500 pb-2.5 mb-1 border-b border-white/10">
                    Resources
                  </div>
                  <div className="flex flex-col">
                    {resources.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleNavClick(item.to, item.requiresAuth)}
                        className="text-left py-2.5 text-[15px] text-gray-300 hover:text-gold transition-colors duration-150 whitespace-nowrap cursor-pointer"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div />
            </div>

            {/* Bottom utility strip */}
            <div className="border-t border-white/10 bg-white/[0.02]">
              <div className="max-w-7xl mx-auto px-6 md:px-8 py-3.5 flex items-center gap-5 text-xs text-gray-500">
                <Link to="/help" className="hover:text-gold transition-colors">Help Center</Link>
                <span className="w-px h-3 bg-white/15" />
                <Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link>
                <span className="w-px h-3 bg-white/15" />
                <Link to="/signup" className="hover:text-gold transition-colors">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-black/95 border-b border-gold/15 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">

              {navGroups.map((group) => (
                <div key={group.key}>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-gold/50 mb-2">{group.label}</div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {group.items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleNavClick(item.to, item.requiresAuth)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gold/5 text-left transition-colors duration-200 cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-gold/10 text-gold">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{item.title}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {!user && (
                <div className="flex flex-col gap-3 border-t border-white/10 pt-4 pb-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 rounded-xl border border-white/15 font-semibold text-center text-gray-300 hover:text-gold hover:border-gold transition-colors cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="w-full py-3 rounded-xl font-semibold text-center text-black bg-gradient-to-br from-gold to-gold-dark cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default SiteHeader;
