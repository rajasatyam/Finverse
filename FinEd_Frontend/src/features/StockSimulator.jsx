import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Beams from '../components/Beams';
import {
  TrendingUp, TrendingDown, PieChart, Bell, X,
  ArrowLeft, ArrowRight, BarChart3, GraduationCap,
  Wallet, Briefcase, RotateCcw, BookOpen,
  ChevronDown, Layers, Search,
  ChevronLeft, ChevronRight, Lightbulb
} from 'lucide-react';

/* ─── animation tokens ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

/* ─── small reusable tiles ─── */
const MetricTile = ({ label, value, tone = 'white', sub }) => {
  const tones = { white: 'text-white', green: 'text-emerald-400', red: 'text-red-400', gold: 'text-gold' };
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
      <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1.5">{label}</div>
      <div className={`font-display text-lg font-bold ${tones[tone]}`}>{value}</div>
      {sub && <div className="text-gray-600 text-[11px] mt-1 leading-snug">{sub}</div>}
    </div>
  );
};

/* ─── portfolio gauge (semicircular) ─── */
const PortfolioGauge = ({ value, initial }) => {
  const pct = Math.max(0, Math.min(2, value / initial));
  const radius = 80;
  const circ = Math.PI * radius;
  const dash = circ * Math.min(pct, 1);
  const color = pct >= 1 ? '#34d399' : pct >= 0.9 ? '#fbbf24' : '#f87171';
  const returnPct = ((value - initial) / initial * 100).toFixed(1);
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-full max-w-[200px]">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.22,1,0.36,1), stroke 0.4s' }}
        />
      </svg>
      <div className="-mt-5 text-center">
        <div className="font-display text-2xl font-bold" style={{ color }}>
          {returnPct > 0 ? '+' : ''}{returnPct}%
        </div>
        <div className="text-gray-500 text-[11px] mt-0.5">Return on ₹{initial.toLocaleString()}</div>
      </div>
    </div>
  );
};

