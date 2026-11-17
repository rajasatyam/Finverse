import React from 'react';
import { Play, CheckCircle2, Clock, Check } from 'lucide-react';

const VideoCard = ({
  video,
  isCompleted = false,
  isWatched = false,
  isPlaying = false,
  onSelect,
  onToggleComplete,
  layout = "grid" // "grid" | "featured" | "compact"
}) => {
  const {
    id,
    videoId,
    sequence,
    title,
    duration,
    thumbnail,
    instructor = "Karthik Rangappa",
    channelTitle = "Zerodha Varsity",
    category
  } = video;

  const targetId = videoId || id;

  if (layout === "featured") {
    return (
      <div
        onClick={() => onSelect && onSelect(targetId)}
        className="group relative flex flex-col bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-gold/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-black/60">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Sequence badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 border border-white/15 text-[11px] font-mono font-bold text-white backdrop-blur-md">
            #{sequence < 10 ? `0${sequence}` : sequence}
          </div>

          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/85 text-[11px] font-mono font-semibold text-gray-200 border border-white/10 flex items-center gap-1">
              <Clock className="w-3 h-3 text-gold" />
              <span>{duration}</span>
            </div>
          )}

          {/* Completed badge */}
          {isCompleted && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-emerald-500/90 text-black text-[10px] font-bold font-mono flex items-center gap-1 shadow-lg">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>COMPLETED</span>
            </div>
          )}

          {/* Play Icon Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/35 backdrop-blur-[1px]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark text-black flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.6)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            {category && (
              <span className="inline-block text-[10px] font-mono font-bold tracking-wider uppercase text-gold/80 mb-1.5">
                {category}
              </span>
            )}
            <h4 className="text-white font-sans text-sm font-semibold line-clamp-2 group-hover:text-gold transition-colors leading-snug mb-2">
              {title}
            </h4>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-gray-400">
            <span>{channelTitle}</span>
            <span className="text-gold font-medium">{instructor}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect && onSelect(targetId)}
      className={`group relative flex flex-col bg-[#111116] border ${
        isPlaying
          ? 'border-gold shadow-[0_0_20px_rgba(255,215,0,0.25)]'
          : 'border-white/10 hover:border-gold/35'
      } rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)]`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/60">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Sequence tag */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 border border-white/10 text-[10px] font-mono font-bold text-white/90 backdrop-blur-md">
          Lesson {sequence < 10 ? `0${sequence}` : sequence}
        </div>

        {/* Completion status toggle/indicator */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {onToggleComplete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(targetId);
              }}
              title={isCompleted ? "Mark as uncompleted" : "Mark as completed"}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'bg-black/70 text-gray-400 hover:text-white hover:bg-black/90 border border-white/10'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/90 text-[10px] font-mono font-bold text-gray-200 border border-white/10 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-gold" />
            <span>{duration}</span>
          </div>
        )}

        {/* Play Icon Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[1px]">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-gold-dark text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Active playing indicator */}
        {isPlaying && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-gold text-black text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
            <span>PLAYING</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {category && (
            <span className="inline-block text-[10px] font-mono font-bold tracking-wider uppercase text-gold/80 mb-1">
              {category}
            </span>
          )}
          <h3 className="text-white font-sans text-sm font-semibold line-clamp-2 group-hover:text-gold transition-colors leading-snug">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[11px] text-gray-400">
          <span className="truncate max-w-[140px]">{channelTitle}</span>
          <span className="text-gray-300 font-medium font-sans">{instructor}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

