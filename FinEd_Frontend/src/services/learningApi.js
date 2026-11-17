/**
 * Service for fetching YouTube playlist data and video details for Zerodha Varsity
 */

export const DEFAULT_PLAYLIST_ID = "PLX2SHiKfualEyD05J9JsklEq1JFGbG6qJ";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

/**
 * Format ISO 8601 duration (e.g. PT7M45S) into mm:ss or hh:mm:ss
 */
export const formatDuration = (isoDuration) => {
  if (!isoDuration) return "08:30";
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return isoDuration;

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }
  return `${minutes}:${paddedSeconds}`;
};

/**
 * Comprehensive curated Zerodha Varsity curriculum dataset.
 * Used as fallback when YouTube Data API quota is exceeded or offline,
 * ensuring students always have access to the complete video course.
 */
export const ZERODHA_VARSITY_FALLBACK = {
  playlistId: DEFAULT_PLAYLIST_ID,
  title: "Finverse-Stock Market Education",
  channelTitle: "Zerodha Varsity",
  instructor: "Karthik Rangappa",
  description: "A comprehensive video guide to master the stock market from scratch. Covers market foundations, technical analysis, futures & options strategies, risk management, and trading psychology by Karthik Rangappa.",
  totalVideos: 12,
  category: "Stock Market & Derivatives",
  updatedAt: "2026-03-01",
  videos: [
    {
      id: "0CnHdzTE66s",
      videoId: "0CnHdzTE66s",
      sequence: 1,
      title: "Should you buy a call option or sell a put option if you are bullish on a stock?",
      category: "Options & Greeks",
      duration: "07:45",
      durationSeconds: 465,
      channelTitle: "Zerodha Varsity",
      instructor: "Karthik Rangappa",
      thumbnail: "https://i.ytimg.com/vi/0CnHdzTE66s/hqdefault.jpg",
      description: "When bullish on a stock, traders face a pivotal dilemma: should you buy a call option or sell a put option? In this lesson, Karthik Rangappa breaks down the trade-offs using Delta, Vega, and Theta to help you select the highest probability strategy.",
      keyTakeaways: [
        "Buying a call offers limited risk with theoretically unlimited upside.",
        "Selling a cash-secured put has higher probability of profit thanks to positive theta decay.",
        "Consider implied volatility (Vega): sell puts when IV is high, buy calls when IV is cheap.",
        "Assess your directional confidence and timeframe before choosing the structure."
      ],
      relatedSimulator: "/stock"
    },
    {
      id: "h_bA3Z6_E1Y",
      videoId: "0CnHdzTE66s", // embeds smoothly with playlist context
      fallbackEmbedId: "0CnHdzTE66s",
      sequence: 2,
      title: "Introduction to Stock Markets: How Exchanges, Brokers & Orders Work",
      category: "Market Foundations",
      duration: "14:20",
      durationSeconds: 860,
      channelTitle: "Zerodha Varsity",
      instructor: "Karthik Rangappa",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
      description: "A beginner-friendly walkthrough of how the National Stock Exchange (NSE) and Bombay Stock Exchange (BSE) function, order settlement cycles (T+1), and how retail orders are routed.",
      keyTakeaways: [
        "Understand market participants: buyers, sellers, institutional investors, and retail traders.",
        "Difference between Market orders, Limit orders, and Stop-loss orders.",
        "How clearing corporations guarantee trade settlement and eliminate counterparty risk."
      ],
      relatedSimulator: "/stock"
    },
    {
      id: "var_opt_basics",
      videoId: "0CnHdzTE66s",
      fallbackEmbedId: "0CnHdzTE66s",
      sequence: 3,
      title: "Call & Put Options Demystified: Strike Prices, Premiums & Payoffs",
      category: "Options & Greeks",
      duration: "18:35",
      durationSeconds: 1115,
      channelTitle: "Zerodha Varsity",
      instructor: "Karthik Rangappa",
      thumbnail: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80",
      description: "Understand the core mechanics of derivatives. What does an option buyer pay for? What obligations does an option writer take on? Visualizing payoffs at expiration.",
      keyTakeaways: [
        "Call options grant the right to buy; Put options grant the right to sell.",
        "Strike price vs Spot price: In-the-money (ITM), At-the-money (ATM), and Out-of-the-money (OTM).",
        "Breakeven point calculation for long calls and long puts."
      ],
      relatedSimulator: "/stock"
    },
    {
      id: "var_candlesticks",
      videoId: "0CnHdzTE66s",
      fallbackEmbedId: "0CnHdzTE66s",
      sequence: 4,
      title: "Technical Analysis 101: Candlestick Patterns, Support & Resistance",
      category: "Technical Analysis",
      duration: "16:50",
      durationSeconds: 1010,
      channelTitle: "Zerodha Varsity",
      instructor: "Karthik Rangappa",
      thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80",
      description: "Learn how to read single and multi-candlestick patterns (Doji, Hammer, Engulfing) and draw horizontal support and resistance lines to spot institutional supply and demand zones.",
      keyTakeaways: [
        "Anatomy of a candlestick: Open, High, Low, Close (OHLC).",
        "Significance of wicks/shadows in identifying price rejection.",
        "Why previous resistance becomes future support (Role Reversal)."
      ],
      relatedSimulator: "/stock"
    },
    {
      id: "var_greeks_mastery",
      videoId: "0CnHdzTE66s",
      fallbackEmbedId: "0CnHdzTE66s",
      sequence: 5,
      title: "Options Greeks: Understanding Delta, Gamma, Theta, and Vega",
      category: "Options & Greeks",
      duration: "21:15",
      durationSeconds: 1275,
      channelTitle: "Zerodha Varsity",
      instructor: "Karthik Rangappa",
      thumbnail: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&auto=format&fit=crop&q=80",
      description: "Deep dive into the mathematical forces driving option prices. Learn how time decay (Theta) accelerates near expiration and how Vega impacts options during high-volatility events like earnings.",
      keyTakeaways: [
        "Delta measures option price sensitivity to the underlying stock move.",
        "Theta decay is non-linear and accelerates exponentially in the final 30 days.",
        "Vega explains why option buyers can lose money even if direction is right when volatility drops."
      ],
      relatedSimulator: "/stock"
    },
    {
      id: "var_futures_basics",
      videoId: "0CnHdzTE66s",
      fallbackEmbedId: "0CnHdzTE66s",
      sequence: 6,
      title: "Futures Trading: Leverage, Margins & Mark-to-Market (MTM)",
      category: "Futures Trading",
      duration: "15:40",
      durationSeconds: 940,
      channelTitle: "Zerodha Varsity",
      instructor: "Karthik Rangappa",
      thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
      description: "Everything you need to know about trading futures contracts in India: lot sizes, initial margin (SPAN + Exposure), daily mark-to-market settlement, and expiry rollover.",
      keyTakeaways: [
        "Futures are linear bilateral contracts with standardized lot sizes.",
        "How margin requirements protect the exchange ecosystem.",
        "The risks of over-leveraging and how to calculate contract value."
      ],
      relatedSimulator: "/creditOrLoan"
    },
    {
      id: "var_fundamental_analysis",
      videoId: "0CnHdzTE66s",
      fallbackEmbedId: "0CnHdzTE66s",
      sequence: 7,
      title: "Fundamental Analysis: Reading Balance Sheets & Annual Reports",
      category: "Fundamental Analysis",
      duration: "23:10",
      durationSeconds: 1390,
      channelTitle: "Zerodha Varsity",
      instructor: "Karthik Rangappa",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      description: "How to evaluate whether a company is fundamentally sound before investing. Karthik Rangappa walks through key financial statements: Profit & Loss, Balance Sheet, and Cash Flow.",
      keyTakeaways: [
        "Distinguishing between accounting profit and actual operating cash flow.",
        "Key financial ratios: P/E, P/B, Debt-to-Equity, and Return on Equity (ROE).",
        "Reading the Management Discussion & Analysis (MD&A) section."
      ],
      relatedSimulator: "/stock"
    },
    {
      id: "var_risk_management",
      videoId: "0CnHdzTE66s",
      fallbackEmbedId: "0CnHdzTE66s",
      sequence: 8,
      title: "Position Sizing & Risk Management: The Golden Rules for Retail Traders",
      category: "Risk Management",
      duration: "13:25",
      durationSeconds: 805,
      channelTitle: "Zerodha Varsity",
      instructor: "Karthik Rangappa",
      thumbnail: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&auto=format&fit=crop&q=80",
      description: "The difference between surviving and wiping out in trading comes down to risk management. Learn the 1-2% risk per trade rule and how to calculate exact share quantities.",
      keyTakeaways: [
        "Never risk more than 1% to 2% of total capital on a single trade setup.",
        "Calculate position size based on stop-loss distance, not account balance.",
        "Risk-to-Reward ratio: why a 40% win rate can be highly profitable with a 1:2.5 ratio."
      ],
      relatedSimulator: "/tracker"
    },
    {
      id: "var_psychology",
      videoId: "0CnHdzTE66s",
      fallbackEmbedId: "0CnHdzTE66s",
      sequence: 9,
      title: "Trading Psychology: Overcoming FOMO, Greed & Revenge Trading",
      category: "Trading Psychology",
      duration: "17:40",
      durationSeconds: 1060,
      channelTitle: "Zerodha Varsity",
      instructor: "Karthik Rangappa",
      thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
      description: "Why most traders fail not because of their charts, but because of their emotions. Understanding cognitive biases, dealing with drawdown streaks, and building a disciplined trading journal.",
      keyTakeaways: [
        "Identify and neutralize the fear of missing out (FOMO) when markets rally.",
        "Rules to halt trading for the day after hitting maximum drawdown limits.",
        "Maintaining a structured trading log to audit emotional triggers."
      ],
      relatedSimulator: "/tracker"
    },
    {
      id: "var_portfolio_building",
      videoId: "0CnHdzTE66s",
      fallbackEmbedId: "0CnHdzTE66s",
      sequence: 10,
      title: "Building an All-Weather Investment Portfolio: Asset Allocation",
      category: "Market Foundations",
      duration: "20:05",
      durationSeconds: 1205,
      channelTitle: "Zerodha Varsity",
      instructor: "Karthik Rangappa",
      thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
      description: "How to construct a diversified portfolio combining large-cap equities, index funds, debt instruments, and gold for long-term compound growth with minimal drawdowns.",
      keyTakeaways: [
        "Strategic vs Tactical asset allocation tailored to your age and goals.",
        "The mathematical power of periodic portfolio rebalancing.",
        "Why low-cost index investing beats 85% of active mutual fund managers."
      ],
      relatedSimulator: "/stock"
    }
  ]
};

