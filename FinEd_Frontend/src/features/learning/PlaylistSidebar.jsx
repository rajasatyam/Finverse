import React, { useState } from 'react';
import { Play, Check, Clock, Search, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import LearningProgress from './LearningProgress';

const PlaylistSidebar = ({
  videos = [],
  currentVideoId,
  completedIds = [],
  onSelectVideo,
  onToggleComplete,
  className = ""
}) => {
  const [search, setSearch] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const completedCount = completedIds.length;
  const totalCount = videos.length;

  const filteredVideos = search.trim()
    ? videos.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        (v.category && v.category.toLowerCase().includes(search.toLowerCase()))
      )
    : videos;

  return (
    <aside className={`bg-[#0f0f16] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${className}`}>
      {/* Sidebar Header: Course Progress (matching screenshot) */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] uppercase font-bold tracking-widest text-gray-400 font-mono">
              Course Progression
            </div>
            <div className="text-sm font-bold text-white mt-0.5 font-sans">
              Zerodha Varsity Curriculum
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Minimal progress bar with gold/red accent */}
        <LearningProgress
          completedCount={completedCount}
          totalCount={totalCount}
          variant="compact"
        />

        {/* In-sidebar Search */}
        {!isCollapsed && (
          <div className="relative mt-3.5">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter playlist lessons..."
              className="w-full pl-8 pr-3 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/40 font-sans"
            />
          </div>
        )}
      </div>

      {/* Video Playlist Items */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] p-2 sm:p-3 space-y-1.5 divide-y divide-white/[0.03]">
          {filteredVideos.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              No lessons match "{search}"
            </div>
          ) : (
            filteredVideos.map((video, index) => {
              const targetId = video.videoId || video.id;
              const isCurrent = targetId === currentVideoId;
              const isCompleted = completedIds.includes(targetId);

              return (
                <div
                  key={targetId}
                  onClick={() => onSelectVideo(targetId)}
                  className={`group relative flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-gold/10 border border-gold/40 shadow-[0_4px_20px_rgba(255,215,0,0.15)]'
                      : 'hover:bg-white/[0.04] border border-transparent hover:border-white/5'
                  }`}
                >
                  {/* Completion Checkbox (interactive) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(targetId);
                    }}
                    title={isCompleted ? "Mark uncompleted" : "Mark completed"}
                    className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'border-white/20 bg-black/40 hover:border-gold/50 text-transparent'
                    }`}
                  >
                    <Check className={`w-3 h-3 stroke-[3] ${isCompleted ? 'text-black' : ''}`} />
                  </button>

                  {/* Thumbnail with duration badge */}
                  <div className="relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden bg-black/60 flex-shrink-0 border border-white/5">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {video.duration && (
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/85 text-[9px] font-mono text-gray-200">
                        {video.duration}
                      </span>
                    )}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-gold/25 flex items-center justify-center backdrop-blur-[0.5px]">
                        <div className="w-5 h-5 rounded-full bg-gold text-black flex items-center justify-center shadow-md">
                          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title and metadata */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono mb-0.5">
                      <span className={isCurrent ? 'text-gold font-bold' : ''}>
                        #{video.sequence || index + 1}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-gold/20 text-gold font-bold">
                          Now Playing
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-xs font-medium line-clamp-2 leading-snug transition-colors ${
                        isCurrent
                          ? 'text-gold font-semibold'
                          : 'text-gray-200 group-hover:text-white'
                      }`}
                    >
                      {video.title}
                    </h4>

                    {video.category && (
                      <span className="text-[10px] text-gray-500 font-mono block mt-1 truncate">
                        {video.category}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </aside>
  );
};

export default PlaylistSidebar;

