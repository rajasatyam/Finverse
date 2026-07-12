import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Coins,
  CreditCard,
  Info,
  Lightbulb,
  ReceiptText,
  RotateCcw,
  Undo2,
  X,
  ShoppingBag,
} from 'lucide-react';

const chartTooltipStyle = {
  backgroundColor: '#141414',
  border: '1px solid rgba(255,215,0,0.25)',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '13px',
};

// Small analytics tile used across the right-hand panel
const MetricTile = ({ label, value, tone = 'white', color, sub }) => {
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
      <div className={`font-display text-lg sm:text-xl font-bold ${color ? '' : tones[tone]}`} style={color ? { color } : undefined}>
        {value}
      </div>
      {sub && <div className="text-gray-600 text-[11px] mt-1 leading-snug">{sub}</div>}
    </div>
  );
};

// Semicircular credit-score gauge (300–850)
const ScoreGauge = ({ score, color, label }) => {
  const pct = Math.max(0, Math.min(1, (score - 300) / 550));
  const radius = 80;
  const circ = Math.PI * radius; // half circle
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

const CreditCardSimulator = () => {
  const [creditLimit, setCreditLimit] = useState('50000');
  const [interestRate, setInterestRate] = useState('36');
  const [minimumPaymentPercent, setMinimumPaymentPercent] = useState('5');
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentSpending, setCurrentSpending] = useState(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState(0);
  const [interestDue, setInterestDue] = useState(0);
  const [totalPaymentsMade, setTotalPaymentsMade] = useState(0);
  const [totalChargesMade, setTotalChargesMade] = useState(0);
  const [totalPenalties, setTotalPenalties] = useState(0);
  const [creditScore, setCreditScore] = useState(700);
  const [notification, setNotification] = useState('');
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomPaymentModal, setShowCustomPaymentModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [gameStateHistory, setGameStateHistory] = useState([]);
  const [billGenerated, setBillGenerated] = useState(false);
  const [currentBillAmount, setCurrentBillAmount] = useState(0);
  const [phase, setPhase] = useState('spending');

  const monthlyInterestRate = parseFloat(interestRate || 0) / 12 / 100;
  const totalOutstanding = currentBalance + currentSpending;
  const minimumPayment = billGenerated && currentBillAmount > 0
    ? Math.max(currentBillAmount * (parseFloat(minimumPaymentPercent) / 100), 0)
    : Math.max(totalOutstanding * (parseFloat(minimumPaymentPercent) / 100), 0);
  const availableCredit = parseFloat(creditLimit || 0) - totalOutstanding;
  const utilizationRatio = creditLimit > 0 ? (totalOutstanding / parseFloat(creditLimit)) * 100 : 0;

  const saveCurrentState = () => {
    const currentState = {
      currentMonth,
      currentBalance,
      currentSpending,
      totalInterestPaid,
      interestDue,
      totalPaymentsMade,
      totalChargesMade,
      totalPenalties,
      creditScore,
      balanceHistory: [...balanceHistory],
      paymentHistory: [...paymentHistory],
      billGenerated,
      currentBillAmount,
      phase
    };
    setGameStateHistory(prev => [...prev, currentState]);
  };

  const undoLastAction = () => {
    if (gameStateHistory.length === 0) {
      setNotification('No actions to undo!');
      return;
    }

    const lastState = gameStateHistory[gameStateHistory.length - 1];

    setCurrentMonth(lastState.currentMonth);
    setCurrentBalance(lastState.currentBalance);
    setCurrentSpending(lastState.currentSpending);
    setTotalInterestPaid(lastState.totalInterestPaid);
    setInterestDue(lastState.interestDue);
    setTotalPaymentsMade(lastState.totalPaymentsMade);
    setTotalChargesMade(lastState.totalChargesMade);
    setTotalPenalties(lastState.totalPenalties);
    setCreditScore(lastState.creditScore);
    setBalanceHistory(lastState.balanceHistory);
    setPaymentHistory(lastState.paymentHistory);
    setBillGenerated(lastState.billGenerated);
    setCurrentBillAmount(lastState.currentBillAmount);
    setPhase(lastState.phase);

    setGameStateHistory(prev => prev.slice(0, -1));
    setNotification(`Last action undone! Back to Month ${lastState.currentMonth}.`);
  };

  const startSimulation = () => {
    if (!creditLimit || !interestRate) {
      setNotification('Please fill all fields to start simulation');
      return;
    }

    const limit = parseFloat(creditLimit);
    const rate = parseFloat(interestRate);
    const minPercent = parseFloat(minimumPaymentPercent);

    if (limit <= 0 || rate < 0 || minPercent <= 0) {
      setNotification('Please enter valid positive values');
      return;
    }

    setCurrentBalance(0);
    setCurrentSpending(0);
    setTotalInterestPaid(0);
    setInterestDue(0);
    setTotalPaymentsMade(0);
    setTotalChargesMade(0);
    setTotalPenalties(0);
    setCurrentMonth(1);
    setCreditScore(700);
    setIsSimulationStarted(true);
    setCustomAmount('');
    setShowCustomPaymentModal(false);
    setShowChargeModal(false);
    setBillGenerated(false);
    setCurrentBillAmount(0);
    setPhase('spending');
    setNotification('Credit card simulation started! Start by making purchases during your spending phase.');

    const initialHistory = [{ month: 0, balance: 0, creditScore: 700 }];
    setBalanceHistory(initialHistory);
    setPaymentHistory([]);
    setGameStateHistory([]);
  };

  const resetSimulation = () => {
    setIsSimulationStarted(false);
    setCreditLimit('50000');
    setInterestRate('36');
    setMinimumPaymentPercent('5');
    setCurrentMonth(1);
    setCurrentBalance(0);
    setCurrentSpending(0);
    setTotalInterestPaid(0);
    setInterestDue(0);
    setTotalPaymentsMade(0);
    setTotalChargesMade(0);
    setTotalPenalties(0);
    setCreditScore(700);
    setNotification('');
    setBalanceHistory([]);
    setPaymentHistory([]);
    setCustomAmount('');
    setShowCustomPaymentModal(false);
    setShowChargeModal(false);
    setGameStateHistory([]);
    setBillGenerated(false);
    setCurrentBillAmount(0);
    setPhase('spending');
  };

  const generateBill = () => {
    if (currentSpending === 0 && currentBalance === 0) {
      setNotification('No spending or balance to generate bill for!');
      return;
    }

    saveCurrentState();

    // Only calculate interest if there's a previous outstanding balance
    const lastState = gameStateHistory[gameStateHistory.length - 1];
    let minus = 0;
    if (lastState.totalPaymentsMade == totalPaymentsMade) {
      minus = 500;
    }
    const interestCharge = currentBalance > 0 ? (currentBalance - minus) * monthlyInterestRate : 0;
    const totalBill = currentBalance + interestCharge + currentSpending;

    setCurrentBillAmount(totalBill);

    setBillGenerated(true);
    setPhase('payment');

    setPaymentHistory(prev => [...prev, {
      month: currentMonth,
      action: 'Bill Generated',
      amount: totalBill,
      balance: totalBill,
      interest: interestCharge
    }]);

    setNotification(`Bill generated for Month ${currentMonth}! Total Due: ₹${Math.round(totalBill)}${interestCharge > 0 ? `, Interest: ₹${Math.round(interestCharge)}` : ''}`);
  };

  const makePayment = (paymentAmount, paymentType) => {
    if (!billGenerated || currentBillAmount <= 0) {
      setNotification('No bill to pay! Generate bill first.');
      return;
    }

    saveCurrentState();

    const actualPayment = Math.min(paymentAmount, currentBillAmount);

    // Correct interest tracking
    setTotalInterestPaid(prev => prev + interestDue);

    const remainingBalance = currentBillAmount - actualPayment;

    // Carry forward unpaid interest
    const interest = remainingBalance > 0 ? remainingBalance * monthlyInterestRate : 0;
    setInterestDue(remainingBalance > 0 ? remainingBalance * monthlyInterestRate : 0);

    setCurrentBalance(remainingBalance);
    setCurrentSpending(0);
    setCurrentBillAmount(prev => prev + interest - actualPayment);
    setTotalPaymentsMade(prev => prev + actualPayment);
    setBillGenerated(false);
    setPhase('spending');

    // Credit score update
    if (paymentType === 'full') {
      setCreditScore(prev => Math.min(850, prev + 5));
    } else if (paymentType === 'minimum') {
      setCreditScore(prev => Math.max(300, prev - 2));
    } else {
      setCreditScore(prev => Math.min(850, prev + 2));
    }

    const newHistoryPoint = {
      month: currentMonth,
      balance: remainingBalance,
      creditScore
    };
    setBalanceHistory(prev => [...prev, newHistoryPoint]);

    setPaymentHistory(prev => [...prev, {
      month: currentMonth,
      action: `${paymentType} Payment`,
      amount: actualPayment,
      balance: remainingBalance
    }]);

    const nextMonth = currentMonth + 1;
    setCurrentMonth(nextMonth);

    if (remainingBalance > 0) {
      setNotification(`Payment of ₹${Math.round(actualPayment)} made! Remaining balance: ₹${Math.round(remainingBalance)}. Now in Month ${nextMonth} spending phase. Interest will accrue on unpaid balance.`);
    } else {
      setNotification(`Payment of ₹${Math.round(actualPayment)} made! Balance cleared! Now in Month ${nextMonth} spending phase.`);
    }
  };

  const makeCharge = () => {
    if (phase !== 'spending') {
      setNotification('Cannot make purchases during payment phase! Complete your payment first.');
      return;
    }

    if (!customAmount || parseFloat(customAmount) <= 0) {
      setNotification('Please enter a valid purchase amount');
      return;
    }

    const chargeAmount = parseFloat(customAmount);

    if (chargeAmount > availableCredit) {
      setNotification(`Purchase declined! Available credit: ₹${Math.round(availableCredit)}`);
      return;
    }

    saveCurrentState();

    const newSpending = currentSpending + chargeAmount;
    const newTotalOutstanding = currentBalance + newSpending;

    setCurrentSpending(newSpending);
    setTotalChargesMade(prev => prev + chargeAmount);

    const newUtilization = (newTotalOutstanding / parseFloat(creditLimit)) * 100;
    if (newUtilization > 80) {
      setCreditScore(prev => Math.max(300, prev - 8));
    } else if (newUtilization > 50) {
      setCreditScore(prev => Math.max(300, prev - 3));
    }

    setPaymentHistory(prev => [...prev, {
      month: currentMonth,
      action: 'Purchase Made',
      amount: -chargeAmount,
      balance: newTotalOutstanding
    }]);

    setCustomAmount('');
    setShowChargeModal(false);
    setNotification(`Purchase of ₹${Math.round(chargeAmount)} made! Current spending: ₹${Math.round(newSpending)}, Total outstanding: ₹${Math.round(newTotalOutstanding)}`);
  };

  const skipPayment = () => {
    if (!billGenerated || currentBillAmount <= 0) {
      setNotification('No bill to skip payment on! Generate bill first.');
      return;
    }

    saveCurrentState();

    const latePenalty = 500;
    const interestOnBill = currentBillAmount * monthlyInterestRate;
    const newBalance = currentBillAmount;

    setCurrentBalance(newBalance + latePenalty);
    setInterestDue(prev => prev + interestOnBill);
    setCurrentSpending(0);
    setCurrentBillAmount(prev => prev + interestOnBill + latePenalty);
    setTotalPenalties(prev => prev + latePenalty);
    setBillGenerated(false);
    setPhase('spending');

    const newCreditScore = Math.max(300, creditScore - 25);
    setCreditScore(newCreditScore);

    const newHistoryPoint = {
      month: currentMonth,
      balance: newBalance + interestOnBill,
      creditScore: newCreditScore
    };
    setBalanceHistory(prev => [...prev, newHistoryPoint]);
    setPaymentHistory(prev => [...prev, {
      month: currentMonth,
      action: 'Payment Missed (Penalty + Interest)',
      amount: -(latePenalty + interestOnBill),
      balance: newBalance + interestOnBill
    }]);

    const nextMonth = currentMonth + 1;
    setCurrentMonth(nextMonth);

    setNotification(`Payment missed! Penalty: ₹${Math.round(latePenalty)}, Additional interest: ₹${Math.round(interestOnBill)}. New balance: ₹${Math.round(newBalance + interestOnBill)}. Now in Month ${nextMonth}.`);
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

  const getUtilizationColor = (ratio) => {
    if (ratio >= 80) return '#EF4444';
    if (ratio >= 50) return '#F59E0B';
    if (ratio >= 30) return '#10B981';
    return '#3B82F6';
  };

  const pieData = [
    { name: 'Available Credit', value: Math.max(0, availableCredit), color: '#10B981' },
    { name: 'Used Credit', value: totalOutstanding, color: '#DC2626' }
  ];

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.12] text-white placeholder-gray-600 text-[15px] outline-none transition-all duration-200 focus:border-gold/60 focus:ring-2 focus:ring-gold/15';

  // ---- Action button styles (used in the control rail) ----
  const primaryAction =
    'w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-black bg-gradient-to-br from-gold to-gold-dark transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,215,0,0.35)] cursor-pointer';
  const ghostAction =
    'w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border';

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
              <CreditCard className="w-4 h-4" />
            </span>
            <span className="font-display text-base font-bold text-white">Credit Card Simulator</span>
          </div>

          {isSimulationStarted ? (
            <button
              onClick={resetSimulation}
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm font-medium transition-colors cursor-pointer"
            >
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
            {/* Explainer */}
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">Set the terms</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 mb-4 leading-tight">
                Configure your card,<br />then live the cycle.
              </h1>
              <p className="text-gray-400 text-[15px] leading-relaxed mb-6">
                Pick a limit, an APR, and a minimum-payment rate. You'll spend, get a statement,
                and decide how to pay — watching interest and your score move in real time.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  ['Spend', 'Make purchases up to your limit'],
                  ['Bill', 'Generate a statement with interest'],
                  ['Pay', 'Minimum, full, custom — or skip'],
                ].map(([k, v], i) => (
                  <li key={k} className="flex items-center gap-3 text-sm">
                    <span className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 text-gold flex items-center justify-center font-bold text-xs flex-shrink-0">{i + 1}</span>
                    <span className="text-white font-semibold">{k}</span>
                    <span className="text-gray-500">— {v}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-7 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col gap-5">
                <div>
                  <label htmlFor="credit-limit" className="block text-gray-300 text-sm font-medium mb-1.5">Credit Limit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">₹</span>
                    <input id="credit-limit" type="number" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} className={`${inputClass} pl-9`} placeholder="50000" />
                  </div>
                </div>
                <div>
                  <label htmlFor="apr" className="block text-gray-300 text-sm font-medium mb-1.5">Annual Interest Rate (APR)</label>
                  <div className="relative">
                    <input id="apr" type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className={`${inputClass} pr-9`} placeholder="18" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">%</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="min-payment" className="block text-gray-300 text-sm font-medium mb-1.5">Minimum Payment Percentage</label>
                  <div className="relative">
                    <input id="min-payment" type="number" step="0.1" value={minimumPaymentPercent} onChange={(e) => setMinimumPaymentPercent(e.target.value)} className={`${inputClass} pr-9`} placeholder="5" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">%</span>
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
              {/* Phase + month */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Billing cycle</div>
                    <div className="font-display text-2xl font-bold text-white mt-0.5">Month {currentMonth}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                    phase === 'spending'
                      ? 'bg-amber-400/10 text-amber-400 border border-amber-400/25'
                      : 'bg-violet-400/10 text-violet-300 border border-violet-400/25'
                  }`}>
                    {phase === 'spending' ? 'Spending' : 'Payment'}
                  </span>
                </div>

                {/* Hero stat: whatever matters now */}
                {phase === 'payment' && billGenerated ? (
                  <div className="rounded-2xl bg-red-500/[0.06] border border-red-500/20 p-5">
                    <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total due now</div>
                    <div className="font-display text-4xl font-bold text-red-400">₹{Math.round(currentBillAmount).toLocaleString()}</div>
                    <div className="text-gray-500 text-xs mt-1.5">Minimum ₹{Math.round(minimumPayment).toLocaleString()} · {minimumPaymentPercent}% of bill</div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5">
                    <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total outstanding</div>
                    <div className="font-display text-4xl font-bold text-white">₹{Math.round(totalOutstanding).toLocaleString()}</div>
                    <div className="text-gray-500 text-xs mt-1.5">₹{Math.round(availableCredit).toLocaleString()} available of ₹{parseFloat(creditLimit).toLocaleString()}</div>
                    {/* utilization bar */}
                    <div className="mt-3 h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, utilizationRatio)}%`, backgroundColor: getUtilizationColor(utilizationRatio) }} />
                    </div>
                    <div className="text-[11px] mt-1.5" style={{ color: getUtilizationColor(utilizationRatio) }}>{utilizationRatio.toFixed(1)}% utilization</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6">
                <div className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-4">
                  {phase === 'spending' ? 'What will you do?' : 'How will you pay?'}
                </div>
                <div className="flex flex-col gap-2.5">
                  {phase === 'spending' && (
                    <>
                      <button onClick={() => setShowChargeModal(true)} className={primaryAction}>
                        <ShoppingBag className="w-4 h-4" /> Make a purchase
                      </button>
                      {(currentSpending > 0 || currentBalance > 0) && (
                        <button onClick={generateBill} className={`${ghostAction} bg-white/[0.03] border-violet-500/30 text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/60`}>
                          <ReceiptText className="w-4 h-4" /> Generate bill
                        </button>
                      )}
                    </>
                  )}

                  {phase === 'payment' && billGenerated && (
                    <>
                      <button onClick={() => makePayment(currentBillAmount, 'full')} className={primaryAction}>
                        <CheckCircle2 className="w-4 h-4" /> Pay full (₹{Math.round(currentBillAmount).toLocaleString()})
                      </button>
                      <button onClick={() => makePayment(minimumPayment, 'minimum')} className={`${ghostAction} bg-white/[0.03] border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/60`}>
                        <Coins className="w-4 h-4" /> Pay minimum (₹{Math.round(minimumPayment).toLocaleString()})
                      </button>
                      <button onClick={() => setShowCustomPaymentModal(true)} className={`${ghostAction} bg-white/[0.03] border-white/[0.12] text-gray-200 hover:bg-white/[0.06]`}>
                        <Banknote className="w-4 h-4" /> Pay custom amount
                      </button>
                      <button onClick={skipPayment} className={`${ghostAction} bg-white/[0.03] border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60`}>
                        <AlertTriangle className="w-4 h-4" /> Skip payment
                      </button>
                    </>
                  )}

                  {gameStateHistory.length > 0 && (
                    <button onClick={undoLastAction} className="mt-1 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-gray-400 hover:text-white border border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300 cursor-pointer">
                      <Undo2 className="w-4 h-4" /> Undo last action
                    </button>
                  )}
                </div>

                {/* Inline purchase panel */}
                <AnimatePresence>
                  {showChargeModal && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <div className="mt-4 p-4 rounded-2xl bg-gold/[0.04] border border-gold/25">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-bold text-sm">Make a purchase</h4>
                          <button onClick={() => { setShowChargeModal(false); setCustomAmount(''); }} className="text-gray-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                        </div>
                        <p className="text-gray-500 text-xs mb-3">Available credit: ₹{Math.round(availableCredit).toLocaleString()}</p>
                        <div className="relative mb-3">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">₹</span>
                          <input type="number" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} className={`${inputClass} pl-9`} placeholder="Amount" min="1" max={availableCredit} />
                        </div>
                        <button onClick={makeCharge} className={primaryAction}>Confirm purchase</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Inline custom payment panel */}
                <AnimatePresence>
                  {showCustomPaymentModal && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <div className="mt-4 p-4 rounded-2xl bg-violet-500/[0.05] border border-violet-500/25">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-bold text-sm">Custom payment</h4>
                          <button onClick={() => { setShowCustomPaymentModal(false); setCustomAmount(''); }} className="text-gray-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                        </div>
                        <p className="text-gray-500 text-xs mb-3">Pay ₹1 – ₹{Math.round(currentBillAmount).toLocaleString()}</p>
                        <div className="relative mb-3">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">₹</span>
                          <input type="number" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} className={`${inputClass} pl-9 focus:border-violet-400/60 focus:ring-violet-400/15`} placeholder="Amount" min="1" max={currentBillAmount} />
                        </div>
                        <button
                          onClick={() => {
                            const amount = parseFloat(customAmount);
                            if (amount > 0 && amount <= currentBillAmount) {
                              makePayment(amount, 'custom');
                              setShowCustomPaymentModal(false);
                              setCustomAmount('');
                            } else {
                              setNotification('Please enter a valid payment amount');
                            }
                          }}
                          className={primaryAction}
                        >
                          Make payment
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-4 text-gray-600 text-[11px] leading-relaxed">
                  {phase === 'spending'
                    ? (currentSpending > 0 || currentBalance > 0 ? 'Keep spending or generate your statement to move to the payment phase.' : 'Start by making a purchase with your card.')
                    : 'Choose a payment option to close out this statement.'}
                </p>
              </div>
            </aside>

            {/* ===== RIGHT: ANALYTICS ===== */}
            <div className="flex flex-col gap-6 min-w-0">
              {/* Metric tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <MetricTile label="Credit limit" value={`₹${parseFloat(creditLimit).toLocaleString()}`} tone="blue" />
                <MetricTile label="Outstanding" value={`₹${Math.round(currentBalance).toLocaleString()}`} tone="red" sub="From previous bills" />
                <MetricTile label="This cycle" value={`₹${Math.round(currentSpending).toLocaleString()}`} tone="orange" sub="New spending" />
                <MetricTile label="Interest paid" value={`₹${Math.round(totalInterestPaid).toLocaleString()}`} tone="red" sub="Already charged" />
                <MetricTile label="Penalties" value={`₹${Math.round(totalPenalties).toLocaleString()}`} tone="red" sub="Late fees" />
                <MetricTile label="Payments made" value={`₹${Math.round(totalPaymentsMade).toLocaleString()}`} tone="green" />
              </div>

              {/* Score gauge + utilization donut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex flex-col">
                  <h3 className="font-display text-base font-bold text-white mb-2">Credit score</h3>
                  <div className="flex-1 flex items-center justify-center py-2">
                    <ScoreGauge score={creditScore} color={getCreditScoreColor(creditScore)} label={getCreditScoreLabel(creditScore)} />
                  </div>
                  <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl bg-amber-400/[0.06] border border-amber-400/15 text-amber-300/90 text-xs">
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>Pay in full and keep utilization under 30% to climb.</span>
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex flex-col">
                  <h3 className="font-display text-base font-bold text-white mb-2">Credit utilization</h3>
                  <div className="flex-1 min-h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                          {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${Math.round(value).toLocaleString()}`} contentStyle={chartTooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center">
                    <span className="font-display text-2xl font-bold" style={{ color: getUtilizationColor(utilizationRatio) }}>{utilizationRatio.toFixed(1)}%</span>
                    <span className="text-gray-500 text-xs ml-2">used</span>
                  </div>
                </div>
              </div>

              {/* Balance chart */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <h3 className="font-display text-base font-bold text-white mb-5">Balance over time</h3>
                <div className="h-[260px]">
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

              {/* Transaction history */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <h3 className="font-display text-base font-bold text-white mb-5">Transaction history</h3>
                <div className="max-h-[280px] overflow-y-auto pr-1">
                  {paymentHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <ReceiptText className="w-8 h-8 mx-auto mb-3 text-gray-700" />
                      <p className="text-gray-600 text-sm">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {paymentHistory.slice().reverse().map((entry, index) => (
                        <div key={index} className={`flex justify-between items-center gap-3 px-4 py-3 rounded-xl text-sm ${entry.action.includes('Bill') ? 'bg-violet-500/[0.08] border border-violet-500/15' : 'bg-white/[0.03] border border-white/[0.06]'}`}>
                          <span className="text-gray-300">Month {entry.month}: {entry.action}</span>
                          <span className={`font-semibold whitespace-nowrap ${entry.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {entry.amount > 0 ? '-' : '+'}₹{Math.abs(entry.amount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
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

export default CreditCardSimulator;
