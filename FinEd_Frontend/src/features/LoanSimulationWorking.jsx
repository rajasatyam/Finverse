import React from 'react';
import SimulatorGuide from '../components/SimulatorGuide';
import {
  Target,
  Calculator,
  CreditCard,
  BarChart3,
  TrendingUp,
  ClipboardList,
  GraduationCap,
  Settings,
  Brain,
  Landmark,
  Lightbulb,
  Wallet,
  Zap,
  TrendingDown,
} from 'lucide-react';

const sections = [
  {
    id: 'overview',
    title: 'Simulation Overview',
    icon: Target,
    content: `This loan simulator teaches real-world loan mechanics through an interactive experience. Users learn about EMI calculations, interest accumulation, payment strategies, and credit score impacts by making actual financial decisions in a safe environment.

The simulation follows authentic loan operations: loan setup → monthly EMI cycle → payment decisions → consequences. This mirrors how real loans work with monthly payment obligations and the flexibility to pay early or delay payments.`
  },
  {
    id: 'emi-system',
    title: 'EMI Calculation System',
    icon: Calculator,
    content: `The simulator uses the standard EMI formula:
EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]

Where:
- P = Principal loan amount
- R = Monthly interest rate (Annual rate ÷ 12)
- N = Number of months

Key Learning: Users see how loan amount, interest rate, and duration affect monthly payments. A higher interest rate or longer duration dramatically changes the total cost of borrowing.

The EMI remains constant throughout the loan term, but the proportion of interest vs principal changes each month.`
  },
  {
    id: 'payment-options',
    title: 'Payment Options & Consequences',
    icon: CreditCard,
    content: `Pay EMI (On-time Payment):
- Maintains good standing
- Reduces principal balance
- Positive credit score impact (+2 points)
- No penalties or extra charges
- Follows normal amortization schedule

Delay Payment:
- Adds 10% penalty on EMI amount
- Adds 50% extra interest on current month
- Severe credit score damage (-15 points)
- Creates pending amounts for next month
- Extends loan duration if balance remains

Custom Payment:
- Allows paying any amount (less than, equal to, or more than EMI)
- Larger payments reduce principal faster
- Smaller payments may not cover full interest
- Positive credit score impact (+5 points for above EMI)
- Demonstrates prepayment benefits`
  },
  {
    id: 'interest-mechanics',
    title: 'Interest & Penalty Mechanics',
    icon: BarChart3,
    content: `Monthly Interest Calculation:
Monthly Interest = Remaining Balance × (Annual Rate ÷ 12)

Interest Priority: Interest is always paid first before reducing principal balance.

Penalty Structure:
- 10% penalty on EMI amount for delayed payments
- 50% additional interest for the delayed month
- Penalties accumulate if not paid immediately

Pending Amounts: Unpaid interest and penalties carry forward to next month and must be cleared before new principal reduction.

Key Insight: The simulator shows how delays compound costs exponentially and extend loan duration beyond the original term.`
  },
  {
    id: 'credit-score',
    title: 'Credit Score Impact',
    icon: TrendingUp,
    content: `The simulation models realistic credit score factors:

Payment Behavior:
- On-time EMI payments: +2 points
- Custom payments above EMI: +5 points
- Delayed payments: -15 points (severe impact)
- Payment history is the most critical factor

Score Ranges:
- 750-850: Excellent (Green) - Best loan rates
- 650-749: Good (Yellow) - Standard rates
- 300-649: Poor (Red) - High rates or loan rejection

Recovery: Credit score improvements are gradual, while damage from missed payments is immediate and severe. This teaches the importance of consistent payment behavior.`
  },
  {
    id: 'key-metrics',
    title: 'Key Metrics Explained',
    icon: ClipboardList,
    content: `Remaining Balance: Outstanding principal amount still owed

Principal Paid: Portion of loan amount repaid (builds equity)

Interest Paid: Total interest charges paid (cost of borrowing)

Penalty Paid: Additional charges from delayed payments

Interest Due This Month: Current month interest + any pending interest

Penalty Due This Month: Accumulated penalties from delays

Total Due This Month: All charges that must be paid this month

Extra Paid: Total of all interest and penalties (true cost beyond principal)

The dashboard provides real-time visibility into loan amortization and helps users understand the true cost of borrowing.`
  },
  {
    id: 'scenarios',
    title: 'Learning Scenarios',
    icon: GraduationCap,
    content: `Scenario 1: Disciplined Borrower
- Pay EMI consistently every month
- Watch balance reduce systematically
- Maintain excellent credit score
- Finish loan exactly on schedule

Scenario 2: Aggressive Prepayment
- Make larger payments when possible
- See dramatic interest savings
- Finish loan early
- Build excellent credit history

Scenario 3: Payment Delays
- Skip or delay several payments
- Watch penalties accumulate
- See loan duration extend beyond original term
- Experience credit score damage

Scenario 4: Recovery Strategy
- Start with poor payment habits
- Implement consistent payment strategy
- Watch credit score gradually recover
- Learn optimal payment timing

Each scenario demonstrates different borrowing behaviors and their long-term financial consequences.`
  },
  {
    id: 'features',
    title: 'Simulator Features',
    icon: Settings,
    content: `Interactive Elements:
- Real-time EMI calculations
- Dynamic balance tracking
- Immediate credit score feedback
- Timeline visualization of payments

Educational Tools:
- Payment history timeline with color coding
- Balance reduction line chart
- Credit score progress bar
- Total cost breakdown

Safety Features:
- Undo function for learning from mistakes
- Reset option to try different scenarios
- Clear month-by-month progression
- Detailed payment breakdowns

Gamification:
- Month-by-month progression tracking
- Achievement-style credit improvements
- Visual feedback for payment decisions
- Historical action tracking

The interface makes loan management concepts tangible while maintaining mathematical accuracy.`
  },
  {
    id: 'educational-value',
    title: 'Educational Value',
    icon: Brain,
    content: `Core Learning Objectives:

1. EMI Understanding: How monthly payments are calculated and structured
2. Interest vs Principal: How payment allocation changes over time
3. Prepayment Benefits: Impact of paying more than minimum EMI
4. Delay Consequences: Real cost of missed or late payments
5. Credit Score Management: How payment behavior affects creditworthiness
6. Total Cost Awareness: Understanding the true cost of borrowing

Why Simulation Works:
- Safe environment to experience costly mistakes
- Immediate feedback on payment decisions
- Visual representation of abstract financial concepts
- Hands-on practice with loan management
- Clear cause-and-effect relationships

Real-World Application: The simulator helps users develop intuition for loan management before taking actual loans, understand the importance of payment discipline, and make informed decisions about prepayment vs other financial priorities.`
  }
];

