import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import Beams from '../../components/Beams';
import PlaylistHeader from './PlaylistHeader';
import VideoGrid from './VideoGrid';
import { fetchPlaylistVideos, DEFAULT_PLAYLIST_ID } from '../../services/learningApi';
import {
  fetchUserProgress,
  toggleVideoCompletion
} from '../../services/learningProgress';

const LearningPage = () => {
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [watchedIds, setWatchedIds] = useState([]);
  const [lastWatchedId, setLastWatchedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPlaylistVideos(DEFAULT_PLAYLIST_ID);
      const progress = await fetchUserProgress(DEFAULT_PLAYLIST_ID);

      setPlaylist(data);
      setCompletedIds(progress.completedIds || []);
      setWatchedIds(progress.watchedIds || []);
      setLastWatchedId(progress.lastWatchedId || null);
    } catch (err) {
      console.error("Error loading learning playlist:", err);
      setError("Unable to load the playlist right now. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute categories dynamically from videos
  const categories = useMemo(() => {
    if (!playlist?.videos) return ['All'];
    const cats = new Set(playlist.videos.map(v => v.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [playlist]);

  // Filtered video list based on search and category
  const filteredVideos = useMemo(() => {
    if (!playlist?.videos) return [];
    return playlist.videos.filter(v => {
      const matchesCategory =
        activeCategory === 'All' || v.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.category && v.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [playlist, activeCategory, searchQuery]);

  const handleSelectVideo = (targetVideoId) => {
    navigate(`/learning/watch/${targetVideoId}`);
  };

  const handleToggleComplete = async (targetVideoId) => {
    const updated = await toggleVideoCompletion(DEFAULT_PLAYLIST_ID, targetVideoId);
    setCompletedIds(updated.completedIds || []);
  };

  const handleResumeLearning = () => {
    const target = lastWatchedId || (playlist?.videos?.[0]?.videoId || playlist?.videos?.[0]?.id);
    if (target) {
      navigate(`/learning/watch/${target}`);
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
        {/* Playlist Header with Progress & Search */}
        <PlaylistHeader
          playlistInfo={playlist}
          completedCount={completedIds.length}
          totalCount={playlist?.videos?.length || 0}
          lastWatchedId={lastWatchedId}
          onResumeLearning={handleResumeLearning}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          categories={categories}
          onSelectCategory={setActiveCategory}
        />

        {/* Video Curriculum Grid */}
        <VideoGrid
          videos={filteredVideos}
          isLoading={isLoading}
          error={error}
          completedIds={completedIds}
          watchedIds={watchedIds}
          onSelectVideo={handleSelectVideo}
          onToggleComplete={handleToggleComplete}
          onRetry={loadData}
        />
      </main>

      <SiteFooter />
    </div>
  );
};

export default LearningPage;

