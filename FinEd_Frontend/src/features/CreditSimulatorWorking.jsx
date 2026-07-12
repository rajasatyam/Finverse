import React from 'react';
import SimulatorGuide from '../components/SimulatorGuide';
import {
  Target,
  RefreshCw,
  BarChart3,
  CreditCard,
  TrendingUp,
  ClipboardList,
  GraduationCap,
  Settings,
  Brain,
  Gamepad2,
  Lightbulb,
  Wallet,
  TrendingDown,
  Zap,
} from 'lucide-react';

const sections = [
  {
    id: 'overview',
    title: 'Simulation Overview',
    icon: Target,
    content: `This credit card simulator teaches real-world credit card mechanics through an interactive game-like experience. Users learn about billing cycles, interest calculations, payment strategies, and credit score impacts by making actual financial decisions in a safe environment.

The simulation follows authentic credit card operations: spending phase → bill generation → payment phase → new cycle. This mirrors how real credit cards work with monthly billing cycles.`
  },
  {
    id: 'phases',
    title: 'Two-Phase System',
    icon: RefreshCw,
    content: `The simulator operates in two distinct phases that mirror real credit card usage:

Spending Phase: Users make purchases throughout the month. They can buy items up to their available credit limit. Multiple purchases can be made before generating a bill.

Payment Phase: Once the bill is generated, users must choose how to pay: minimum payment, full payment, custom amount, or skip payment. Each choice has different consequences for interest charges and credit score.

This phase system teaches the importance of timing in credit card management and how billing cycles work.`
  },
  {
    id: 'interest',
    title: 'Interest Calculation',
    icon: BarChart3,
    content: `Interest is calculated using the standard monthly rate formula:
Monthly Rate = Annual Rate ÷ 12

When Interest Applies:
- Only on unpaid balances carried from previous months
- NOT on new purchases within the same billing cycle (grace period)
- Compounds monthly if balances remain unpaid

Key Learning: The simulation shows how interest-free periods work for new purchases and how carrying balances becomes expensive over time. Users see real-time calculations of how much interest they're accumulating.`
  },
  {
    id: 'payments',
    title: 'Payment Options & Consequences',
    icon: CreditCard,
    content: `Minimum Payment (Typical 5% of bill):
- Keeps account in good standing
- Results in maximum interest charges
- Small negative impact on credit score
- Demonstrates the "minimum payment trap"

Full Payment:
- Eliminates all interest charges
- Positive credit score boost (+5 points)
- Resets balance to zero
- Shows benefits of paying in full

Custom Payment:
- Allows strategic partial payments
- Moderate credit score impact
- Teaches balance between cash flow and interest costs

Skipping Payment:
- Severe penalties (₹500 late fee)
- Major credit score damage (-25 points)
- Additional interest charges
- Shows real consequences of missed payments`
  },
  {
    id: 'credit-score',
    title: 'Credit Score Mechanics',
    icon: TrendingUp,
    content: `The simulation models real credit score factors:

Payment History (Most Important):
- Full payments: +5 points
- Partial payments: +2 points
- Minimum payments: -2 points
- Missed payments: -25 points

Credit Utilization (Second Most Important):
- Over 80% utilization: -8 points
- 50-80% utilization: -3 points
- Under 30%: No penalty (ideal range)

Score Ranges:
- 750-850: Excellent (Green)
- 650-749: Good (Yellow)
- 300-649: Poor (Red)

Users see immediate feedback on how their decisions affect their creditworthiness.`
  },
  {
    id: 'key-metrics',
    title: 'Key Metrics Explained',
    icon: ClipboardList,
    content: `Outstanding Balance: Previous unpaid amounts that accrue interest

Current Spending: New purchases in the current billing cycle

Available Credit: Credit limit minus total outstanding amount

Utilization Ratio: Percentage of credit limit being used (critical for credit score)

Total Interest Paid: Running total of all interest charges (shows true cost of carrying debt)

Bill Amount: Outstanding balance + current spending + accrued interest

The dashboard provides real-time visibility into all these metrics, helping users understand the interconnected nature of credit card finances.`
  },
  {
    id: 'scenarios',
    title: 'Learning Scenarios',
    icon: GraduationCap,
    content: `Scenario 1: Responsible Use
- Make small purchases
- Pay full balance each month
- Watch credit score improve
- See zero interest charges

Scenario 2: Minimum Payment Trap
- Make large purchase
- Pay only minimums
- Watch interest compound
- See debt spiral effect

Scenario 3: Strategic Partial Payments
- Balance cash flow needs with interest costs
- Learn optimal payment strategies
- Understand trade-offs

Scenario 4: Credit Score Recovery
- Start with poor habits
- Implement better payment strategies
- Watch credit score gradually improve

Each scenario teaches different aspects of credit card financial literacy.`
  },
  {
    id: 'features',
    title: 'Simulator Features',
    icon: Settings,
    content: `Interactive Elements:
- Real-time calculations and updates
- Visual feedback through charts and graphs
- Immediate consequences for all actions

Educational Tools:
- Credit score progress bar with color coding
- Utilization ratio pie chart
- Balance history line graph
- Transaction history log

Safety Features:
- Undo function for learning from mistakes
- Reset option to start over
- Clear phase indicators
- Helpful tips and warnings

Gamification:
- Month-by-month progression
- Achievement-style credit score improvements
- Immediate feedback notifications
- Visual progress tracking

The interface is designed to make learning about credit cards engaging while maintaining educational accuracy.`
  },
  {
    id: 'educational-value',
    title: 'Educational Value',
    icon: Brain,
    content: `Core Learning Objectives:

1. Understanding Interest: How it accumulates, when it applies, and how to avoid it
2. Payment Strategy: Trade-offs between different payment approaches
3. Credit Score Impact: How financial decisions affect creditworthiness
4. Utilization Management: Keeping credit usage in optimal ranges
5. Billing Cycles: How real credit card timing works
6. Financial Planning: Balancing spending with payment capacity

Why Simulation Works:
- Safe environment to make costly mistakes
- Immediate feedback on decisions
- Repetitive practice builds intuition
- Visual data makes abstract concepts concrete
- Gamification maintains engagement

The simulator bridges the gap between theoretical knowledge and practical understanding of credit card management.`
  }
];

