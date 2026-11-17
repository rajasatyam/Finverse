import React from 'react';
import { Play, BookOpen, Video, Award, Search, Sparkles } from 'lucide-react';
import LearningProgress from './LearningProgress';

const PlaylistHeader = ({
  playlistInfo,
  completedCount = 0,
  totalCount = 0,
  lastWatchedId,
  onResumeLearning,
  searchQuery = '',
  onSearchChange,
  activeCategory = 'All',
  categories = [],
  onSelectCategory
}) => {
  const {
    title = "Zerodha Varsity – Stock Market Education",
    instructor = "Karthik Rangappa",
    channelTitle = "Zerodha Varsity",
    description = "Master stock markets, options strategies, technical analysis, and risk management with the premier financial curriculum."
  } = playlistInfo || {};

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181822] to-[#0c0c12] border border-white/10 p-6 sm:p-8 md:p-10 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left: Info & Badges */}
        <div className="flex-1 max-w-3xl">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Playlist
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono">
              <Video className="w-3.5 h-3.5 text-gold" />
              {totalCount} Video Lessons
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono">
              <BookOpen className="w-3.5 h-3.5 text-gold" />
              Comprehensive Curriculum
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-sans tracking-tight mb-3">
            {title}
          </h1>

          {/* Subtitle / Instructor */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 font-sans">
            <span>Official Curriculum by</span>
            <span className="text-gold font-semibold">{channelTitle}</span>
            <span>•</span>
            <span className="text-white font-medium">Instructor: {instructor}</span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl mb-6">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={onResumeLearning}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-gold via-amber-400 to-gold-dark text-black font-sans font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(255,215,0,0.35)] hover:shadow-[0_0_35px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{lastWatchedId ? "Resume Learning" : "Start First Lesson"}</span>
            </button>

            <a
              href="https://zerodha.com/varsity/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 text-sm font-sans font-semibold transition-colors"
            >
              <Award className="w-4 h-4 text-gold" />
              <span>Varsity Web Notes</span>
            </a>
          </div>
        </div>

        {/* Right: Progress Card Widget */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <LearningProgress
            completedCount={completedCount}
            totalCount={totalCount}
            variant="full"
          />
        </div>
      </div>

      {/* Bottom Controls: Search & Category Filter Pills */}
      <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Zerodha lessons..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;