/* ─── tab config ─── */
const TABS = [
  { key: 'market', label: 'Market', icon: BarChart3 },
  { key: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { key: 'learn', label: 'Learn', icon: GraduationCap },
];

/* ════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════ */
const StockSimulator = () => {
  const navigate = useNavigate();
  const INITIAL_CASH = 100000;

  /* ─── state ─── */
  const [activeTab, setActiveTab] = useState('market');
  const [wallet, setWallet] = useState(INITIAL_CASH);
  const [holdings, setHoldings] = useState({});
  const [tradeHistory, setTradeHistory] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [currentNews, setCurrentNews] = useState(0);
  const [learnOpen, setLearnOpen] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const newsIntervalRef = useRef(null);

  /* ─── company data ─── */
  const companies = {
    'RELIANCE': { name: 'Reliance Industries Ltd', description: 'India\'s largest private sector company operating in petrochemicals, oil & gas, and retail sectors.', sector: 'Energy', marketCap: '₹15,50,000 Cr', pe: 25.4 },
    'TCS': { name: 'Tata Consultancy Services', description: 'Global leader in IT services, consulting and business solutions with strong presence in digital transformation.', sector: 'IT Services', marketCap: '₹12,80,000 Cr', pe: 28.9 },
    'HDFCBANK': { name: 'HDFC Bank Ltd', description: 'India\'s largest private sector bank offering comprehensive banking and financial services.', sector: 'Banking', marketCap: '₹11,20,000 Cr', pe: 18.5 },
    'INFY': { name: 'Infosys Ltd', description: 'Multinational IT corporation providing consulting, technology and outsourcing services globally.', sector: 'IT Services', marketCap: '₹7,45,000 Cr', pe: 24.8 },
    'HINDUNILVR': { name: 'Hindustan Unilever Ltd', description: 'Leading FMCG company with portfolio of trusted brands in home & personal care and foods.', sector: 'FMCG', marketCap: '₹5,90,000 Cr', pe: 58.2 },
    'ICICIBANK': { name: 'ICICI Bank Ltd', description: 'India\'s second-largest private sector bank providing retail and corporate banking services.', sector: 'Banking', marketCap: '₹8,75,000 Cr', pe: 16.8 },
    'SBIN': { name: 'State Bank of India', description: 'India\'s largest public sector bank with extensive domestic and international presence.', sector: 'Banking', marketCap: '₹6,20,000 Cr', pe: 12.4 },
    'BHARTIARTL': { name: 'Bharti Airtel Ltd', description: 'Leading telecommunications company providing mobile, fixed-line and digital services across India and Africa.', sector: 'Telecom', marketCap: '₹4,85,000 Cr', pe: 22.1 },
    'ITC': { name: 'ITC Ltd', description: 'Diversified conglomerate with presence in FMCG, hotels, paperboards, packaging and agri-business.', sector: 'FMCG', marketCap: '₹5,15,000 Cr', pe: 26.7 },
    'LT': { name: 'Larsen & Toubro Ltd', description: 'Engineering, construction and manufacturing company with global operations in infrastructure projects.', sector: 'Construction', marketCap: '₹4,95,000 Cr', pe: 19.3 },
    'MARUTI': { name: 'Maruti Suzuki India Ltd', description: 'India\'s largest passenger car manufacturer with strong market presence and dealer network.', sector: 'Automotive', marketCap: '₹4,25,000 Cr', pe: 23.8 },
    'ASIANPAINT': { name: 'Asian Paints Ltd', description: 'Leading paint company in India with strong brand presence in decorative and industrial coatings.', sector: 'Paints', marketCap: '₹3,85,000 Cr', pe: 55.2 },
  };

  /* ─── price engine (GBM) ─── */
  const [stockData, setStockData] = useState(() => {
    const data = {};
    Object.keys(companies).forEach(symbol => {
      const basePrice = Math.random() * 2000 + 500;
      const history = [];
      let currentPrice = basePrice;

      const now = new Date();
      const startHour = 9;
      const currentHour = now.getHours();
      const marketHours = currentHour >= startHour ? currentHour - startHour + 1 : 7;

      for (let i = Math.min(marketHours, 7) - 1; i >= 0; i--) {
        const time = new Date();
        time.setHours(startHour + (Math.min(marketHours, 7) - 1 - i));
        time.setMinutes(0);
        time.setSeconds(0);

        const hourOfDay = startHour + (Math.min(marketHours, 7) - 1 - i);
        const distanceFromMidpoint = Math.abs(hourOfDay - 12.5);
        const volatilityMultiplier = 0.8 + (distanceFromMidpoint / 7) * 0.4;

        const dt = 1 / (252 * 7);
        const mu = 0.1;
        const sigma = 0.25 * volatilityMultiplier;
        const randomShock = Math.random() < 0.02 ? (Math.random() - 0.5) * 0.05 : 0;

        const drift = mu * dt;
        const diffusion = sigma * Math.sqrt(dt) * (Math.random() * 2 - 1);
        const priceChange = currentPrice * (drift + diffusion + randomShock);

        currentPrice = Math.max(currentPrice + priceChange, 10);

        const timeString = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

        history.push({
          date: timeString,
          time: time.getTime(),
          price: Math.round(currentPrice * 100) / 100,
          volume: Math.floor(Math.random() * 100000) + 10000,
        });
      }

      data[symbol] = {
        currentPrice: history[history.length - 1].price,
        history,
        change: history.length > 1
          ? ((history[history.length - 1].price - history[history.length - 2].price) / history[history.length - 2].price * 100)
          : 0,
      };
    });
    return data;
  });

  /* ─── live price tick (5 s) ─── */
  useEffect(() => {
    const interval = setInterval(() => {
      setStockData(prevData => {
        const newData = { ...prevData };
        const now = new Date();
        const currentHour = now.getHours();
        const isMarketHours = currentHour >= 9 && currentHour <= 15;

        Object.keys(newData).forEach(symbol => {
          const currentPrice = newData[symbol].currentPrice;
          const baseVolatility = isMarketHours ? 0.005 : 0.002;
          const distanceFromMidpoint = Math.abs(currentHour - 12);
          const volatilityMultiplier = isMarketHours ? (0.7 + (distanceFromMidpoint / 6) * 0.6) : 0.3;
          const volatility = baseVolatility * volatilityMultiplier;
          const randomChange = (Math.random() - 0.5) * volatility;
          const newPrice = Math.max(currentPrice * (1 + randomChange), 10);

          const history = [...newData[symbol].history];
          const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

          if (history.length >= 7) history.shift();

          history.push({
            date: timeString,
            time: now.getTime(),
            price: Math.round(newPrice * 100) / 100,
            volume: Math.floor(Math.random() * 50000) + 5000,
          });

          newData[symbol] = {
            ...newData[symbol],
            currentPrice: Math.round(newPrice * 100) / 100,
            change: ((newPrice - currentPrice) / currentPrice * 100),
            history,
          };
        });
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ─── market factors rotation ─── */
  const marketFactors = [
    {
      label: 'Interest Rate (RBI Repo)',
      value: '6.50%',
      impact: 'Higher rates increase corporate borrowing costs, which can slow down stock growth.',
      status: 'neutral'
    },
    {
      label: 'Inflation (CPI)',
      value: '4.85%',
      impact: 'Moderating inflation boosts business margins and signals potential rate cuts.',
      status: 'positive'
    },
    {
      label: 'GDP Growth',
      value: '+7.8%',
      impact: 'Strong economic expansion drives corporate sales and increases investor demand.',
      status: 'positive'
    },
    {
      label: 'Crude Oil (Brent)',
      value: '$78.50/bbl',
      impact: 'Lower oil prices decrease India\'s import bills, strengthening corporate margins.',
      status: 'positive'
    },
    {
      label: 'US 10-Yr Yield',
      value: '4.25%',
      impact: 'Rising US yields can trigger foreign fund outflows from Indian equities.',
      status: 'negative'
    },
    {
      label: 'FII Net Flow',
      value: '+₹12,400 Cr',
      impact: 'Foreign institutional buying increases market liquidity, driving valuations higher.',
      status: 'positive'
    },
    {
      label: 'USD/INR Rate',
      value: '₹83.40',
      impact: 'A weaker Rupee benefits IT/pharma exporters but increases import costs for fuel/tech.',
      status: 'neutral'
    },
    {
      label: 'Valuation (Nifty P/E)',
      value: '21.8',
      impact: 'Trading close to historical averages (20-22x), indicating fair valuation.',
      status: 'neutral'
    },
    {
      label: 'India 10-Yr Yield',
      value: '7.08%',
      impact: 'Lower government yields make equity markets more attractive to capital.',
      status: 'positive'
    }
  ];

  useEffect(() => {
    newsIntervalRef.current = setInterval(() => {
      setCurrentNews(prev => (prev + 1) % marketFactors.length);
    }, 5000);
    return () => { if (newsIntervalRef.current) clearInterval(newsIntervalRef.current); };
  }, []);

  /* ─── learn data ─── */
  const financialTerms = {
    'Stock': 'A share in the ownership of a company, representing a claim on part of the company\'s assets and earnings.',
    'Dividend': 'A payment made by corporations to their shareholders, usually as a distribution of profits.',
    'Market Cap': 'The total value of a company\'s shares, calculated by multiplying share price by number of shares outstanding.',
    'P/E Ratio': 'Price-to-Earnings ratio, comparing a company\'s current share price to its per-share earnings.',
    'Bull Market': 'A market condition where prices are rising or are expected to rise.',
    'Bear Market': 'A market condition where prices are falling or are expected to fall.',
    'Volatility': 'The degree of variation in a stock\'s price over time.',
    'Portfolio': 'A collection of financial investments like stocks, bonds, and cash.',
    'IPO': 'Initial Public Offering - when a company first sells shares to the public.',
    'Market Order': 'An order to buy or sell a stock immediately at the current market price.',
    'Limit Order': 'An order to buy or sell a stock at a specific price or better.',
    'Stop Loss': 'An order to sell a stock when it reaches a certain price to limit losses.',
    'ROI': 'Return on Investment - a measure of the efficiency of an investment.',
    'Beta': 'A measure of a stock\'s volatility compared to the overall market.',
    'EPS': 'Earnings Per Share - a company\'s profit divided by the outstanding shares.',
    'Book Value': 'The net worth of a company according to its balance sheet.',
    'Liquidity': 'How easily an asset can be converted into cash.',
    'Yield': 'The income return on an investment, expressed as a percentage.',
    'Sector': 'A group of companies that operate in the same business area.',
    'Blue Chip': 'Stocks of large, well-established companies with reliable performance.',
  };

  const termCategories = {
    'All': Object.keys(financialTerms),
    'Basics': ['Stock', 'Dividend', 'Market Cap', 'Bull Market', 'Bear Market', 'Portfolio', 'IPO', 'Yield', 'Sector', 'Blue Chip'],
    'Trading Orders': ['Market Order', 'Limit Order', 'Stop Loss', 'Liquidity'],
    'Ratios & Metrics': ['P/E Ratio', 'Volatility', 'ROI', 'Beta', 'EPS', 'Book Value']
  };

  const investmentTips = [
    {
      tip: 'Diversify your portfolio across different sectors to reduce risk.',
      insight: 'If one sector (like Tech) experiences a downturn, gains in other sectors (like FMCG or Banking) can balance out your overall portfolio performance.'
    },
    {
      tip: 'Never invest more than you can afford to lose.',
      insight: 'Equities can be highly volatile. Keeping your essential funds safe ensures you won\'t be forced to sell your stocks at a loss during a market dip.'
    },
    {
      tip: 'Do thorough research before investing in any company.',
      insight: 'Analyze the company\'s financial statements, management quality, competitive advantages, and long-term industry outlook before committing capital.'
    },
    {
      tip: 'Consider long-term investing rather than frequent trading.',
      insight: 'Compounding works best over long horizons. Frequent trading incurs high transaction costs, taxes, and increases the probability of short-term losses.'
    },
    {
      tip: 'Keep emotions in check - don\'t panic sell during market downturns.',
      insight: 'Market corrections are normal. Panic selling locks in temporary paper losses. Focus on the underlying business value rather than daily price fluctuations.'
    },
    {
      tip: 'Regularly review and rebalance your portfolio.',
      insight: 'Over time, some stocks will grow faster than others, changing your risk exposure. Rebalancing helps restore your original target asset allocation.'
    },
    {
      tip: 'Understand the company\'s business model before investing.',
      insight: 'If you can\'t explain how a company makes money, you shouldn\'t buy its shares. Invest in businesses that fall within your circle of competence.'
    },
    {
      tip: 'Pay attention to management quality and corporate governance.',
      insight: 'Competent, honest, and shareholder-friendly management is key to unlocking a company\'s true growth potential over the long run.'
    },
    {
      tip: 'Consider the company\'s debt levels and financial health.',
      insight: 'High debt increases financial risk. Companies with strong balance sheets and low debt are better positioned to survive economic downturns.'
    },
    {
      tip: 'Look at industry trends and competitive positioning.',
      insight: 'Invest in companies with a wide economic moat (competitive advantage) operating in structurally growing industries.'
    },
    {
      tip: 'Don\'t try to time the market - time in market beats timing the market.',
      insight: 'Missing just a few of the market\'s best days can drastically reduce your long-term returns. Consistent, disciplined investing is a safer strategy.'
    },
    {
      tip: 'Start investing early to benefit from compound growth.',
      insight: 'The earlier you start, the more time your returns have to generate their own returns. Even small amounts saved early grow exponentially over decades.'
    },
    {
      tip: 'Consider systematic investment plans (SIP) for disciplined investing.',
      insight: 'SIPs allow you to buy more shares when prices are low and fewer when prices are high, averaging out your purchase costs automatically.'
    },
    {
      tip: 'Keep some cash reserves for emergency situations.',
      insight: 'Having liquid cash prevents you from having to liquidate your long-term investments prematurely when faced with unexpected life expenses.'
    },
    {
      tip: 'Understand tax implications of your investments.',
      insight: 'Different holding periods trigger different tax rates (e.g., Short-Term vs. Long-Term Capital Gains). Plan transactions to optimize net after-tax returns.'
    },
    {
      tip: 'Monitor key financial ratios like P/E, P/B, and ROE.',
      insight: 'Ratios help evaluate whether a stock is cheap or expensive relative to its earnings, assets, and capital efficiency.'
    },
    {
      tip: 'Be wary of hot tips and market rumors.',
      insight: 'Relying on hearsay is speculation, not investing. Always perform your own independent verification before making any trade decisions.'
    },
    {
      tip: 'Consider the economic cycle when making investment decisions.',
      insight: 'Different sectors perform well in different stages of the economic cycle. Defensive sectors like FMCG tend to hold up better during recessions.'
    },
    {
      tip: 'Learn from your mistakes and keep improving your strategy.',
      insight: 'Every investor makes wrong calls. Reviewing your past losing trades helps you identify biases, correct bad habits, and refine your process.'
    }
  ];

  /* ─── derived values ─── */
  const calculatePortfolioValue = () => {
    let totalValue = wallet;
    Object.entries(holdings).forEach(([symbol, quantity]) => {
      totalValue += quantity * stockData[symbol].currentPrice;
    });
    return totalValue;
  };

  const calculateTotalPL = () => calculatePortfolioValue() - INITIAL_CASH;

  const holdingEntries = Object.entries(holdings).filter(([, q]) => q > 0);
  const holdingCount = holdingEntries.length;
  const portfolioValue = calculatePortfolioValue();
  const totalPL = calculateTotalPL();
  const holdingsValue = portfolioValue - wallet;

  /* ─── trade handler ─── */
  const handleTrade = (symbol, action) => {
    const price = stockData[symbol].currentPrice;
    const amount = parseInt(tradeAmount);

    if (!amount || amount <= 0) return;

    if (action === 'buy') {
      const totalCost = amount * price;
      if (totalCost <= wallet) {
        setWallet(prev => prev - totalCost);
        setHoldings(prev => ({ ...prev, [symbol]: (prev[symbol] || 0) + amount }));
        setTradeHistory(prev => [{
          id: Date.now(), symbol, action: 'BUY', quantity: amount, price, total: totalCost, timestamp: new Date().toLocaleString(),
        }, ...prev]);
      }
    } else if (action === 'sell') {
      const currentHolding = holdings[symbol] || 0;
      if (amount <= currentHolding) {
        const totalValue = amount * price;
        setWallet(prev => prev + totalValue);
        setHoldings(prev => ({ ...prev, [symbol]: prev[symbol] - amount }));
        setTradeHistory(prev => [{
          id: Date.now(), symbol, action: 'SELL', quantity: amount, price, total: totalValue, timestamp: new Date().toLocaleString(),
        }, ...prev]);
      }
    }

    setTradeAmount('');
    setSelectedStock(null);
  };

  const openStockDrawer = (symbol) => {
    setSelectedStock(symbol);
    setTradeAmount('');
  };

  const closeDrawer = () => {
    setSelectedStock(null);
  };

  const resetPortfolio = () => {
    setWallet(INITIAL_CASH);
    setHoldings({});
    setTradeHistory([]);
    setSelectedStock(null);
  };

  /* ══════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════ */
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">

      {/* Beams background */}
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none">
        <Beams beamWidth={3.2} beamHeight={30} beamNumber={16} lightColor="#FFD700" speed={2.4} noiseIntensity={2.6} scale={0.18} rotation={16} />
      </div>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gold/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-gold-dark/[0.03] rounded-full blur-[140px]" />
      </div>

      {/* ─── Slim workspace toolbar ─── */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4.5">
            <button onClick={() => navigate('/features')} className="flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-semibold transition-colors cursor-pointer">
              <ArrowLeft className="w-4.5 h-4.5" />
              <span className="hidden sm:inline">Features</span>
            </button>
            <div className="w-px h-6 bg-white/[0.08]" />
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-gold" />
              <span className="font-display text-base font-bold text-white">Stock Simulator</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Tab pills */}
            <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                    activeTab === tab.key ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={resetPortfolio}
              className="ml-3 p-2.5 rounded-xl text-gray-500 hover:text-gold hover:bg-white/[0.04] transition-colors cursor-pointer"
              title="Reset portfolio"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── News ticker ─── */}
      <div className="relative z-10 bg-white/[0.015] border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-2.5 flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="text-gold text-[10px] font-bold uppercase tracking-widest">Market Drivers</span>
          </div>
          <div className="w-px h-3.5 bg-white/[0.1] flex-shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentNews}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="text-xs text-gray-300 flex items-center gap-2 overflow-hidden truncate"
            >
              <span className="font-semibold text-white flex-shrink-0">{marketFactors[currentNews].label}:</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                marketFactors[currentNews].status === 'positive' ? 'bg-emerald-500/20 text-emerald-400' :
                marketFactors[currentNews].status === 'negative' ? 'bg-red-500/20 text-red-400' :
                'bg-white/[0.06] text-gray-300'
              }`}>
                {marketFactors[currentNews].value}
              </span>
              <span className="text-gray-400 truncate">{marketFactors[currentNews].impact}</span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* ═══ COCKPIT ═══ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">

          {/* ─── LEFT RAIL (sticky) ─── */}
          <motion.aside initial="hidden" animate="show" variants={stagger} className="lg:sticky lg:top-[72px] lg:self-start flex flex-col gap-4">

            {/* Portfolio gauge */}
            <motion.div variants={fadeUp} className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5">
              <div className="text-gold text-[10px] font-bold uppercase tracking-widest mb-3">Portfolio</div>
              <PortfolioGauge value={portfolioValue} initial={INITIAL_CASH} />
            </motion.div>

            {/* Vitals */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl px-4 py-3">
                <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">Cash</div>
                <div className="font-display text-base font-bold text-white">₹{wallet.toLocaleString()}</div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl px-4 py-3">
                <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">Invested</div>
                <div className="font-display text-base font-bold text-white">₹{Math.round(holdingsValue).toLocaleString()}</div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl px-4 py-3">
                <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">Total</div>
                <div className="font-display text-base font-bold text-white">₹{Math.round(portfolioValue).toLocaleString()}</div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl px-4 py-3">
                <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">P&L</div>
                <div className={`font-display text-base font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalPL >= 0 ? '+' : ''}₹{Math.round(totalPL).toLocaleString()}
                </div>
              </div>
            </motion.div>

            {/* Compact holdings */}
            <motion.div variants={fadeUp} className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-gold" />
                  <span className="text-white text-xs font-bold">Holdings</span>
                </div>
                <span className="text-gray-500 text-[11px]">{holdingCount} stock{holdingCount !== 1 ? 's' : ''}</span>
              </div>

              {holdingCount === 0 ? (
                <div className="px-4 py-6 text-center text-gray-600 text-xs">No holdings yet</div>
              ) : (
                <div className="divide-y divide-white/[0.04] max-h-[260px] overflow-y-auto">
                  {holdingEntries.map(([symbol, qty]) => {
                    const price = stockData[symbol].currentPrice;
                    const change = stockData[symbol].change;
                    const isPos = change >= 0;
                    return (
                      <button
                        key={symbol}
                        onClick={() => openStockDrawer(symbol)}
                        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/[0.03] transition-colors cursor-pointer text-left"
                      >
                        <div>
                          <div className="text-white text-xs font-bold">{symbol}</div>
                          <div className="text-gray-600 text-[10px]">{qty} shares</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-xs font-semibold">₹{(qty * price).toLocaleString()}</div>
                          <div className={`text-[10px] font-semibold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isPos ? '+' : ''}{change.toFixed(2)}%
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Recent activity (compact) */}
            {tradeHistory.length > 0 && (
              <motion.div variants={fadeUp} className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <span className="text-white text-xs font-bold">Recent Activity</span>
                </div>
                <div className="divide-y divide-white/[0.04] max-h-[180px] overflow-y-auto">
                  {tradeHistory.slice(0, 6).map(trade => (
                    <div key={trade.id} className="px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${trade.action === 'BUY' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span className="text-white text-xs font-semibold">{trade.symbol}</span>
                        <span className="text-gray-600 text-[10px]">{trade.quantity}x</span>
                      </div>
                      <span className="text-gray-400 text-[11px] font-medium">₹{trade.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.aside>

          {/* ─── RIGHT PANEL ─── */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {/* ════ MARKET TAB ════ */}
              {activeTab === 'market' && (
                <motion.div key="market" initial="hidden" animate="show" exit="hidden" variants={stagger}>
                  <motion.div variants={fadeUp} className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-xl font-bold text-white">Market</h2>
                    <span className="text-gray-500 text-xs">{Object.keys(companies).length} stocks</span>
                  </motion.div>

                  <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {Object.keys(companies).map(symbol => {
                      const stock = stockData[symbol];
                      const company = companies[symbol];
                      const holding = holdings[symbol] || 0;
                      const isPositive = stock.change >= 0;

                      return (
                        <motion.button
                          key={symbol}
                          variants={fadeUp}
                          whileHover={{ y: -3 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          onClick={() => openStockDrawer(symbol)}
                          className="group relative bg-white/[0.02] border border-white/[0.08] hover:border-gold/25 rounded-2xl p-4 cursor-pointer transition-colors duration-300 text-left w-full"
                        >
                          <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gold/[0.05] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          <div className="relative flex justify-between items-start mb-2.5">
                            <div>
                              <div className="font-display text-sm font-bold text-white">{symbol}</div>
                              <div className="text-gray-500 text-[10px] leading-snug mt-0.5">{company.name}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-display text-base font-bold text-white">₹{stock.currentPrice}</div>
                              <div className={`flex items-center gap-0.5 justify-end text-[11px] font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {Math.abs(stock.change).toFixed(2)}%
                              </div>
                            </div>
                          </div>

                          <div className="relative flex items-center gap-2 text-[10px] text-gray-600 mb-2.5">
                            <span className="px-1.5 py-0.5 bg-white/[0.04] rounded">{company.sector}</span>
                            <span>P/E {company.pe}</span>
                            {holding > 0 && <span className="text-gold font-bold ml-auto">{holding} held</span>}
                          </div>

                          <div className="relative h-[44px]">
                            <ResponsiveContainer width="100%" height={44}>
                              <LineChart data={stock.history}>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={false} />
                                <Line type="monotone" dataKey="price" stroke={isPositive ? '#34d399' : '#f87171'} strokeWidth={1.5} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}

              {/* ════ PORTFOLIO TAB ════ */}
              {activeTab === 'portfolio' && (
                <motion.div key="portfolio" initial="hidden" animate="show" exit="hidden" variants={stagger}>
                  {/* Metric tiles */}
                  <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    <MetricTile label="Cash" value={`₹${wallet.toLocaleString()}`} />
                    <MetricTile label="Holdings Value" value={`₹${Math.round(holdingsValue).toLocaleString()}`} />
                    <MetricTile label="Portfolio" value={`₹${Math.round(portfolioValue).toLocaleString()}`} tone="gold" />
                    <MetricTile label="P&L" value={`${totalPL >= 0 ? '+' : ''}₹${Math.round(totalPL).toLocaleString()}`} tone={totalPL >= 0 ? 'green' : 'red'} sub={`${(totalPL / INITIAL_CASH * 100).toFixed(1)}% return`} />
                  </motion.div>

                  {/* Holdings expanded */}
                  <motion.h2 variants={fadeUp} className="font-display text-lg font-bold text-white mb-4">Your Holdings</motion.h2>
                  {holdingCount === 0 ? (
                    <motion.div variants={fadeUp} className="bg-white/[0.02] border border-white/[0.08] rounded-2xl text-center py-16">
                      <Briefcase className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm mb-4">Your portfolio is empty.</p>
                      <button onClick={() => setActiveTab('market')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gold text-black cursor-pointer hover:-translate-y-0.5 transition-transform">
                        Browse Market <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                      {holdingEntries.map(([symbol, quantity]) => {
                        const currentValue = quantity * stockData[symbol].currentPrice;
                        const price = stockData[symbol].currentPrice;
                        const change = stockData[symbol].change;
                        const isPos = change >= 0;
                        return (
                          <motion.div key={symbol} variants={fadeUp} className="bg-white/[0.02] border border-white/[0.08] hover:border-gold/20 rounded-2xl p-5 transition-colors duration-300">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className="font-display text-base font-bold text-white">{symbol}</span>
                                <span className="block text-gray-500 text-[10px] mt-0.5">{companies[symbol].name}</span>
                              </div>
                              <span className={`flex items-center gap-1 text-xs font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {Math.abs(change).toFixed(2)}%
                              </span>
                            </div>

                            <div className="flex items-end justify-between mb-4">
                              <div>
                                <div className="text-gray-500 text-[10px] mb-0.5">{quantity} shares @ ₹{price}</div>
                                <div className="font-display text-xl font-bold text-gold">₹{Math.round(currentValue).toLocaleString()}</div>
                              </div>
                              <div className="h-[40px] w-[100px]">
                                <ResponsiveContainer width="100%" height={40}>
                                  <LineChart data={stockData[symbol].history}>
                                    <Line type="monotone" dataKey="price" stroke={isPos ? '#34d399' : '#f87171'} strokeWidth={1.5} dot={false} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button onClick={() => openStockDrawer(symbol)} className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:text-gold hover:border-gold/25 transition-colors">
                                Trade
                              </button>
                              <button
                                onClick={() => { setSelectedStock(symbol); setTradeAmount(quantity.toString()); }}
                                className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer bg-red-500/8 border border-red-500/15 text-red-400 hover:bg-red-500/15 hover:border-red-500/30 transition-colors"
                              >
                                Sell All
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Trade history */}
                  <motion.h2 variants={fadeUp} className="font-display text-lg font-bold text-white mb-4">Trade History</motion.h2>
                  {tradeHistory.length === 0 ? (
                    <motion.div variants={fadeUp} className="bg-white/[0.02] border border-white/[0.08] rounded-2xl text-center py-10 text-gray-600 text-sm">
                      No trades yet.
                    </motion.div>
                  ) : (
                    <motion.div variants={stagger} className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
                      {tradeHistory.slice(0, 15).map(trade => (
                        <motion.div key={trade.id} variants={fadeUp} className="px-5 py-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${trade.action === 'BUY' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                              {trade.action}
                            </span>
                            <span className="font-bold text-white text-sm">{trade.symbol}</span>
                            <span className="text-gray-500 text-xs">{trade.quantity} @ ₹{trade.price.toFixed(2)}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-display font-bold text-white text-sm">₹{trade.total.toLocaleString()}</div>
                            <div className="text-gray-600 text-[10px]">{trade.timestamp}</div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ════ LEARN TAB ════ */}
              {activeTab === 'learn' && (
                <motion.div key="learn" initial="hidden" animate="show" exit="hidden" variants={stagger} className="flex flex-col gap-8">
                  {/* Tips — Carousel */}
                  <motion.div variants={fadeUp} className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-gold" />
                        <h2 className="font-display text-lg font-bold text-white">Investment Wisdom</h2>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] p-0.5 rounded-lg">
                        <button
                          onClick={() => setCurrentTipIndex(prev => (prev - 1 + investmentTips.length) % investmentTips.length)}
                          className="p-1.5 rounded-md hover:bg-white/[0.06] text-gray-400 hover:text-white transition-all cursor-pointer"
                          title="Previous Tip"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-[11px] font-bold text-gray-500 min-w-[50px] text-center">
                          {currentTipIndex + 1} / {investmentTips.length}
                        </span>
                        <button
                          onClick={() => setCurrentTipIndex(prev => (prev + 1) % investmentTips.length)}
                          className="p-1.5 rounded-md hover:bg-white/[0.06] text-gray-400 hover:text-white transition-all cursor-pointer"
                          title="Next Tip"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-gold/[0.03] via-white/[0.015] to-transparent border border-white/[0.08] rounded-2xl p-6 md:p-8">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.02] rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row gap-5 items-start">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center font-bold text-gold text-lg flex-shrink-0">
                          {currentTipIndex + 1}
                        </div>
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-gold flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5 text-gold" /> Tip of the Day
                          </div>
                          <h3 className="text-white text-base md:text-lg font-semibold leading-snug">
                            {investmentTips[currentTipIndex].tip}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed pt-2 border-t border-white/[0.05]">
                            {investmentTips[currentTipIndex].insight}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Dictionary */}
                  <motion.div variants={fadeUp} className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-gold" />
                        <h2 className="font-display text-lg font-bold text-white">Financial Dictionary</h2>
                      </div>

                      {/* Search Bar */}
                      <div className="relative w-full md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Search terms..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] focus:border-gold/40 focus:bg-white/[0.05] rounded-xl pl-9 pr-8 py-2 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                        />
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-0.5 rounded-full hover:bg-white/[0.05] cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {Object.keys(termCategories).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-gold text-black shadow-md shadow-gold/10'
                              : 'bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.06]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Terms Grid */}
                    {(() => {
                      const filteredTerms = Object.entries(financialTerms).filter(([term]) => {
                        const matchesSearch = term.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesCategory = selectedCategory === 'All' || termCategories[selectedCategory].includes(term);
                        return matchesSearch && matchesCategory;
                      });

                      if (filteredTerms.length === 0) {
                        return (
                          <div className="bg-white/[0.015] border border-white/[0.06] rounded-2xl text-center py-10 text-gray-500 text-sm">
                            No matching terms found. Try a different search query or category.
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredTerms.map(([term, definition]) => {
                            const isCurrentlyOpen = !!learnOpen[term];
                            const categoryLabel = Object.keys(termCategories).find(
                              cat => cat !== 'All' && termCategories[cat].includes(term)
                            ) || 'Basics';

                            return (
                              <div
                                key={term}
                                className={`group bg-white/[0.02] border rounded-2xl overflow-hidden transition-all duration-300 ${
                                  isCurrentlyOpen
                                    ? 'border-gold/20 shadow-md shadow-gold/[0.02] bg-white/[0.03]'
                                    : 'border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.035]'
                                }`}
                              >
                                <button
                                  onClick={() => setLearnOpen(prev => ({ ...prev, [term]: !prev[term] }))}
                                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                                >
                                  <div className="flex flex-col gap-1">
                                    <span className="font-bold text-sm text-white group-hover:text-gold transition-colors">{term}</span>
                                    <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">{categoryLabel}</span>
                                  </div>
                                  <ChevronDown
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                                      isCurrentlyOpen ? 'rotate-180 text-gold' : 'group-hover:text-white'
                                    }`}
                                  />
                                </button>
                                <AnimatePresence initial={false}>
                                  {isCurrentlyOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-5 pb-4 pt-1.5 border-t border-white/[0.04]">
                                        <p className="text-gray-400 text-[13px] leading-relaxed">{definition}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ═══ STOCK DETAIL DRAWER (slide from right) ═══ */}
      {selectedStock && (() => {
        const stock = stockData[selectedStock];
        const company = companies[selectedStock];
        const holding = holdings[selectedStock] || 0;
        return (
          <div className="fixed inset-0 z-[100]" onClick={closeDrawer}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 h-full w-full sm:w-[480px] bg-[#0d0d0d] border-l border-white/[0.08] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Drawer header */}
              <div className="sticky top-0 bg-[#0d0d0d]/90 backdrop-blur-xl z-10 px-6 py-5 border-b border-white/[0.06] flex items-start justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">{selectedStock}</h2>
                  <p className="text-gray-500 text-xs mt-0.5">{company.name}</p>
                </div>
                <button onClick={closeDrawer} className="text-gray-500 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-6 flex flex-col gap-7">
                {/* Price hero */}
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-bold text-white">₹{stock.currentPrice}</span>
                  <span className={`text-sm font-bold ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </span>
                </div>

                {/* Chart */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={stock.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="date" stroke="#444" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={40} />
                      <YAxis stroke="#444" domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 10 }} width={50} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '10px', fontSize: '12px' }}
                        formatter={(value) => [`₹${value}`, 'Price']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Line type="monotone" dataKey="price" stroke="#FFD700" strokeWidth={2} dot={{ fill: '#FFD700', strokeWidth: 1.5, r: 2.5 }} activeDot={{ r: 4, stroke: '#FFD700', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Company details */}
                <div>
                  <h3 className="text-gold text-[10px] font-bold uppercase tracking-widest mb-3">Company Info</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{company.description}</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      ['Sector', company.sector],
                      ['Market Cap', company.marketCap],
                      ['P/E Ratio', company.pe],
                      ['Your Holdings', `${holding} shares`],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5">
                        <div className="text-gray-500 text-[10px] mb-0.5">{label}</div>
                        <div className="text-white font-semibold text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trade form */}
                <div className="border-t border-white/[0.06] pt-6">
                  <h3 className="text-gold text-[10px] font-bold uppercase tracking-widest mb-3">Trade {selectedStock}</h3>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/30 transition-colors mb-3"
                  />
                  {tradeAmount && (
                    <div className="text-gray-500 text-xs mb-3 text-center">
                      Total: ₹{(tradeAmount * stock.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleTrade(selectedStock, 'buy')}
                      disabled={!tradeAmount || tradeAmount * stock.currentPrice > wallet}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => handleTrade(selectedStock, 'sell')}
                      disabled={!tradeAmount || tradeAmount > holding}
                      className="flex-1 bg-red-500 hover:bg-red-400 text-white px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })()}

      <SiteFooter />
    </div>
  );
};

export default StockSimulator;
