import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Trash2,
  DollarSign,
  TrendingUp,
  ChevronDown,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  Wallet,
  Target,
  BarChart3,
  CreditCard,
  User,
  Home,
  History,
  LogOut,
  Bot
} from 'lucide-react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, arrayUnion, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase.js";
import { fetchChatHistory } from '../FetchChatHistory.js';
import { onAuthStateChanged } from "firebase/auth";
import Beams from '../components/Beams';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const FinancialChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Welcome to your Personal Financial Assistant! I'm here to help you navigate investments, budgeting, SIPs, debt management, and wealth building strategies. Let's secure your financial future together.",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [advisoryMode, setAdvisoryMode] = useState('general');
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistoryId, setChatHistoryId] = useState(null);
  const [chatHistory, setChatHistory] = useState(null);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const data = await fetchChatHistory(currentUser.uid);
        setChatHistory(data);
        setUserName(currentUser.displayName);
      } else {
        console.log("No user signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  const createChatHistory = async (uid) => {
    try {
      const docRef = await addDoc(collection(db, "chatHistory"), {
        userId: uid,
        createdAt: serverTimestamp(),
        messages: []
      });
      const chatDocRef = doc(db, "chatHistory", docRef.id);
      await updateDoc(chatDocRef, {
        messages: arrayUnion({
          id: 1,
          type: 'bot',
          content: "Welcome to your Personal Financial Assistant! I'm here to help you navigate investments, budgeting, SIPs, debt management, and wealth building strategies. Let's secure your financial future together.",
          timestamp: new Date(),
        })
      });
      setChatHistoryId(docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating chat history:", error);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [advisoryMode, isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageText = inputMessage;
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
      mode: advisoryMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    let id = chatHistoryId;
    if (auth.currentUser?.uid) {
      try {
        if (!id) {
          id = await createChatHistory(auth.currentUser.uid);
        }
        if (id) {
          const chatDocRef = doc(db, "chatHistory", id);
          await updateDoc(chatDocRef, {
            messages: arrayUnion(userMessage)
          });
        }
      } catch (firestoreErr) {
        console.warn("Could not save chat history to Firestore:", firestoreErr);
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, context: 'financial_assistant', mode: advisoryMode }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response || generateMockResponse(messageText, advisoryMode),
        timestamp: new Date(),
        mode: advisoryMode
      };

      if (id) {
        try {
          const chatDocRef2 = doc(db, "chatHistory", id);
          await updateDoc(chatDocRef2, { messages: arrayUnion(botMessage) });
        } catch (e) {
          console.warn("Could not sync bot response to Firestore:", e);
        }
      }

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err.message);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateMockResponse(messageText, advisoryMode),
        timestamp: new Date(),
        mode: advisoryMode
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const onSelectChat = (index) => {
    setMessages(chatHistory[index].messages);
    setShowHistoryModal(false);
    setChatHistoryId(chatHistory[index].id);
    if (isMobile) setSidebarCollapsed(true);
  };

  const generateMockResponse = (message, mode) => {
    const responses = {
      general: [
        "Based on current market conditions, I recommend diversifying your portfolio across equity, debt, and hybrid funds for optimal risk-adjusted returns.",
        "Let me help you create a comprehensive financial plan. Start with building an emergency fund covering 6-12 months of expenses.",
        "For long-term wealth creation, consider systematic investment plans (SIPs) in well-performing mutual funds with a 15+ year horizon."
      ],
      investment: [
        "For your investment horizon, I suggest a balanced approach: 60% equity funds, 30% debt funds, and 10% alternative investments like gold ETFs.",
        "Based on your risk profile, large-cap equity funds with consistent performance over 5+ years would be suitable for your portfolio.",
        "Consider tax-saving ELSS funds to optimize your tax liability while building wealth for the long term."
      ],
      planning: [
        "Your retirement planning should follow the 4% rule. Aim to accumulate 25 times your annual expenses by retirement age.",
        "For goal-based investing, separate your investments by time horizon: short-term (debt funds), medium-term (hybrid funds), long-term (equity funds).",
        "Insurance planning is crucial. Ensure you have adequate term life insurance (10-15 times annual income) and health coverage."
      ],
      debt: [
        "Focus on high-interest debt first. Credit card debt should be your priority, followed by personal loans, then home loans.",
        "Consider debt consolidation if you have multiple high-interest loans. This can reduce your overall interest burden significantly.",
        "The debt avalanche method (paying highest interest rate debts first) is mathematically optimal for minimizing total interest paid."
      ]
    };

    const modeResponses = responses[mode] || responses.general;
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Fresh start! I'm ready to provide ${getModeDescription(advisoryMode)} guidance. What financial goals would you like to work on today?`,
        timestamp: new Date(),
      }
    ]);
    setError(null);
  };

  const getModeDescription = (mode) => {
    switch (mode) {
      case 'investment': return 'investment advisory and portfolio management';
      case 'planning': return 'comprehensive financial planning';
      case 'debt': return 'debt management and optimization';
      default: return 'comprehensive financial advisory';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'investment': return <TrendingUp className="w-4 h-4" />;
      case 'planning': return <Target className="w-4 h-4" />;
      case 'debt': return <CreditCard className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp) => {
    let date;
    if (timestamp?.seconds !== undefined) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = {
    general: [
      "Create a monthly budget plan",
      "Best mutual funds for 2024",
      "How to start investing with ₹5000"
    ],
    investment: [
      "Top performing SIP funds",
      "Portfolio diversification strategy",
      "Tax-saving investment options"
    ],
    planning: [
      "Retirement planning calculator",
      "Child education fund planning",
      "Home loan vs rent analysis"
    ],
    debt: [
      "Credit card debt elimination",
      "Personal loan consolidation",
      "Home loan prepayment strategy"
    ]
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    if (isMobile) setSidebarCollapsed(true);
  };

  const handleModeChange = (mode) => {
    setAdvisoryMode(mode);
    if (isMobile) setSidebarCollapsed(true);
  };

  const handleProfileAction = async (action) => {
    setShowProfile(false);

    switch (action) {
      case 'home': navigate('/features'); break;
      case 'history': setShowHistoryModal(true); break;
      case 'logout':
        await auth.signOut();
        navigate('/login');
        break;
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-[1000]">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-violet-600 to-violet-400 border-none rounded-[25px] text-white cursor-pointer font-sans shadow-[0_8px_30px_rgba(139,69,255,0.3)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(139,69,255,0.4)]"
        >
          <Wallet className="w-6 h-6" />
          <div className="flex flex-col items-start text-left">
            <div className="font-semibold text-sm">Financial Assistant</div>
            <div className="text-[11px] opacity-80">Click to expand</div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#07070c] font-sans text-white overflow-hidden relative">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Background Beams — fixed, subtle */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none overflow-hidden">
        <Beams
          beamWidth={3.2}
          beamHeight={30}
          beamNumber={20}
          lightColor="#a78bfa"
          speed={2.4}
          noiseIntensity={2.6}
          scale={0.18}
          rotation={16}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`flex flex-col bg-black/60 border-r border-white/[0.08] backdrop-blur-3xl transition-all duration-300 z-30 ${
          isMobile ? `absolute top-0 left-0 h-full ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} w-[280px]` : sidebarCollapsed ? 'w-20' : 'w-80'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-5 min-h-[68px] border-b border-white/[0.08]">
          <div className="flex items-center gap-3 text-violet-400 font-semibold text-base whitespace-nowrap overflow-hidden">
            {!sidebarCollapsed && <Bot size={18} className="flex-shrink-0 text-violet-400" />}
            {!sidebarCollapsed && <span className="font-bold tracking-wide">AI Money Mentor</span>}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="bg-white/[0.03] border border-white/10 hover:border-violet-500/30 rounded-xl p-2 text-violet-400 cursor-pointer transition-all duration-200 flex-shrink-0 hover:bg-violet-500/10 hover:scale-105"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between">
            
            <div className="space-y-5">
              {/* Advisory Mode Selection */}
              <div>
                <h3 className="text-gray-500 text-[10px] font-bold mb-3 uppercase tracking-widest">Advisory Mode</h3>
                <div className="flex flex-col gap-1.5">
                  {[
                    { key: 'general', label: 'General Finance', icon: <DollarSign className="w-4 h-4" /> },
                    { key: 'investment', label: 'Investment Advisory', icon: <TrendingUp className="w-4 h-4" /> },
                    { key: 'planning', label: 'Financial Planning', icon: <Target className="w-4 h-4" /> },
                    { key: 'debt', label: 'Debt Management', icon: <CreditCard className="w-4 h-4" /> }
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => handleModeChange(mode.key)}
                      className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs cursor-pointer transition-all duration-300 border ${
                        advisoryMode === mode.key
                          ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                          : 'bg-white/[0.02] border-white/[0.04] text-gray-400 hover:bg-violet-500/5 hover:border-violet-500/20 hover:text-violet-400'
                      }`}
                    >
                      {mode.icon}
                      <span className="font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Suggestions list */}
              <div>
                <h3 className="text-gray-500 text-[10px] font-bold mb-3 uppercase tracking-widest">Quick Actions</h3>
                <div className="flex flex-col gap-1.5">
                  {quickActions[advisoryMode].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-xl text-gray-400 text-xs cursor-pointer transition-all duration-200 text-left hover:bg-violet-500/5 hover:border-violet-500/20 hover:text-violet-400 hover:translate-x-1"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile deck at the bottom */}
            <div className="mt-8 pt-5 border-t border-white/[0.08]">
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-full flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.08] hover:border-violet-500/20 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-[0_4px_12px_rgba(139,92,246,0.2)]">
                      {userName ? userName.charAt(0) : <User className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="text-gray-200 font-semibold text-xs sm:text-sm truncate max-w-[120px]">{userName || 'User'}</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
                </button>

                {showProfile && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#101018]/95 border border-white/[0.08] rounded-2xl backdrop-blur-3xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-40 overflow-hidden">
                    <button onClick={() => handleProfileAction('home')} className="flex items-center gap-3 w-full px-4 py-3 bg-transparent border-none text-gray-300 text-xs sm:text-sm cursor-pointer transition-all duration-200 text-left hover:bg-violet-500/10 hover:text-violet-400">
                      <Home className="w-4 h-4" />
                      <span>Back to Features</span>
                    </button>
                    <button onClick={() => handleProfileAction('history')} className="flex items-center gap-3 w-full px-4 py-3 bg-transparent border-none text-gray-300 text-xs sm:text-sm cursor-pointer transition-all duration-200 text-left hover:bg-violet-500/10 hover:text-violet-400">
                      <History className="w-4 h-4" />
                      <span>Chat History</span>
                    </button>
                    <button onClick={() => handleProfileAction('logout')} className="flex items-center gap-3 w-full px-4 py-3 bg-transparent border-none border-t border-white/[0.08] text-red-400 text-xs sm:text-sm cursor-pointer transition-all duration-200 text-left hover:bg-red-500/10 hover:text-red-300">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col bg-transparent w-full min-w-0 z-10">
        
        {/* Workspace App Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/[0.08] bg-black/40 backdrop-blur-md z-20 min-h-[68px]">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-2 text-violet-400 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            {/* Back to Features link option */}
            <button
              onClick={() => navigate('/features')}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-violet-400 transition-colors mr-2 cursor-pointer group bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-400" />
              <h1 className="text-white text-base sm:text-lg font-bold">
                FinEd <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">AI Mentor</span>
              </h1>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={clearChat}
              title="Reset Chat Session"
              className="bg-white/[0.02] border border-white/[0.08] hover:border-violet-500/20 rounded-xl p-2.5 text-gray-400 hover:text-violet-400 cursor-pointer transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversation Feeds Panel */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {messages.length <= 1 ? (
            /* Sleek ChatGPT/Gemini Welcome Portal */
            <div className="flex-1 flex flex-col justify-center items-center px-4 max-w-2xl mx-auto text-center z-10 relative">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6 shadow-[0_0_25px_rgba(139,92,246,0.15)]">
                <Bot className="w-7 h-7 text-violet-400" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Hello, <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">{userName || 'Learner'}</span>
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed">
                I'm your FinEd AI Money Mentor. Ask me any question about budgeting, investing, SIPs, credit cards, or wealth planning to get started.
              </p>

              {/* Suggestions Deck */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mt-10">
                {quickActions[advisoryMode].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="p-4 bg-white/[0.02] border border-white/[0.06] hover:bg-violet-500/5 hover:border-violet-500/20 hover:text-violet-400 rounded-2xl text-left text-gray-300 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <p className="font-bold text-white text-xs mb-1">Suggest Prompt</p>
                    <p className="text-gray-400 text-[11px] line-clamp-1 leading-snug">{action}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active message feed */
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <div className="max-w-3xl mx-auto w-full space-y-6">
                
                {messages.map((message) => (
                  <div key={message.id} className="flex flex-col gap-2">
                    <div className={`flex items-start gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      
                      {/* Avatar */}
                      {message.type === 'bot' && (
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                          <Bot className="w-4 h-4 text-violet-400" />
                        </div>
                      )}

                      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] gap-1.5 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                        {/* Bubble */}
                        <div
                          className={`px-5 py-3.5 rounded-[22px] text-xs sm:text-sm leading-relaxed break-words ${
                            message.type === 'user'
                              ? 'bg-violet-600/90 text-white border border-violet-500/30 rounded-br-sm shadow-[0_4px_15px_rgba(139,92,246,0.15)] font-medium text-left'
                              : 'bg-white/[0.03] border border-white/[0.06] text-gray-200 rounded-bl-sm backdrop-blur-md text-left shadow-[0_4px_30px_rgba(0,0,0,0.15)]'
                          }`}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        </div>
                        
                        {/* Meta/Timestamp */}
                        <div className={`flex items-center gap-3 text-[10px] text-gray-500 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                          <span>{formatTime(message.timestamp)}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                      <Bot className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="flex items-center gap-3 px-5 py-4 bg-white/[0.03] border border-white/[0.06] rounded-[22px] rounded-bl-sm backdrop-blur-md">
                      <div className="flex gap-1 mr-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-gray-500 text-[11px] italic">Analyzing query...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

        </div>

        {error && (
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 bg-red-500/10 border-t border-b border-red-500/20 text-red-400 text-xs sm:text-sm">
            <X className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 font-medium">Service Issue: {error}</span>
            <button onClick={() => setError(null)} className="bg-transparent border-none text-red-400 cursor-pointer p-1 rounded hover:bg-red-500/10">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input deck */}
        <div className="px-4 sm:px-6 pb-6 pt-2 bg-transparent z-10">
          <div className="max-w-3xl mx-auto w-full">
            <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-3xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus-within:border-violet-500/40 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-all duration-300 backdrop-blur-md">
              <div className="flex gap-3 items-end">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={`Ask FinEd AI about ${getModeDescription(advisoryMode)}...`}
                  rows="1"
                  disabled={isTyping}
                  className="flex-1 bg-transparent border-none text-white text-sm font-sans resize-none min-h-[40px] max-h-[160px] py-2 px-3 outline-none placeholder:text-gray-600 focus:ring-0"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-br from-violet-500 to-purple-600 border-none rounded-xl w-9 h-9 text-white cursor-pointer transition-all duration-300 flex items-center justify-center font-bold shadow-[0_4px_15px_rgba(139,92,246,0.3)] disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:scale-105 hover:not-disabled:shadow-[0_8px_25px_rgba(139,92,246,0.45)] mb-0.5 mr-0.5 flex-shrink-0"
                >
                  {isTyping ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center px-4 mt-2.5 text-[10px] text-gray-500 font-mono">
              <span>Press Enter to send • Shift+Enter for new line</span>
              <span>{messages.length} messages</span>
            </div>
          </div>
        </div>

      </div>

      {/* Chat History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[1000]">
          <div className="w-[90%] max-w-md bg-[#0f0f18]/90 border border-white/[0.08] rounded-3xl backdrop-blur-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex flex-col justify-between">
            
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/[0.08]">
              <h2 className="flex items-center gap-3 text-violet-400 text-sm sm:text-base font-bold m-0">
                <History className="w-4.5 h-4.5 text-violet-400" />
                Conversation History
              </h2>
              <button onClick={() => setShowHistoryModal(false)} className="bg-white/[0.02] border border-white/10 rounded-xl p-2 text-gray-400 cursor-pointer transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 max-h-[360px] overflow-y-auto no-scrollbar flex-1">
              <div className="flex flex-col items-center gap-4">
                {chatHistory && chatHistory.length !== 0 ? (
                  <div className="flex flex-col gap-2.5 w-full">
                    {chatHistory.map((chat, index) => (
                      <div
                        key={chat.id}
                        onClick={() => onSelectChat(index)}
                        className="flex justify-between items-center px-4.5 py-3.5 bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/30 rounded-2xl cursor-pointer transition-all duration-300 w-full hover:bg-violet-500/5 hover:-translate-y-0.5"
                      >
                        <span className="text-gray-200 text-xs sm:text-sm font-medium flex-1 text-left">
                          {new Date(chat.createdAt.seconds * 1000).toLocaleDateString()} at{' '}
                          {new Date(chat.createdAt.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8">
                    <h3 className="text-gray-200 text-sm font-bold m-0 mb-2">No Chat Sessions Found</h3>
                    <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
                      Your previous conversations will appear here once you start chatting with FinEd AI.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          onClick={() => setSidebarCollapsed(true)}
          className="absolute inset-0 bg-black/60 z-20 backdrop-blur-sm"
        />
      )}
      
    </div>
  );
};

export default FinancialChatbot;
