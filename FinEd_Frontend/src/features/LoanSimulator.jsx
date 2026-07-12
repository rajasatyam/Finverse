import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Coins,
  Info,
  Landmark,
  Lightbulb,
  RotateCcw,
  Undo2,
  X,
} from 'lucide-react';

const chartTooltipStyle = {
  backgroundColor: '#141414',
  border: '1px solid rgba(255,215,0,0.25)',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '13px',
};

const MetricTile = ({ label, value, tone = 'white', sub }) => {
  const tones = {
    white: 'text-white',
    blue: 'text-sky-400',
    red: 'text-red-400',
    green: 'text-emerald-400',
    orange: 'text-amber-400',
    purple: 'text-violet-400',
    gold: 'text-gold',
  };
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
      <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1.5">{label}</div>
      <div className={`font-display text-lg sm:text-xl font-bold ${tones[tone]}`}>{value}</div>
      {sub && <div className="text-gray-600 text-[11px] mt-1 leading-snug">{sub}</div>}
    </div>
  );
};

const ScoreGauge = ({ score, color, label }) => {
  const pct = Math.max(0, Math.min(1, (score - 300) / 550));
  const radius = 80;
  const circ = Math.PI * radius;
  const dash = circ * pct;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-full max-w-[220px]">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.22,1,0.36,1), stroke 0.4s' }}
        />
      </svg>
      <div className="-mt-6 text-center">
        <div className="font-display text-4xl font-bold" style={{ color }}>{score}</div>
        <div className="text-gray-500 text-sm mt-0.5">{label}</div>
      </div>
    </div>
  );
};