const stats = [
  { icon: Gamepad2, value: '2 Phases', label: 'Spending & Payment' },
  { icon: BarChart3, value: 'Real-time', label: 'Interest Calculations' },
  { icon: TrendingUp, value: 'Dynamic', label: 'Credit Score Updates' },
  { icon: Lightbulb, value: 'Interactive', label: 'Learning Experience' },
];

const howToUse = {
  title: 'How to use the simulator',
  steps: [
    {
      title: 'Setup',
      text: 'Enter your credit limit, annual interest rate, and minimum payment percentage. Try realistic values like ₹50,000 limit with 18% APR.',
    },
    {
      title: 'Spend',
      text: 'Make purchases during the spending phase. Try different amounts to see how utilization affects your credit score in real-time.',
    },
    {
      title: 'Generate Bill',
      text: 'When ready, generate your monthly bill. This adds interest charges on any previous unpaid balance and transitions to payment phase.',
    },
    {
      title: 'Pay & Learn',
      text: 'Choose your payment strategy and see immediate impacts on interest, credit score, and future debt. Use undo to experiment safely.',
    },
  ],
};

const insights = [
  {
    icon: Wallet,
    title: 'Compound Interest Impact',
    text: 'See how unpaid balances grow exponentially due to monthly compounding. A ₹10,000 balance at 18% APR costs ₹1,800+ annually in interest alone.',
  },
  {
    icon: TrendingDown,
    title: 'Minimum Payment Trap',
    text: 'Discover why paying only minimums leads to years of debt. The simulator shows exactly how much extra you pay in interest over time.',
  },
  {
    icon: Zap,
    title: 'Credit Score Factors',
    text: 'Learn how payment history and utilization ratio directly impact your credit score. See immediate changes based on your decisions.',
  },
  {
    icon: Target,
    title: 'Strategic Thinking',
    text: 'Develop skills in balancing cash flow needs with long-term financial health. Practice making informed payment decisions.',
  },
];

const CreditCardSimulationExplanation = () => (
  <SimulatorGuide
    title="How the Credit Card"
    titleAccent="Simulator Works"
    subtitle="A comprehensive guide to understanding the educational mechanics and learning objectives behind the credit card simulator."
    backPath="/creditOrLoan"
    ctaPath="/credit"
    ctaLabel="Start Credit Simulation"
    stats={stats}
    sections={sections}
    howToUse={howToUse}
    insights={insights}
    footerNote="This simulator is designed for educational purposes to help users understand credit card mechanics and develop better financial literacy skills."
  />
);

export default CreditCardSimulationExplanation;