const stats = [
  { icon: Landmark, value: 'EMI Based', label: 'Monthly Payments' },
  { icon: BarChart3, value: 'Real-time', label: 'Interest Calculations' },
  { icon: TrendingUp, value: 'Dynamic', label: 'Credit Score Updates' },
  { icon: Lightbulb, value: 'Interactive', label: 'Learning Experience' },
];

const howToUse = {
  title: 'How to use the loan simulator',
  steps: [
    {
      title: 'Setup',
      text: 'Enter your loan amount, annual interest rate, and duration in months. Try realistic values like ₹100,000 loan at 12% APR for 24 months.',
    },
    {
      title: 'View EMI',
      text: 'See your calculated monthly EMI and understand how much you need to pay each month to clear the loan on schedule.',
    },
    {
      title: 'Make Payment Decisions',
      text: 'Each month, choose to pay EMI on time, delay payment, or pay a custom amount. See immediate impacts on balance and credit score.',
    },
    {
      title: 'Track Progress',
      text: 'Monitor your loan balance, total interest paid, and credit score changes. Use undo to experiment with different strategies safely.',
    },
  ],
};

const insights = [
  {
    icon: Wallet,
    title: 'EMI Composition',
    text: 'Early payments contain more interest, later payments more principal. See how amortization works and why prepayment saves significantly.',
  },
  {
    icon: Zap,
    title: 'Prepayment Power',
    text: 'Discover how paying extra principal early can save thousands in interest and shorten loan duration dramatically.',
  },
  {
    icon: TrendingDown,
    title: 'Delay Costs',
    text: 'Learn the true cost of missed payments: penalties, extra interest, extended duration, and severe credit score damage.',
  },
  {
    icon: Target,
    title: 'Payment Strategy',
    text: 'Develop skills in balancing loan payments with cash flow needs. Practice making informed borrowing and repayment decisions.',
  },
];

const example = {
  title: 'EMI breakdown example',
  scenario: 'Sample loan: ₹100,000 at 12% for 12 months',
  items: [
    { label: 'Monthly EMI', value: '₹8,885' },
    { label: 'Total Payments', value: '₹1,06,620' },
    { label: 'Total Interest', value: '₹6,620' },
    { label: 'Interest Rate', value: '6.62%' },
  ],
  note: 'If you delay payments twice, penalties could add ₹3,000+ to your total cost!',
};

const LoanSimulationExplanation = () => (
  <SimulatorGuide
    title="How the Loan"
    titleAccent="Simulator Works"
    subtitle="A comprehensive guide to understanding loan mechanics and EMI management inside the simulator."
    backPath="/creditOrLoan"
    ctaPath="/loan"
    ctaLabel="Start Loan Simulation"
    stats={stats}
    sections={sections}
    howToUse={howToUse}
    insights={insights}
    example={example}
    footerNote="This simulator is designed for educational purposes to help users understand loan mechanics and develop better financial literacy skills for borrowing decisions."
  />
);

export default LoanSimulationExplanation;
