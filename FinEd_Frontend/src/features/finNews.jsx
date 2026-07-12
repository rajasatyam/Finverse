import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  RefreshCw, 
  ExternalLink, 
  Lightbulb, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Globe, 
  BookOpen, 
  ChevronDown,
  X
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Beams from '../components/Beams';

// Injected styling for highlighted dictionary terms
const financeTermStyle = `
  .finance-term {
    color: #ffd700;
    font-weight: 600;
    cursor: help;
    border-bottom: 1.5px dotted #ffd700;
    transition: all 0.2s ease;
    padding: 0 1px;
    border-radius: 2px;
  }
  .finance-term:hover {
    color: #000000;
    background-color: #ffd700;
    text-shadow: none;
    border-bottom-color: transparent;
  }
`;

const FinNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSentimentMenuOpen, setIsSentimentMenuOpen] = useState(false);
  
  const categoryRef = useRef(null);
  const sentimentRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryMenuOpen(false);
      }
      if (sentimentRef.current && !sentimentRef.current.contains(e.target)) {
        setIsSentimentMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [categories, setCategories] = useState({});
  const [hoveredTerm, setHoveredTerm] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

  // Category mapping fallback
  const fallbackCategories = {
    'all': { name: 'All News' },
    'stocks': { name: 'Stocks' },
    'crypto': { name: 'Crypto' },
    'economy': { name: 'Economy' },
    'personal-finance': { name: 'Personal Finance' }
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data.categories || fallbackCategories))
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setCategories(fallbackCategories);
      });
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: selectedCategory === 'all' ? 'finance' : selectedCategory,
        pageSize: 12,
        category: selectedCategory,
        sentiment_filter: sentimentFilter
      });

      const response = await fetch(`${API_BASE}/api/finnews?${params}`);
      const data = await response.json();

      if (response.ok) {
        setNewsData(data.news || []);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setError(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      setError('Unable to connect to news service');
      console.error('News fetch error:', err);
      
      // Fallback mock news so the screen is never blank if the API is down
      const mockNews = [
        {
          id: 1,
          title: 'RBI Keeps Repo Rate Unchanged at 6.5%, Focuses on Inflation Target',
          summary: 'The Reserve Bank of India (RBI) decided to maintain the policy interest rates unchanged at 6.5% as inflation remains above the target level of 4%. The decision was expected by economists but signals that borrowing costs will remain high in the near term.',
          category: 'economy',
          sentiment: 'neutral',
          source: 'Financial Express',
          timestamp: new Date().toISOString(),
          readTime: '3 min read',
          url: 'https://www.financialexpress.com',
          insight: 'Holding interest rates steady indicates that the central bank is prioritizing long-term stability over short-term growth stimulation, keeping inflation under control.',
          entities: [{ name: 'RBI' }, { name: 'Inflation' }]
        },
        {
          id: 2,
          title: 'IT Stocks Rally on Strong Earnings and Global Cloud Spending Outlook',
          summary: 'Major technology companies like TCS and Infosys led a strong rally in the stock market today after reporting higher than expected quarterly earnings. Analysts suggest that increased global cloud spending and digital transformation trends will drive steady growth.',
          category: 'stocks',
          sentiment: 'positive',
          source: 'Economic Times',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          readTime: '4 min read',
          url: 'https://economictimes.indiatimes.com',
          insight: 'Higher earnings and cloud spending indicate robust demand for digital services, boosting tech stock valuations and supporting positive market sentiment.',
          entities: [{ name: 'TCS' }, { name: 'Infosys' }]
        },
        {
          id: 3,
          title: 'Gold Prices Surge to Record Highs Amid Global Interest Rate Uncertainty',
          summary: 'Gold prices reached a new milestone today, driven by geopolitical tensions and uncertainty surrounding the Federal Reserve interest rates decisions. Investors are shifting capital to safe-haven assets as volatility increases in equity markets.',
          category: 'economy',
          sentiment: 'positive',
          source: 'Bloomberg',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          readTime: '5 min read',
          url: 'https://www.bloomberg.com',
          insight: 'Gold is traditionally viewed as a hedge against inflation and economic instability, attracting capital when other assets experience high volatility.',
          entities: [{ name: 'Gold' }, { name: 'Federal Reserve' }]
        }
      ];
      setNewsData(mockNews);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, sentimentFilter]);

  const fetchDefinition = async (term) => {
    try {
      const response = await fetch(`${API_BASE}/api/dictionary/${encodeURIComponent(term)}`);
      const data = await response.json();
      return data.definition;
    } catch (err) {
      // Local fallback dictionary
      const fallbackDefs = {
        'inflation': 'A general increase in prices and fall in the purchasing value of money.',
        'gdp': 'Gross Domestic Product - the total value of goods produced and services provided in a country during one year.',
        'interest rates': 'The proportion of a loan that is charged as interest to the borrower, typically expressed as an annual percentage.',
        'stock market': 'A market in which shares of publicly held companies are issued and traded.',
        'recession': 'A period of temporary economic decline during which trade and industrial activity are reduced.',
        'bull market': 'A market in which share prices are rising, encouraging buying.',
        'bear market': 'A market in which prices are falling, encouraging selling.',
        'dividend': 'A payment made by corporations to their shareholders, usually as a distribution of profits.',
        'market cap': 'The total value of a company\'s shares, calculated by multiplying share price by outstanding shares.',
        'volatility': 'The degree of variation in a stock\'s price over time.',
        'portfolio': 'A collection of financial investments like stocks, bonds, and cash.',
        'yield': 'The income return on an investment, expressed as a percentage.',
        'earnings': 'A company\'s net profit for a given period.',
        'investment': 'The action or process of investing money for profit.',
        'equity': 'Ownership interest in a corporation, represented by shares of stock.',
        'debt': 'An amount of money owed by one party to another.',
        'credit': 'The ability of a customer to obtain goods or services before payment, based on trust.',
        'banking': 'The business activity of accepting and safeguarding money, and lending it out.'
      };
      return fallbackDefs[term.toLowerCase()] || `${term}: Financial term (definition unavailable)`;
    }
  };

  const handleTermHover = async (e) => {
    const term = e.target.getAttribute('data-term');
    if (term) {
      const definition = await fetchDefinition(term);
      setHoveredTerm({ term, definition });
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleTermLeave = () => {
    setHoveredTerm(null);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (hoveredTerm) {
        setTooltipPosition({ x: e.clientX + 12, y: e.clientY + 12 });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredTerm]);

  const highlightFinanceTerms = (text) => {
    if (!text) return '';

    const financeTerms = [
      'inflation', 'gdp', 'federal reserve', 'interest rates', 'stock market',
      'cryptocurrency', 'bitcoin', 'nasdaq', 'dow jones', 's&p 500',
      'recession', 'bull market', 'bear market', 'dividend', 'market cap',
      'volatility', 'portfolio', 'bonds', 'yield', 'earnings', 'investment',
      'mutual funds', 'sip', 'equity', 'debt', 'credit', 'banking'
    ];

    let highlightedText = text;

    financeTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, (match) =>
        `<span class="finance-term" data-term="${term.toLowerCase()}">${match}</span>`
      );
    });

    return highlightedText;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      case 'negative': return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
      default: return <BarChart3 className="w-3.5 h-3.5 text-gold" />;
    }
  };

  const openArticle = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const sentimentBadgeClasses = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25';
      case 'negative': return 'bg-rose-500/15 text-rose-400 border border-rose-500/25';
      default: return 'bg-white/[0.04] text-gray-300 border border-white/10';
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060606] text-white font-sans">
      <style>{financeTermStyle}</style>
      <SiteHeader />

      {/* Beams background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <Beams
          beamWidth={3.4}
          beamHeight={34}
          beamNumber={18}
          lightColor="#FFD700"
          speed={2.2}
          noiseIntensity={2.4}
          scale={0.18}
          rotation={18}
        />
      </div>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gold/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-gold-dark/[0.03] rounded-full blur-[140px]" />
      </div>

      <main className="relative z-10 pt-28 pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          
          {/* Header section */}
          <div className="mb-10 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
                  Financial News
                </h1>
                <p className="max-w-2xl text-gray-400 text-sm md:text-base leading-relaxed">
                  Real-time financial feeds with integrated AI summaries and an educational dictionary. Hover over highlighted terms to learn key concepts.
                </p>
              </div>
              
              <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md self-center md:self-auto">
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Last Updated</div>
                  <div className="text-xs text-white font-semibold">{lastUpdated || 'Loading...'}</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <button
                  onClick={fetchNews}
                  disabled={loading}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-black transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh news feed"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Controls Bar - Redesigned to side-by-side dropdown selectors */}
          <div className="bg-[#0d0d0d]/90 backdrop-blur-xl border border-white/10 rounded-[24px] px-6 py-4 mb-10 shadow-[0_15px_50px_rgba(0,0,0,0.3)] flex flex-wrap items-center justify-between gap-4 relative z-50">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Dropdown */}
              <div className="relative" ref={categoryRef}>
                <button
                  onClick={() => {
                    setIsCategoryMenuOpen(!isCategoryMenuOpen);
                    setIsSentimentMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] hover:border-gold/30 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>Topic: {selectedCategory === 'all' ? 'All News' : categories[selectedCategory]?.name || selectedCategory}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isCategoryMenuOpen ? 'rotate-180 text-gold' : ''}`} />
                </button>
                
                {isCategoryMenuOpen && (
                  <div className="absolute left-0 mt-2 z-50 bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-2xl min-w-[220px] flex flex-col gap-0.5 animate-[fadeIn_0.15s_ease-out]">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setIsCategoryMenuOpen(false);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition hover:bg-white/[0.05] cursor-pointer ${selectedCategory === 'all' ? 'text-gold bg-gold/10' : 'text-gray-300'}`}
                    >
                      All News
                    </button>
                    {Object.entries(categories).map(([key, category]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedCategory(key);
                          setIsCategoryMenuOpen(false);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition hover:bg-white/[0.05] cursor-pointer ${selectedCategory === key ? 'text-gold bg-gold/10' : 'text-gray-300'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sentiment Dropdown */}
              <div className="relative" ref={sentimentRef}>
                <button
                  onClick={() => {
                    setIsSentimentMenuOpen(!isSentimentMenuOpen);
                    setIsCategoryMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] hover:border-gold/30 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4 text-gold" />
                  <span>Sentiment: {
                    sentimentFilter === 'all' ? 'All Sentiment' :
                    sentimentFilter === 'positive' ? 'Positive' :
                    sentimentFilter === 'negative' ? 'Negative' : 'Neutral'
                  }</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isSentimentMenuOpen ? 'rotate-180 text-gold' : ''}`} />
                </button>

                {isSentimentMenuOpen && (
                  <div className="absolute left-0 mt-2 z-50 bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-2xl min-w-[200px] flex flex-col gap-0.5 animate-[fadeIn_0.15s_ease-out]">
                    {['all', 'positive', 'negative', 'neutral'].map(sentiment => (
                      <button
                        key={sentiment}
                        onClick={() => {
                          setSentimentFilter(sentiment);
                          setIsSentimentMenuOpen(false);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition hover:bg-white/[0.05] cursor-pointer flex items-center gap-1.5 ${
                          sentimentFilter === sentiment ? 'text-gold bg-gold/10' : 'text-gray-300'
                        }`}
                      >
                        {sentiment === 'all' && 'All Sentiment'}
                        {sentiment === 'positive' && (
                          <>
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Positive</span>
                          </>
                        )}
                        {sentiment === 'negative' && (
                          <>
                            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                            <span>Negative</span>
                          </>
                        )}
                        {sentiment === 'neutral' && (
                          <>
                            <BarChart3 className="w-3.5 h-3.5 text-gold" />
                            <span>Neutral</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Total count indicator */}
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 hidden sm:inline">
              {newsData.length} articles found
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center mb-10 max-w-xl mx-auto">
              <div className="flex justify-center mb-2">
                <AlertTriangle className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="font-bold text-base mb-1">Could not load live news</h3>
              <p className="text-xs text-gray-400 mb-4">{error}</p>
              <button 
                onClick={fetchNews} 
                className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-400 transition cursor-pointer"
              >
                Reconnect Feed
              </button>
            </div>
          )}

          {/* Loader */}
          {loading && newsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-gold animate-spin mb-4" />
              <p className="text-sm">Connecting to global financial feed...</p>
            </div>
          ) : (
            /* News Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {newsData.map(news => (
                <article
                  key={news.id}
                  onClick={() => openArticle(news.url)}
                  className="group bg-white/[0.02] border border-white/[0.08] hover:border-gold/30 rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(255,215,0,0.04)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {news.image && (
                      <div className="w-full h-[180px] overflow-hidden relative">
                        <img 
                          src={news.image} 
                          alt={news.title} 
                          loading="lazy" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/90 via-[#0f0f0f]/20 to-transparent" />
                      </div>
                    )}

                    <div className="p-6 pb-0">
                      <div className="flex justify-between items-center gap-2 mb-4">
                        <span className="bg-gold/10 border border-gold/25 text-gold px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {news.category}
                        </span>
                        {news.sentiment && (
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 uppercase ${sentimentBadgeClasses(news.sentiment)}`}>
                            {getSentimentIcon(news.sentiment)}
                            {news.sentiment}
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors duration-200 leading-snug">
                        {news.title}
                      </h2>

                      {/* Summary with dictionary triggers */}
                      <div
                        onMouseOver={handleTermHover}
                        onMouseLeave={handleTermLeave}
                        className="text-gray-400 text-sm leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: highlightFinanceTerms(news.summary) }}
                      />

                      {/* AI Insights Block */}
                      {news.insight && (
                        <div className="bg-gold/[0.03] border-l-2 border-gold p-4 mb-4 rounded-r-xl space-y-1">
                          <div className="text-gold text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5" /> AI Analysis
                          </div>
                          <p className="text-gray-300 text-xs leading-relaxed font-medium">{news.insight}</p>
                        </div>
                      )}

                      {/* Entity tags */}
                      {news.entities && news.entities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {news.entities.slice(0, 3).map((entity, idx) => (
                            <span key={idx} className="bg-white/[0.04] text-gray-300 px-2 py-0.5 rounded text-[10px] font-medium border border-white/[0.05]">
                              #{entity.name || entity.symbol}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0">
                    <div className="w-full h-px bg-white/[0.05] mb-4" />
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-gray-500" />
                        <span className="font-semibold text-gray-400 text-xs truncate max-w-[120px]">{news.source}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatTimestamp(news.timestamp)}
                        </span>
                        {news.readTime && (
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {news.readTime}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/10 hover:border-gold hover:bg-gold hover:text-black font-semibold text-xs transition-all duration-300 cursor-pointer"
                    >
                      Read Full Article
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty state */}
          {newsData.length === 0 && !loading && (
            <div className="text-center py-16 px-5 text-gray-500 max-w-md mx-auto">
              <p className="text-base mb-5">No news articles found matching the current filters.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSentimentFilter('all'); }}
                className="bg-gold text-black px-6 py-3 rounded-xl text-xs font-bold hover:bg-yellow-300 transition cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Glossary Tooltip */}
      {hoveredTerm && (
        <div
          className="fixed bg-[#0c0c0c]/95 backdrop-blur-md text-gold p-4 rounded-2xl text-xs max-w-[280px] z-[1000] shadow-[0_10px_45px_rgba(0,0,0,0.6),0_0_20px_rgba(255,215,0,0.05)] pointer-events-none border border-gold/25"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
        >
          <div className="flex items-center gap-1.5 mb-1 text-gold font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            {hoveredTerm.term}
          </div>
          <p className="m-0 leading-relaxed text-gray-300 font-medium">{hoveredTerm.definition}</p>
        </div>
      )}

      <SiteFooter />
    </div>
  );
};

export default FinNews;