const LoanSimulator = () => {
  const [loanAmount, setLoanAmount] = useState('10000');
  const [interestRate, setInterestRate] = useState('12');
  const [duration, setDuration] = useState('12');
  const [originalDuration, setOriginalDuration] = useState('');
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState(0);
  const [totalPenaltyPaid, setTotalPenaltyPaid] = useState(0);
  const [totalPrincipalPaid, setTotalPrincipalPaid] = useState(0);
  const [pendingInterest, setPendingInterest] = useState(0);
  const [pendingPenalty, setPendingPenalty] = useState(0);
  const [creditScore, setCreditScore] = useState(700);
  const [notification, setNotification] = useState('');
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [loanHistory, setLoanHistory] = useState([]);
  const [extraPaymentAmount, setExtraPaymentAmount] = useState('');
  const [showExtraPaymentInput, setShowExtraPaymentInput] = useState(false);
  const [originalLoanAmount, setOriginalLoanAmount] = useState(0);
  const [gameStateHistory, setGameStateHistory] = useState([]);

  // Calculate penalty due (only if there are pending amounts)
  const currentPenaltyDue = pendingPenalty;

  // Auto-dismiss the notification toast
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(''), 6000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Save current state before any action
  const saveCurrentState = () => {
    const currentState = {
      currentMonth,
      remainingBalance,
      totalInterestPaid,
      totalPenaltyPaid,
      totalPrincipalPaid,
      pendingInterest,
      pendingPenalty,
      creditScore,
      balanceHistory: [...balanceHistory],
      loanHistory: [...loanHistory]
    };
    setGameStateHistory(prev => [...prev, currentState]);
  };

  const undoLastAction = () => {
    if (gameStateHistory.length === 0) {
      setNotification('No actions to undo!');
      return;
    }

    const lastState = gameStateHistory[gameStateHistory.length - 1];

    // Restore all state values
    setCurrentMonth(lastState.currentMonth);
    setRemainingBalance(lastState.remainingBalance);
    setTotalInterestPaid(lastState.totalInterestPaid);
    setTotalPenaltyPaid(lastState.totalPenaltyPaid);
    setTotalPrincipalPaid(lastState.totalPrincipalPaid);
    setPendingInterest(lastState.pendingInterest);
    setPendingPenalty(lastState.pendingPenalty);
    setCreditScore(lastState.creditScore);
    setBalanceHistory(lastState.balanceHistory);
    setLoanHistory(lastState.loanHistory);

    // Remove the last state from history
    setGameStateHistory(prev => prev.slice(0, -1));

    setNotification(`↩️ Last action undone! Back to Month ${lastState.currentMonth}.`);
  };

  const calculateEMI = (principal, rate, time) => {
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, time)) /
                (Math.pow(1 + monthlyRate, time) - 1);
    return Math.round(emi);
  };

  const startSimulation = () => {
    if (!loanAmount || !interestRate || !duration) {
      setNotification('Please fill all fields to start simulation');
      return;
    }

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const time = parseInt(duration);

    const emi = calculateEMI(principal, rate, time);

    setMonthlyEMI(emi);
    setRemainingBalance(principal);
    setOriginalLoanAmount(principal);
    setTotalInterestPaid(0);
    setTotalPenaltyPaid(0);
    setTotalPrincipalPaid(0);
    setPendingInterest(0);
    setPendingPenalty(0);
    setCurrentMonth(1);
    setCreditScore(700);
    setIsSimulationStarted(true);
    setExtraPaymentAmount('');
    setShowExtraPaymentInput(false);
    setNotification('Simulation started! Choose your payment action for Month 1.');

    // Initialize balance history
    const initialHistory = [{ month: 0, balance: principal, creditScore: 700 }];
    setBalanceHistory(initialHistory);
    setLoanHistory([]);
  };

  const resetSimulation = () => {
    setIsSimulationStarted(false);
    setLoanAmount('');
    setInterestRate('');
    setDuration('');
    setOriginalDuration('');
    setCurrentMonth(1);
    setRemainingBalance(0);
    setOriginalLoanAmount(0);
    setTotalInterestPaid(0);
    setTotalPenaltyPaid(0);
    setTotalPrincipalPaid(0);
    setPendingInterest(0);
    setPendingPenalty(0);
    setCreditScore(700);
    setNotification('');
    setMonthlyEMI(0);
    setBalanceHistory([]);
    setLoanHistory([]);
    setExtraPaymentAmount('');
    setShowExtraPaymentInput(false);
    setGameStateHistory([]);
  };

  let currentMonthInterest = remainingBalance > 0 ? (remainingBalance * parseFloat(interestRate || 0)) / (12 * 100) : 0;
  if (remainingBalance < monthlyEMI && pendingPenalty == 0) {
    currentMonthInterest = 0;
  }

  const payEMI = () => {
    if (remainingBalance <= 0) {
      setNotification('Loan already paid off!');
      return;
    }

    // Save state before making changes
    saveCurrentState();

    // First pay any pending interest and penalty
    const totalPending = pendingInterest + pendingPenalty;
    const actualPayment = Math.min(monthlyEMI, remainingBalance + totalPending + currentMonthInterest);

    // Current month's interest
    let currentInterest = (remainingBalance * parseFloat(interestRate)) / (12 * 100);

    // Total interest and penalty to be paid this month
    if (remainingBalance < monthlyEMI && totalPending == 0) {
      currentInterest = 0;
    }
    const totalInterestToPay = pendingInterest + currentInterest;
    const totalPenaltyToPay = pendingPenalty;

    // Principal payment is what's left after paying interest and penalty
    const principalPayment = Math.max(0, actualPayment - totalInterestToPay - totalPenaltyToPay);
    const newBalance = Math.max(0, remainingBalance - principalPayment);

    setRemainingBalance(newBalance);
    setTotalInterestPaid(prev => prev + totalInterestToPay);
    setTotalPenaltyPaid(prev => prev + totalPenaltyToPay);
    setTotalPrincipalPaid(prev => prev + principalPayment);
    setPendingInterest(0);
    setPendingPenalty(0);
    setCreditScore(prev => Math.min(850, prev + 2));

    if (currentMonth + 1 > Number(originalDuration) && newBalance > 0) {
      const monthlyInterest = (remainingBalance * parseFloat(interestRate)) / (12 * 100);
      const penalty = monthlyEMI * 0.1; // 10% penalty
      const extraInterest = monthlyInterest * 0.5; // 50% extra interest for delay
      const totalNewPenalty = penalty + extraInterest;
      setPendingPenalty(prev => prev + totalNewPenalty);
    }

    // Update history
    const newHistoryPoint = {
      month: currentMonth,
      balance: newBalance,
      creditScore: Math.min(850, creditScore + 2)
    };
    setBalanceHistory(prev => [...prev, newHistoryPoint]);
    setLoanHistory(prev => [...prev, {
      month: currentMonth,
      action: 'Paid EMI',
      amount: actualPayment,
      balance: newBalance
    }]);

    if (newBalance <= 0) {
      setNotification(`🎉 Congratulations! Loan paid off in month ${currentMonth}!`);
      setCurrentMonth(prev => prev + 1);
    } else {
      setNotification(`✅ Great! You paid ₹${Math.round(actualPayment)} on time. Balance reduced to ₹${Math.round(newBalance)}.`);
      setCurrentMonth(prev => {
        if (remainingBalance > 0) {
          if (prev + 1 > Number(originalDuration)) {
            setDuration((Number(duration) + 1).toString());
          }
          return prev + 1;
        }
        return prev;
      });
    }
  };

  const delayPayment = () => {
    if (remainingBalance <= 0) {
      setNotification('Loan already paid off!');
      return;
    }

    // Save state before making changes
    saveCurrentState();

    // Calculate this month's interest and penalty (but don't pay them yet)
    const monthlyInterest = (remainingBalance * parseFloat(interestRate)) / (12 * 100);
    const penalty = monthlyEMI * 0.1; // 10% penalty
    const extraInterest = monthlyInterest * 0.5; // 50% extra interest for delay
    const totalNewPenalty = penalty + extraInterest;

    const interestPending = pendingInterest + monthlyInterest;
    const penaltyPending = pendingPenalty + totalNewPenalty;

    // Add to pending amounts (not yet paid)
    setPendingInterest(prev => prev + monthlyInterest);
    setPendingPenalty(prev => prev + totalNewPenalty);
    setCreditScore(prev => Math.max(300, prev - 15));

    // Update history
    const newHistoryPoint = {
      month: currentMonth,
      balance: remainingBalance, // Balance doesn't change when delaying
      creditScore: Math.max(300, creditScore - 15)
    };
    setBalanceHistory(prev => [...prev, newHistoryPoint]);
    setLoanHistory(prev => [...prev, {
      month: currentMonth,
      action: 'Delayed Payment',
      amount: 0, // No payment made
      balance: remainingBalance
    }]);

    setNotification(`⏳ Payment delayed! Interest: ₹${Math.round(interestPending)} + Penalty: ₹${Math.round(penaltyPending)} = ₹${Math.round(interestPending + penaltyPending)} will be due next month.`);
    setCurrentMonth(prev => prev + 1);
  };

  const payExtra = () => {
    if (remainingBalance <= 0) {
      setNotification('Loan already paid off!');
      return;
    }

    if (!extraPaymentAmount || parseFloat(extraPaymentAmount) <= 0) {
      setNotification('Please enter a valid custom payment amount');
      return;
    }

    // Save state before making changes
    saveCurrentState();

    const customAmount = parseFloat(extraPaymentAmount);

    // First pay any pending interest and penalty
    const totalPending = pendingInterest + pendingPenalty;
    const currentInterest = (remainingBalance * parseFloat(interestRate)) / (12 * 100);

    // Total payment available
    const totalPaymentAvailable = customAmount;
    const totalInterestToPay = pendingInterest + currentInterest;
    const totalPenaltyToPay = pendingPenalty;

    // Calculate actual payment (can't exceed remaining balance + pending amounts)
    const totalPayment = Math.min(totalPaymentAvailable, remainingBalance + totalPending + currentInterest);

    // Principal payment is what's left after paying interest and penalty
    const principalPayment = Math.max(0, totalPayment - totalInterestToPay - totalPenaltyToPay);
    const newBalance = Math.max(0, remainingBalance - principalPayment);

    setRemainingBalance(newBalance);
    setTotalInterestPaid(prev => prev + totalInterestToPay);
    setTotalPenaltyPaid(prev => prev + totalPenaltyToPay);
    setTotalPrincipalPaid(prev => prev + principalPayment);
    setPendingInterest(0);
    setPendingPenalty(0);
    setCreditScore(prev => Math.min(850, prev + 5));
    setExtraPaymentAmount('');
    setShowExtraPaymentInput(false);

    // Update history
    const newHistoryPoint = {
      month: currentMonth,
      balance: newBalance,
      creditScore: Math.min(850, creditScore + 5)
    };
    setBalanceHistory(prev => [...prev, newHistoryPoint]);
    setLoanHistory(prev => [...prev, {
      month: currentMonth,
      action: 'Custom Payment',
      amount: totalPayment,
      balance: newBalance
    }]);

    if (newBalance <= 0) {
      setNotification(`🎉 Congratulations! Loan paid off early in month ${currentMonth} with custom payment!`);
    } else {
      setNotification(`💰 Excellent! Custom payment of ₹${Math.round(totalPayment)} made. Balance: ₹${Math.round(newBalance)}`);
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getCreditScoreColor = (score) => {
    if (score >= 750) return '#10B981';
    if (score >= 650) return '#F59E0B';
    return '#EF4444';
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    return 'Poor';
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.12] text-white placeholder-gray-600 text-[15px] outline-none transition-all duration-200 focus:border-gold/60 focus:ring-2 focus:ring-gold/15';

  const primaryAction =
    'w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-black bg-gradient-to-br from-gold to-gold-dark transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,215,0,0.35)] cursor-pointer';
  const ghostAction =
    'w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border';

  const totalDueThisMonth = currentPenaltyDue + currentMonthInterest + pendingInterest;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gold/[0.04] rounded-full blur-[180px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-gold-dark/[0.03] rounded-full blur-[140px]" />
      </div>

      {/* Slim workspace toolbar */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/creditOrLoan" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Simulators</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
              <Landmark className="w-4 h-4" />
            </span>
            <span className="font-display text-base font-bold text-white">Loan Simulator</span>
          </div>

          {isSimulationStarted ? (
            <button onClick={resetSimulation} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm font-medium transition-colors cursor-pointer">
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          ) : (
            <span className="w-16" />
          )}
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {!isSimulationStarted ? (
          /* ---------------- SETUP ---------------- */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-8 items-center pt-6"
          >
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">Set the terms</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 mb-4 leading-tight">
                Borrow on paper,<br />repay it your way.
              </h1>
              <p className="text-gray-400 text-[15px] leading-relaxed mb-6">
                Enter a principal, rate, and term. We'll compute the EMI — then you decide, month by
                month, whether to pay on time, prepay, or delay and watch the cost compound.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  ['Pay EMI', 'Stay on schedule, nudge your score up'],
                  ['Pay custom', 'Prepay to kill interest faster'],
                  ['Delay', 'See penalties and interest stack up'],
                ].map(([k, v], i) => (
                  <li key={k} className="flex items-center gap-3 text-sm">
                    <span className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 text-gold flex items-center justify-center font-bold text-xs flex-shrink-0">{i + 1}</span>
                    <span className="text-white font-semibold">{k}</span>
                    <span className="text-gray-500">— {v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-7 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col gap-5">
                <div>
                  <label htmlFor="loan-amount" className="block text-gray-300 text-sm font-medium mb-1.5">Loan Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">₹</span>
                    <input id="loan-amount" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className={`${inputClass} pl-9`} placeholder="10000" />
                  </div>
                </div>
                <div>
                  <label htmlFor="interest-rate" className="block text-gray-300 text-sm font-medium mb-1.5">Interest Rate</label>
                  <div className="relative">
                    <input id="interest-rate" type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className={`${inputClass} pr-9`} placeholder="12" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">%</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="loan-duration" className="block text-gray-300 text-sm font-medium mb-1.5">Duration</label>
                  <div className="relative">
                    <input id="loan-duration" type="number" value={duration} onChange={(e) => { setDuration(e.target.value); setOriginalDuration(e.target.value); }} className={`${inputClass} pr-20`} placeholder="12" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none">months</span>
                  </div>
                </div>
                <button onClick={startSimulation} className="mt-2 w-full px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-black bg-gradient-to-br from-gold to-gold-dark shadow-[0_8px_30px_rgba(255,215,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,215,0,0.4)] cursor-pointer">
                  Start Simulation
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ---------------- COCKPIT DASHBOARD ---------------- */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6"
          >
            {/* ===== LEFT: CONTROL RAIL ===== */}
            <aside className="lg:sticky lg:top-24 lg:self-start flex flex-col gap-5">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Repayment</div>
                    <div className="font-display text-2xl font-bold text-white mt-0.5">Month {currentMonth}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Monthly EMI</div>
                    <div className="font-display text-xl font-bold text-sky-400 mt-0.5">₹{monthlyEMI.toLocaleString()}</div>
                  </div>
                </div>

                {/* Hero stat: remaining balance */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5">
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Remaining balance</div>
                  <div className="font-display text-4xl font-bold text-white">₹{Math.round(remainingBalance).toLocaleString()}</div>
                  <div className="mt-3 h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500" style={{ width: `${originalLoanAmount > 0 ? Math.min(100, (totalPrincipalPaid / originalLoanAmount) * 100) : 0}%` }} />
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1.5">
                    ₹{Math.round(totalPrincipalPaid).toLocaleString()} principal cleared of ₹{Math.round(originalLoanAmount).toLocaleString()}
                  </div>
                </div>

                {/* Total due callout */}
                {totalDueThisMonth > 0 && (
                  <div className="mt-3 flex items-center justify-between rounded-2xl bg-red-500/[0.06] border border-red-500/20 px-4 py-3">
                    <span className="text-gray-400 text-xs">Due this month</span>
                    <span className="font-display text-lg font-bold text-red-400">₹{Math.round(totalDueThisMonth).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {remainingBalance > 0 ? (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6">
                  <div className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-4">Your move for Month {currentMonth}</div>
                  <div className="flex flex-col gap-2.5">
                    <button onClick={payEMI} className={primaryAction}>
                      <CheckCircle2 className="w-4 h-4" />
                      Pay {(remainingBalance + pendingInterest + pendingPenalty + currentMonthInterest) < monthlyEMI ? `₹${Math.round(remainingBalance + pendingInterest + pendingPenalty + currentMonthInterest).toLocaleString()}` : `EMI (₹${monthlyEMI.toLocaleString()})`}
                    </button>
                    {(pendingInterest > 0 || pendingPenalty > 0) && (
                      <p className="text-[11px] text-amber-400/80 text-center -mt-1">includes ₹{Math.round(pendingInterest + pendingPenalty).toLocaleString()} pending</p>
                    )}
                    <button onClick={() => setShowExtraPaymentInput(true)} className={`${ghostAction} bg-white/[0.03] border-violet-500/30 text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/60`}>
                      <Coins className="w-4 h-4" /> Pay custom amount
                    </button>
                    <button onClick={delayPayment} className={`${ghostAction} bg-white/[0.03] border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/60`}>
                      <Clock className="w-4 h-4" /> Delay payment
                    </button>
                    {gameStateHistory.length > 0 && (
                      <button onClick={undoLastAction} className="mt-1 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-gray-400 hover:text-white border border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300 cursor-pointer">
                        <Undo2 className="w-4 h-4" /> Undo last action
                      </button>
                    )}
                  </div>

                  {/* Inline custom payment */}
                  <AnimatePresence>
                    {showExtraPaymentInput && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                        <div className="mt-4 p-4 rounded-2xl bg-violet-500/[0.05] border border-violet-500/25">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-bold text-sm">Custom payment</h4>
                            <button onClick={() => { setShowExtraPaymentInput(false); setExtraPaymentAmount(''); }} className="text-gray-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                          </div>
                          <p className="text-gray-500 text-xs mb-3">Less, equal, or more than your EMI — prepaying kills interest faster.</p>
                          <div className="relative mb-2.5">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">₹</span>
                            <input type="number" value={extraPaymentAmount} onChange={(e) => setExtraPaymentAmount(e.target.value)} className={`${inputClass} pl-9 focus:border-violet-400/60 focus:ring-violet-400/15`} placeholder="Amount" min="1" />
                          </div>
                          {extraPaymentAmount && (
                            <p className="text-gold text-xs font-medium mb-3">
                              Applying ₹{Math.min(parseFloat(extraPaymentAmount || 0), remainingBalance + pendingInterest + pendingPenalty + currentMonthInterest).toLocaleString()}
                              {parseFloat(extraPaymentAmount || 0) > (remainingBalance + pendingInterest + pendingPenalty + currentMonthInterest) && (
                                <span className="text-orange-400"> (capped at total due)</span>
                              )}
                            </p>
                          )}
                          <button onClick={payExtra} className={primaryAction}>Confirm payment</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="bg-emerald-500/[0.06] border border-emerald-500/25 rounded-3xl p-6 text-center">
                  <CheckCircle2 className="w-9 h-9 mx-auto mb-3 text-emerald-400" />
                  <h3 className="font-display text-lg font-bold text-white mb-1">Loan cleared</h3>
                  <p className="text-gray-400 text-sm mb-4">You've paid this loan off. Review your stats, or start over.</p>
                  {gameStateHistory.length > 0 && (
                    <button onClick={undoLastAction} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-gray-300 border border-white/[0.12] hover:bg-white/[0.06] transition-colors cursor-pointer">
                      <Undo2 className="w-4 h-4" /> Undo last action
                    </button>
                  )}
                </div>
              )}
            </aside>

            {/* ===== RIGHT: ANALYTICS ===== */}
            <div className="flex flex-col gap-6 min-w-0">
              {/* Metric tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <MetricTile label="Principal paid" value={`₹${Math.round(totalPrincipalPaid).toLocaleString()}`} tone="green" />
                <MetricTile label="Interest paid" value={`₹${Math.round(totalInterestPaid).toLocaleString()}`} tone="orange" />
                <MetricTile label="Penalty paid" value={`₹${Math.round(totalPenaltyPaid).toLocaleString()}`} tone="red" />
                <MetricTile label="Interest due" value={`₹${Math.round(currentMonthInterest + pendingInterest).toLocaleString()}`} tone="orange" sub={`${pendingInterest > 0 ? `₹${Math.round(pendingInterest)} pending + ` : ''}₹${Math.round(currentMonthInterest)} now`} />
                <MetricTile label="Penalty due" value={`₹${Math.round(currentPenaltyDue).toLocaleString()}`} tone="red" sub="Late charges" />
                <MetricTile label="Extra paid" value={`₹${Math.round(totalInterestPaid + totalPenaltyPaid).toLocaleString()}`} tone="purple" sub="Interest + penalty" />
              </div>

              {/* Timeline */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <h3 className="font-display text-base font-bold text-white mb-5">Timeline</h3>
                <div className="flex overflow-x-auto gap-3 pb-2">
                  {Array.from({ length: parseInt(duration) }, (_, i) => {
                    const isDelayed = loanHistory.find((item) => item.month === i + 1 && item.action == 'Delayed Payment');
                    const isPast = i + 1 < currentMonth;
                    const isCurrent = i + 1 === currentMonth;
                    return (
                      <div key={i} className="flex flex-col items-center min-w-[52px]">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold mb-1.5 transition-all duration-300 ${
                          isPast
                            ? isDelayed
                              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-black'
                              : 'bg-gradient-to-br from-gold to-gold-dark text-black'
                            : isCurrent
                            ? 'bg-gradient-to-br from-gold to-amber-300 text-black ring-2 ring-gold/40 animate-pulse'
                            : 'bg-white/[0.04] text-gray-600 border border-white/[0.1]'
                        }`}>
                          {i + 1}
                        </div>
                        <span className={`text-[10px] ${isCurrent ? 'text-gold font-semibold' : 'text-gray-600'}`}>M{i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Balance chart + score */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="font-display text-base font-bold text-white mb-5">Balance over time</h3>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={balanceHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip formatter={(value) => [`₹${Math.round(value).toLocaleString()}`, 'Balance']} contentStyle={chartTooltipStyle} />
                        <Line type="monotone" dataKey="balance" stroke="#FFD700" strokeWidth={2.5} dot={{ fill: '#FFD700', r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex flex-col">
                  <h3 className="font-display text-base font-bold text-white mb-2">Credit score</h3>
                  <div className="flex-1 flex items-center justify-center py-2">
                    <ScoreGauge score={creditScore} color={getCreditScoreColor(creditScore)} label={getCreditScoreLabel(creditScore)} />
                  </div>
                  <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl bg-amber-400/[0.06] border border-amber-400/15 text-amber-300/90 text-xs">
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>Pay on time to improve your credit score.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 right-5 z-50 max-w-sm flex items-start gap-3 px-5 py-4 rounded-2xl bg-[#141414] border border-gold/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          >
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold" />
            <p className="text-gray-200 text-sm leading-relaxed">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoanSimulator;
