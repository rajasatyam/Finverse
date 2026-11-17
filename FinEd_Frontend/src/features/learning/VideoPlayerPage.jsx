import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Check,
  Share2,
  ExternalLink,
  BookOpen,
  TrendingUp,
  Award,
  Sparkles,
  Info,
  Clock,
  Layers
} from 'lucide-react';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import Beams from '../../components/Beams';
import PlaylistSidebar from './PlaylistSidebar';
import { fetchPlaylistVideos, DEFAULT_PLAYLIST_ID } from '../../services/learningApi';
import {
  fetchUserProgress,
  toggleVideoCompletion,
  markVideoWatched
} from '../../services/learningProgress';

const VideoPlayerPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [watchedIds, setWatchedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'takeaways' | 'simulators'
  const [copiedLink, setCopiedLink] = useState(false);

  // Load playlist and user progress
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPlaylistVideos(DEFAULT_PLAYLIST_ID);
        const progress = await fetchUserProgress(DEFAULT_PLAYLIST_ID);

        if (!isMounted) return;

        setPlaylist(data);
        setCompletedIds(progress.completedIds || []);
        setWatchedIds(progress.watchedIds || []);

        // Determine which video to show:
        // 1. URL param videoId
        // 2. Last watched video
        // 3. First video in playlist
        const videos = data.videos || [];
        let target = null;
        if (videoId) {
          target = videos.find(v => (v.videoId || v.id) === videoId);
        }
        if (!target && progress.lastWatchedId) {
          target = videos.find(v => (v.videoId || v.id) === progress.lastWatchedId);
        }
        if (!target && videos.length > 0) {
          target = videos[0];
        }

        if (target) {
          setActiveVideo(target);
          const tid = target.videoId || target.id;
          markVideoWatched(DEFAULT_PLAYLIST_ID, tid);
        }
      } catch (err) {
        console.error("Failed to load video player data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [videoId]);

  const handleSelectVideo = (newVideoId) => {
    navigate(`/learning/watch/${newVideoId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleComplete = async (targetId) => {
    const updated = await toggleVideoCompletion(DEFAULT_PLAYLIST_ID, targetId);
    setCompletedIds(updated.completedIds || []);
  };

  const currentId = activeVideo?.videoId || activeVideo?.id;
  const isCurrentCompleted = currentId ? completedIds.includes(currentId) : false;

  // Previous and Next navigation
  const videos = playlist?.videos || [];
  const currentIndex = videos.findIndex(v => (v.videoId || v.id) === currentId);
  const prevVideo = currentIndex > 0 ? videos[currentIndex - 1] : null;
  const nextVideo = currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070c] text-white flex flex-col font-sans relative selection:bg-gold/30 selection:text-gold">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none">
        <Beams
          beamWidth={3}
          beamHeight={30}
          beamNumber={18}
          lightColor="#ffd700"
          speed={2}
          noiseIntensity={2.5}
          scale={0.18}
        />
      </div>

      <SiteHeader />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 pt-24 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-mono">
          <Link to="/learning" className="hover:text-gold transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Learning Dashboard</span>
          </Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-xs sm:max-w-md">
            {playlist?.title || "Zerodha Varsity"}
          </span>
          {activeVideo && (
            <>
              <span>/</span>
              <span className="text-gold truncate max-w-[200px]">
                Lesson {activeVideo.sequence || currentIndex + 1}
              </span>
            </>
          )}
        </div>

        {/* 2-Column Responsive Layout: Player on Left, Playlist Sidebar on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Column: Video Player & Details */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* 16:9 Responsive Video Player */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black/90 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
              {activeVideo ? (
                <iframe
                  key={currentId}
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId || activeVideo.id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&list=${DEFAULT_PLAYLIST_ID}`}
                  title={activeVideo.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="w-8 h-8 border-2 border-gold/40 border-t-gold rounded-full animate-spin mb-3" />
                  <span className="text-sm font-mono">Loading Zerodha Varsity Player...</span>
                </div>
              )}
            </div>

            {/* Video Action Bar & Metadata */}
            {activeVideo && (
              <div className="bg-[#0f0f16] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                {/* Category & Lesson tags */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-mono font-bold uppercase">
                      Lesson {activeVideo.sequence || currentIndex + 1} of {videos.length}
                    </span>
                    {activeVideo.category && (
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono">
                        {activeVideo.category}
                      </span>
                    )}
                  </div>

                  {activeVideo.duration && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      <span>{activeVideo.duration}</span>
                    </div>
                  )}
                </div>

                {/* Video Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight mb-4 leading-tight">
                  {activeVideo.title}
                </h1>

                {/* Channel & Controls Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                  {/* Channel / Instructor Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold/20 to-amber-500/10 border border-gold/30 flex items-center justify-center text-gold font-bold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                        <span>{activeVideo.channelTitle || "Zerodha Varsity"}</span>
                        <Sparkles className="w-3.5 h-3.5 text-gold fill-current" />
                      </div>
                      <div className="text-xs text-gray-400 font-sans">
                        Instructor: <span className="text-gray-200">{activeVideo.instructor || "Karthik Rangappa"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Mark Complete, Share, YouTube */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Mark Complete Button */}
                    <button
                      onClick={() => handleToggleComplete(currentId)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                        isCurrentCompleted
                          ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'bg-white/5 hover:bg-white/10 border border-white/15 text-white'
                      }`}
                    >
                      {isCurrentCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                          <span>Mark as Completed</span>
                        </>
                      )}
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      title="Share Lesson Link"
                      className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* External Link */}
                    <a
                      href={`https://www.youtube.com/watch?v=${activeVideo.videoId || activeVideo.id}&list=${DEFAULT_PLAYLIST_ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Watch on YouTube"
                      className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Copied toast indicator */}
                {copiedLink && (
                  <div className="mt-3 text-xs text-gold font-mono text-right animate-pulse">
                    ✓ Link copied to clipboard!
                  </div>
                )}

                {/* Prev & Next Navigation Strip */}
                <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-white/10">
                  {prevVideo ? (
                    <button
                      onClick={() => handleSelectVideo(prevVideo.videoId || prevVideo.id)}
                      className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-gray-300 hover:text-gold transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-gold" />
                      <div className="text-left hidden sm:block">
                        <div className="text-[10px] text-gray-500 uppercase">Previous Lesson</div>
                        <div className="text-xs truncate max-w-[180px] text-white">{prevVideo.title}</div>
                      </div>
                      <span className="sm:hidden">Previous</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {nextVideo ? (
                    <button
                      onClick={() => handleSelectVideo(nextVideo.videoId || nextVideo.id)}
                      className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-gray-300 hover:text-gold transition-colors cursor-pointer text-right ml-auto"
                    >
                      <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-gray-500 uppercase">Next Lesson</div>
                        <div className="text-xs truncate max-w-[180px] text-white">{nextVideo.title}</div>
                      </div>
                      <span className="sm:hidden">Next</span>
                      <ChevronRight className="w-4 h-4 text-gold" />
                    </button>
                  ) : (
                    <div className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Final Lesson Reached!</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description, Takeaways & Related Simulators Tabs */}
            {activeVideo && (
              <div className="bg-[#0f0f16] border border-white/10 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                {/* Tab Navigation */}
                <div className="flex border-b border-white/10 bg-white/[0.02]">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-3.5 px-4 text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer text-center border-b-2 ${
                      activeTab === 'overview'
                        ? 'border-gold text-gold bg-gold/5'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    Lesson Overview
                  </button>

                  <button
                    onClick={() => setActiveTab('takeaways')}
                    className={`flex-1 py-3.5 px-4 text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer text-center border-b-2 ${
                      activeTab === 'takeaways'
                        ? 'border-gold text-gold bg-gold/5'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    Key Concepts
                  </button>

                  <button
                    onClick={() => setActiveTab('simulators')}
                    className={`flex-1 py-3.5 px-4 text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer text-center border-b-2 ${
                      activeTab === 'simulators'
                        ? 'border-gold text-gold bg-gold/5'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    Apply in Simulators
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {activeVideo.description || "In this Zerodha Varsity educational lesson, Karthik Rangappa simplifies complex market concepts into actionable knowledge for young adults and aspiring investors."}
                      </p>

                      <div className="pt-4 border-t border-white/5 flex flex-wrap gap-4 text-xs text-gray-400 font-mono">
                        <div>
                          <span className="text-gray-500 block">Category:</span>
                          <span className="text-white font-semibold">{activeVideo.category || "Stock Market"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Curriculum:</span>
                          <span className="text-white font-semibold">Zerodha Varsity Video Series</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Host:</span>
                          <span className="text-gold font-semibold">Karthik Rangappa</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'takeaways' && (
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-bold tracking-widest text-gold font-mono mb-2">
                        Core Principles from this Video:
                      </h4>
                      {(activeVideo.keyTakeaways || [
                        "Always align strategy with your volatility and market direction expectations.",
                        "Understand that options involve asymmetric risk profiles between buyers and sellers.",
                        "Keep position sizes bounded to protect your portfolio from drawdown streaks."
                      ]).map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'simulators' && (
                    <div className="space-y-4">
                      <p className="text-gray-400 text-xs leading-relaxed">
                        Put the concepts learned in this Zerodha Varsity lesson into risk-free practice using FinEd's interactive tools:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <Link
                          to="/stock"
                          className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] hover:bg-gold/10 border border-white/10 hover:border-gold/40 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-gold transition-colors font-sans">
                              Stock Simulator
                            </div>
                            <div className="text-[11px] text-gray-400">
                              Practice trading & order execution
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/tracker"
                          className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] hover:bg-gold/10 border border-white/10 hover:border-gold/40 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-gold transition-colors font-sans">
                              Budget & Expense Tracker
                            </div>
                            <div className="text-[11px] text-gray-400">
                              Track personal capital allocation
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Playlist Sidebar (matching screenshot) */}
          <div className="lg:col-span-4 sticky top-24">
            <PlaylistSidebar
              videos={videos}
              currentVideoId={currentId}
              completedIds={completedIds}
              onSelectVideo={handleSelectVideo}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default VideoPlayerPage;

