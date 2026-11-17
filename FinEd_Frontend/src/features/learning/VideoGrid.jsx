import React from 'react';
import { Film, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import VideoCard from './VideoCard';

const SkeletonCard = () => (
  <div className="bg-[#111116] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-video w-full bg-white/5" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-white/10 rounded w-1/4" />
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
      <div className="pt-2 border-t border-white/5 flex justify-between">
        <div className="h-2.5 bg-white/5 rounded w-1/3" />
        <div className="h-2.5 bg-white/5 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const VideoGrid = ({
  videos = [],
  isLoading = false,
  error = null,
  completedIds = [],
  watchedIds = [],
  onSelectVideo,
  onToggleComplete,
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className="space-y-10">
        <div>
          <div className="h-6 bg-white/10 rounded w-48 mb-4 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center my-8">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h3 className="text-white font-sans text-lg font-bold mb-1">Failed to Load Video Lessons</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-5">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center my-8">
        <Film className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <h3 className="text-white font-sans text-lg font-bold mb-1">No Video Lessons Found</h3>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          We couldn't find any lessons matching your search or category filter. Try clearing your filters.
        </p>
      </div>
    );
  }

  // Split into Featured starter lessons (first 3-4 lessons) and full curriculum
  const featuredVideos = videos.slice(0, 3);
  const remainingVideos = videos;

  return (
    <div className="space-y-12">
      {/* "Cours pour commencer" / Start Here: Core Foundations Section (matching screenshot) */}
      {featuredVideos.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide">
                Start Here: Core Foundations
              </h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">Recommended starter path</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredVideos.map((video) => (
              <VideoCard
                key={video.id || video.videoId}
                video={video}
                layout="featured"
                isCompleted={completedIds.includes(video.videoId || video.id)}
                isWatched={watchedIds.includes(video.videoId || video.id)}
                onSelect={onSelectVideo}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </section>
      )}

      {/* "Cours recommandés" / All Course Lessons Grid (matching screenshot) */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <h2 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide">
              All Course Lessons & Modules
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            Showing {remainingVideos.length} lessons
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {remainingVideos.map((video) => (
            <VideoCard
              key={video.id || video.videoId}
              video={video}
              layout="grid"
              isCompleted={completedIds.includes(video.videoId || video.id)}
              isWatched={watchedIds.includes(video.videoId || video.id)}
              onSelect={onSelectVideo}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default VideoGrid;