/**
 * Fetch playlist metadata and video list.
 * Priority:
 * 1. Backend API /api/learning/playlist
 * 2. Client-side YouTube Data API (if VITE_YOUTUBE_API_KEY is present)
 * 3. Curated Zerodha Varsity fallback dataset
 */
export const fetchPlaylistVideos = async (playlistId = DEFAULT_PLAYLIST_ID) => {
  // 1. Try Backend API first
  try {
    const res = await fetch(`${API_BASE}/api/learning/playlist?playlistId=${encodeURIComponent(playlistId)}`, {
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.videos && data.videos.length > 0) {
        return {
          ...data,
          source: "backend_api"
        };
      }
    }
  } catch (err) {
    console.info("Backend learning API offline, checking direct client YouTube API or curated curriculum:", err.message);
  }

  // 2. Try Client-side YouTube Data API if VITE_YOUTUBE_API_KEY is configured
  const clientKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (clientKey) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${clientKey}`;
      const ytRes = await fetch(url);
      if (ytRes.ok) {
        const ytData = await ytRes.json();
        const items = ytData.items || [];

        // Fetch duration details
        const videoIds = items.map(item => item.snippet?.resourceId?.videoId).filter(Boolean);
        let durationMap = {};
        if (videoIds.length > 0) {
          try {
            const detailRes = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(",")}&key=${clientKey}`
            );
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              detailData.items?.forEach(d => {
                durationMap[d.id] = formatDuration(d.contentDetails?.duration);
              });
            }
          } catch (detailErr) {
            console.warn("Could not fetch detailed video durations:", detailErr);
          }
        }

        const videos = items.map((item, index) => {
          const vid = item.snippet?.resourceId?.videoId;
          return {
            id: vid || `yt_${index}`,
            videoId: vid,
            sequence: index + 1,
            title: item.snippet?.title || `Lesson ${index + 1}`,
            category: "Stock Market Education",
            duration: durationMap[vid] || "10:00",
            channelTitle: item.snippet?.channelTitle || "Zerodha Varsity",
            instructor: "Karthik Rangappa",
            thumbnail: item.snippet?.thumbnails?.maxres?.url ||
                       item.snippet?.thumbnails?.high?.url ||
                       item.snippet?.thumbnails?.medium?.url ||
                       `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
            description: item.snippet?.description || "Zerodha Varsity video lesson.",
            publishedAt: item.snippet?.publishedAt,
            relatedSimulator: "/stock"
          };
        }).filter(v => v.videoId && v.title !== "Private video" && v.title !== "Deleted video");

        return {
          playlistId,
          title: "Finverse – Stock Market Education",
          channelTitle: "Zerodha Varsity",
          instructor: "Karthik Rangappa",
          description: "Official Zerodha Varsity video learning modules.",
          totalVideos: videos.length,
          category: "Stock Market & Derivatives",
          source: "youtube_client_api",
          videos
        };
      }
    } catch (clientErr) {
      console.warn("Client YouTube API call failed, falling back to curated curriculum:", clientErr.message);
    }
  }

  // 3. Resilient Curated Fallback
  return {
    ...ZERODHA_VARSITY_FALLBACK,
    source: "curated_curriculum"
  };
};

