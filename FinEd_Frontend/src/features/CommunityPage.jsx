import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  BookOpen, 
  Clock, 
  Heart, 
  Plus, 
  Send, 
  Bell, 
  Search, 
  Lock, 
  ArrowLeft,
  Eye,
  ThumbsUp,
  X,
  AlertCircle
} from 'lucide-react';
import { db, auth } from "../firebase.js";
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment, arrayUnion } from "firebase/firestore";
import { fetchPosts } from '../FetchPosts.js';
import { onAuthStateChanged } from "firebase/auth";
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Beams from '../components/Beams';

const categories = ["All", "General", "Investing", "Budgeting", "Debt Management", "Income", "Crypto", "Emergency Planning"];

const CommunityPage = () => {
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState(new Set([1, 3]));
  const [notifications, setNotifications] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [forumTopics, setForumTopics] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch posts from Firestore
  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts();
      setForumTopics(data || []);
      
      // If we already have a selected topic, refresh its data from the loaded list
      if (selectedTopic) {
        const updated = data.find(t => t.id === selectedTopic.id);
        if (updated) setSelectedTopic(updated);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Helper & Actions
  const showNotification = (message) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }]);
  };

  const requireAuth = (action) => {
    if (!user) {
      navigate('/login');
      return;
    }
    action();
  };

  const handleLikePost = async (postId) => {
    const newLiked = new Set(likedPosts);
    const docRef = doc(db, "posts", postId.toString());
    
    try {
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
        await updateDoc(docRef, {
          likes: increment(-1)
        });
        setForumTopics(prev => prev.map(topic => 
          topic.id === postId ? { ...topic, likes: Math.max(0, (topic.likes || 0) - 1) } : topic
        ));
        if (selectedTopic && selectedTopic.id === postId) {
          setSelectedTopic(prev => ({ ...prev, likes: Math.max(0, (prev.likes || 0) - 1) }));
        }
      } else {
        newLiked.add(postId);
        await updateDoc(docRef, {
          likes: increment(1)
        });
        setForumTopics(prev => prev.map(topic => 
          topic.id === postId ? { ...topic, likes: (topic.likes || 0) + 1 } : topic
        ));
        if (selectedTopic && selectedTopic.id === postId) {
          setSelectedTopic(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
        }
        showNotification("Post liked!");
      }
      setLikedPosts(newLiked);
    } catch (e) {
      console.error("Failed to update likes in DB:", e);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert("Please fill out both the title and content.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: newPost.title,
        author: user.displayName || "Anonymous User",
        replies: 0,
        views: 1,
        lastActivity: new Date().toLocaleDateString(),
        category: newPost.category,
        isHot: false,
        avatar: "🆕",
        likes: 0,
        content: newPost.content,
        createdAt: serverTimestamp(),
        repliesData: []
      });

      const newTopic = {
        id: docRef.id,
        title: newPost.title,
        author: user.displayName || "Anonymous User",
        replies: 0,
        views: 1,
        lastActivity: new Date().toLocaleDateString(),
        category: newPost.category,
        isHot: false,
        avatar: "🆕",
        likes: 0,
        content: newPost.content,
        repliesData: []
      };

      setForumTopics(prev => [newTopic, ...prev]);
      showNotification("Post created successfully!");
      setNewPost({ title: '', content: '', category: 'General' });
      setShowNewPostModal(false);
    } catch (e) {
      console.error("Error creating post:", e);
    }
  };

  const handleReply = async (topicId) => {
    if (!newReply.trim()) return;

    const newReplyData = {
      id: Date.now(),
      author: user.displayName || "Anonymous User",
      content: newReply,
      timestamp: new Date().toISOString(),
      likes: 0,
      avatar: "🌟"
    };

    try {
      const docRef = doc(db, "posts", topicId.toString());
      await updateDoc(docRef, {
        repliesData: arrayUnion(newReplyData),
        replies: increment(1),
        createdAt: serverTimestamp(),
      });

      // Reload posts to sync with database
      loadPosts();
      showNotification("Reply posted!");
      setNewReply('');
    } catch (e) {
      console.error("Error replying to post:", e);
    }
  };

  const handleLikeReply = async (topicId, replyId) => {
    try {
      const topicToUpdate = forumTopics.find(t => t.id === topicId);
      if (!topicToUpdate) return;

      const updatedReplies = (topicToUpdate.repliesData || []).map(reply => 
        reply.id === replyId ? { ...reply, likes: (reply.likes || 0) + 1 } : reply
      );

      const docRef = doc(db, "posts", topicId.toString());
      await updateDoc(docRef, {
        repliesData: updatedReplies
      });

      setForumTopics(prev => prev.map(topic => 
        topic.id === topicId ? { ...topic, repliesData: updatedReplies } : topic
      ));

      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic(prev => ({ ...prev, repliesData: updatedReplies }));
      }

      showNotification("Liked reply!");
    } catch (e) {
      console.error("Failed to like reply in DB:", e);
    }
  };

  const openTopicDetail = async (topic) => {
    setSelectedTopic(topic);
    try {
      const docRef = doc(db, "posts", topic.id.toString());
      await updateDoc(docRef, {
        views: increment(1)
      });
      setForumTopics(prev => prev.map(t => 
        t.id === topic.id ? { ...t, views: (t.views || 0) + 1 } : t
      ));
      setSelectedTopic(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : null);
    } catch (e) {
      console.error("Failed to update views in DB:", e);
    }
  };

  // Notification Timer
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  function timeAgo(dateString) {
    if (!dateString) return "just now";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "recently";
    
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? "1y ago" : `${interval}y ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? "1mo ago" : `${interval}mo ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? "1d ago" : `${interval}d ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? "1h ago" : `${interval}h ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? "1m ago" : `${interval}m ago`;
    
    return "just now";
  }

  // Search & Category Filters
  const filteredForumTopics = forumTopics.filter(topic => {
    const matchesSearch = searchQuery 
      ? topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.author.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = selectedCategory === 'All'
      ? true
      : topic.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060606] text-white font-sans">
      <SiteHeader />

      {/* Beams Background */}
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

      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gold/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-gold-dark/[0.03] rounded-full blur-[140px]" />
      </div>

      {/* Toast Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-24 right-5 z-[2000] flex flex-col gap-3">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className="flex items-center gap-2.5 bg-black/90 text-gold px-5 py-3 rounded-xl border border-gold shadow-[0_8px_30px_rgba(0,0,0,0.8)] animate-[slideIn_0.3s_ease-out] max-w-xs text-xs font-semibold"
            >
              <Bell className="w-4 h-4 text-gold flex-shrink-0" />
              <span>{notification.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Guest Banner */}
      {!user && (
        <div className="sticky top-16 md:top-20 z-40 bg-gold text-black font-semibold text-xs py-2 px-5 text-center flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          <span>You are browsing as guest. Log in to see authors, post new discussions, and leave replies.</span>
        </div>
      )}

      <main className="relative z-10 pt-28 pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          
          {/* Header section - Clean, professional, borderless heading */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3">
              Collaborative Forums
            </h1>
            <p className="max-w-2xl text-gray-400 text-sm md:text-base leading-relaxed">
              Compare notes from the simulators, share investment strategies, and build financial concepts with fellow learners.
            </p>
          </div>

          {/* Premium Split Panel Layout utilizing left-right space properly */}
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0 bg-[#0d0d0d]/80 border border-white/10 rounded-[28px] overflow-hidden min-h-[680px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl relative z-20">
            
            {/* Left Column: Search, category filters, and discussions list */}
            <div className={`border-r border-white/10 flex flex-col h-[700px] bg-black/10 ${selectedTopic ? 'hidden lg:flex' : 'flex'}`}>
              
              {/* Toolbar header */}
              <div className="p-4 border-b border-white/[0.08] space-y-3.5 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] focus:border-gold/40 focus:bg-white/[0.05] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={() => requireAuth(() => setShowNewPostModal(true))}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-300 text-black hover:brightness-110 shadow-md shadow-gold/5 cursor-pointer flex-shrink-0 h-9 w-9"
                    title="Start Discussion"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Categories Tab selector bar */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                        selectedCategory === cat
                          ? "bg-gold text-black border-transparent shadow-md shadow-gold/5"
                          : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discussions List */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/[0.05] scrollbar-thin">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <div className="w-6 h-6 border-2 border-white/10 border-t-gold rounded-full animate-spin mb-3" />
                    <span className="text-xs">Loading discussions...</span>
                  </div>
                ) : filteredForumTopics.length > 0 ? (
                  filteredForumTopics.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => openTopicDetail(topic)}
                      className={`p-4 transition-all duration-200 cursor-pointer text-left ${
                        selectedTopic?.id === topic.id 
                          ? "bg-white/[0.04] border-l-2 border-gold" 
                          : "hover:bg-white/[0.015]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="bg-white/[0.05] border border-white/10 text-gray-400 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                          {topic.category}
                        </span>
                        <span className="text-[10px] text-gray-500">{timeAgo(topic.lastActivity || topic.createdAt)}</span>
                      </div>
                      <h4 className="text-white font-semibold text-sm truncate transition-colors mb-1 group-hover:text-gold">
                        {topic.title}
                      </h4>
                      <div className="flex justify-between items-center text-[10px] text-gray-500">
                        <span>by {user ? topic.author : "Guest User"}</span>
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center gap-0.5"><Heart className="w-3 h-3 text-rose-500/70" /> {topic.likes || 0}</span>
                          <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" /> {topic.replies || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-gray-500 italic">
                    No discussions found.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Selected Topic Detail View & Replies */}
            <div className={`flex flex-col h-[700px] ${selectedTopic ? 'flex' : 'hidden lg:flex'}`}>
              {!selectedTopic ? (
                /* Empty state when no discussion is selected */
                <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 select-none">
                  <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4 text-gold/80 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-1">No Discussion Selected</h3>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    Choose a topic from the left sidebar to view its conversation details, replies, and to join the discussion.
                  </p>
                </div>
              ) : (
                /* Selected Topic details view */
                <div className="flex flex-col h-full justify-between">
                  
                  {/* Topic Scroll content */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">
                    <button 
                      onClick={() => setSelectedTopic(null)}
                      className="inline-flex items-center gap-2 text-gray-400 hover:text-gold text-xs font-semibold transition-colors cursor-pointer lg:hidden mb-4"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to List
                    </button>
                    
                    {/* Post Header */}
                    <div className="border-b border-white/[0.05] pb-5 space-y-3 text-left">
                      <div className="flex items-center gap-2">
                        <span className="bg-gold/10 border border-gold/25 text-gold px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {selectedTopic.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          Posted by <span className="text-gray-300 font-semibold">{user ? selectedTopic.author : "Guest User"}</span> · {timeAgo(selectedTopic.lastActivity || selectedTopic.createdAt)}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                        {selectedTopic.title}
                      </h2>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap text-left">
                      {selectedTopic.content}
                    </p>

                    {/* Post Actions */}
                    <div className="flex items-center gap-3 pt-3 border-b border-white/[0.05] pb-5">
                      <button
                        onClick={() => requireAuth(() => handleLikePost(selectedTopic.id))}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          likedPosts.has(selectedTopic.id)
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedPosts.has(selectedTopic.id) ? 'fill-current' : ''}`} />
                        <span>{selectedTopic.likes || 0} Likes</span>
                      </button>
                      <div className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{selectedTopic.views || 0} Views</span>
                      </div>
                    </div>

                    {/* Replies List */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gold" />
                        Replies ({selectedTopic.repliesData?.length || 0})
                      </h3>

                      <div className="space-y-3">
                        {selectedTopic.repliesData && selectedTopic.repliesData.length > 0 ? (
                          selectedTopic.repliesData.map((reply) => (
                            <div 
                              key={reply.id} 
                              className="bg-white/[0.015] border border-white/[0.06] rounded-2xl p-4 flex gap-3.5 text-left"
                            >
                              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-sm flex-shrink-0">
                                {reply.avatar || "💬"}
                              </div>
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white">{user ? reply.author : "Guest User"}</span>
                                  <span className="text-[10px] text-gray-500">{timeAgo(reply.timestamp) || "just now"}</span>
                                </div>
                                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                                
                                <div className="flex justify-end pt-1">
                                  <button
                                    onClick={() => requireAuth(() => handleLikeReply(selectedTopic.id, reply.id))}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-gold transition cursor-pointer"
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                    <span>{reply.likes || 0}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-gray-600 text-xs italic">
                            No replies yet. Be the first to answer!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reply Form Footer */}
                  <div className="p-4 md:p-5 border-t border-white/[0.05] bg-black/30 space-y-3 flex-shrink-0">
                    <div className="flex gap-2.5 items-end">
                      <textarea
                        rows="1"
                        placeholder="Share your thoughts or answer..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        className="flex-1 bg-white/[0.02] border border-white/10 hover:border-white/[0.15] focus:border-gold/40 focus:bg-white/[0.04] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-all resize-none max-h-24 min-h-[40px]"
                      />
                      <button
                        onClick={() => requireAuth(() => handleReply(selectedTopic.id))}
                        className="inline-flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-300 text-black transition duration-300 hover:brightness-110 shadow-md shadow-gold/5 cursor-pointer flex-shrink-0 h-10 w-10"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <SiteFooter />

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowNewPostModal(false)} />
          
          <div className="relative bg-[#0d0d0d] border border-white/10 rounded-[28px] p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-[fadeIn_0.2s_ease-out] space-y-5">
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold" />
                Start a New Discussion
              </h3>
              <button 
                onClick={() => setShowNewPostModal(false)}
                className="p-1.5 rounded-full hover:bg-white/[0.05] text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-left">
              {/* Category selector */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/10 hover:border-white/[0.15] focus:border-gold/40 focus:bg-white/[0.04] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0d0d0d] text-white">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Discussion Title</label>
                <input
                  type="text"
                  placeholder="e.g., How do I start building my emergency fund?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/10 hover:border-white/[0.15] focus:border-gold/40 focus:bg-white/[0.04] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                />
              </div>

              {/* Content */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Description / Details</label>
                <textarea
                  rows="4"
                  placeholder="Describe your question or share details of your strategy..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/10 hover:border-white/[0.15] focus:border-gold/40 focus:bg-white/[0.04] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.05]">
              <button
                onClick={() => setShowNewPostModal(false)}
                className="px-4 py-2.5 border border-white/10 hover:bg-white/[0.03] text-gray-300 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-5 py-2.5 bg-gradient-to-r from-gold to-amber-300 hover:brightness-110 text-black font-bold text-xs rounded-xl transition cursor-pointer shadow-md shadow-gold/5"
              >
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;