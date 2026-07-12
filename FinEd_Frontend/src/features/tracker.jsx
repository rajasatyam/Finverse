import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PiggyBank, Wallet, ReceiptText } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Beams from "../components/Beams";
import Expense from "./expense.jsx";
import Savings from "./savings.jsx";

const TABS = [
  { key: "expenses", label: "Expenses", icon: ReceiptText },
  { key: "savings", label: "Savings Goals", icon: PiggyBank },
];

export function Tracker() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("expenses");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060606] text-white font-sans">
      <SiteHeader />

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

      <main className="relative z-10 pt-28 pb-16 md:pt-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          
          {/* ─── Workspace Control Bar ─── */}
          <div className="bg-[#0d0d0d]/90 backdrop-blur-xl border border-white/10 rounded-[24px] mb-8 shadow-[0_15px_50px_rgba(0,0,0,0.3)]">
            <div className="px-5 md:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/features")}
                  className="flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                  <span className="hidden sm:inline">Features</span>
                </button>
                <div className="w-px h-6 bg-white/[0.08]" />
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-5 h-5 text-gold" />
                  <span className="font-display text-base font-bold text-white">Financial Tracker</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Tab pills */}
                <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                        activeTab === tab.key
                          ? "bg-gold text-black shadow-md shadow-gold/10"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="relative">
            <AnimatePresence mode="wait">
              {activeTab === "expenses" ? (
                <motion.div
                  key="expenses"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <Expense />
                </motion.div>
              ) : (
                <motion.div
                  key="savings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <Savings />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
