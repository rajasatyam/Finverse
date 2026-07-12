import React, { useEffect, useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  ArrowDownUp,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  LayoutList,
  Plus,
  ReceiptText,
  Trash2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { auth, db } from "../firebase.js";
import { fetchExpenses } from "../fetchTracker.js";

const categories = ["Groceries", "Rent", "Transport", "Utilities", "Entertainment", "Healthcare", "Other"];
const colors = ["#FFD700", "#F59E0B", "#EF4444", "#22C55E", "#38BDF8", "#A855F7", "#FDE68A"];

const fieldClasses =
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white transition duration-300 placeholder:text-gray-500 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10";

const statCardClasses =
  "rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]";

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="font-semibold text-gold">{label}</div>
      <div className="mt-1 text-gray-300">${Number(payload[0].value).toFixed(2)}</div>
    </div>
  );
}

export default function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "Groceries",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setExpenses([]);
        return;
      }

      const data = await fetchExpenses(currentUser.uid);
      setExpenses(data);
    });

    return () => unsubscribe();
  }, []);

  const totalAmount = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    [expenses]
  );

  const averageExpense = expenses.length ? totalAmount / expenses.length : 0;

  const categoryBreakdown = useMemo(() => {
    return categories
      .map((category) => ({
        name: category,
        value: expenses
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const leadingCategory = categoryBreakdown[0] ?? null;

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "amount") {
        aValue = Number(aValue || 0);
        bValue = Number(bValue || 0);
      }

      if (sortBy === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      }

      return aValue < bValue ? 1 : -1;
    });
  }, [expenses, sortBy, sortOrder]);

  const chartData = categoryBreakdown;

  const addExpense = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please sign in to save expenses.");
      return;
    }

    if (!newExpense.amount || Number.isNaN(Number(newExpense.amount)) || Number(newExpense.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!newExpense.description.trim()) {
      alert("Please enter a description.");
      return;
    }

    const expense = {
      id: Date.now(),
      userId: currentUser.uid,
      amount: Number(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description.trim(),
      date: newExpense.date,
    };

    await addDoc(collection(db, "expenses"), expense);

    setExpenses((currentExpenses) => [expense, ...currentExpenses]);
    setNewExpense({
      amount: "",
      category: "Groceries",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense entry?")) {
      return;
    }

    try {
      const q = query(collection(db, "expenses"), where("id", "==", id));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (documentSnapshot) => {
        await deleteDoc(doc(db, "expenses", documentSnapshot.id));
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
    }

    setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id));
  };

  const handleSubmitKey = (event) => {
    if (event.key === "Enter") {
      addExpense();
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0d0d]/95 shadow-[0_35px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,215,0,0.06)_0%,transparent_35%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.05)_0%,transparent_25%)]" />

      <div className="relative p-6 md:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-gold">
              <ReceiptText className="h-3.5 w-3.5" />
              Expense Ledger
            </span>
            <h2 className="mt-4 max-w-2xl font-sans text-3xl font-extrabold text-white md:text-4xl">
              Capture spending without losing the story behind it.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
              Add transactions, sort the ledger, and read category trends from the same surface.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
            <div className={statCardClasses}>
              <div className="text-xs uppercase tracking-[0.24em] text-gray-500">Total spent</div>
              <div className="mt-2 text-xl font-semibold text-gold">${totalAmount.toFixed(2)}</div>
            </div>
            <div className={statCardClasses}>
              <div className="text-xs uppercase tracking-[0.24em] text-gray-500">Entries</div>
              <div className="mt-2 text-xl font-semibold text-white">{expenses.length}</div>
            </div>
            <div className={statCardClasses}>
              <div className="text-xs uppercase tracking-[0.24em] text-gray-500">Average</div>
              <div className="mt-2 text-xl font-semibold text-white">${averageExpense.toFixed(2)}</div>
            </div>
            <div className={statCardClasses}>
              <div className="text-xs uppercase tracking-[0.24em] text-gray-500">Top category</div>
              <div className="mt-2 text-xl font-semibold text-white">{leadingCategory?.name ?? "—"}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-white">
            <Plus className="h-4 w-4 text-gold" />
            Log a new expense
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1.1fr_0.9fr_1.2fr_0.9fr_auto]">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Amount</label>
              <input
                type="number"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(event) => setNewExpense({ ...newExpense, amount: event.target.value })}
                onKeyDown={handleSubmitKey}
                min="0"
                step="0.01"
                className={fieldClasses}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Category</label>
              <select
                value={newExpense.category}
                onChange={(event) => setNewExpense({ ...newExpense, category: event.target.value })}
                className={fieldClasses}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Description</label>
              <input
                type="text"
                placeholder="What did you spend on?"
                value={newExpense.description}
                onChange={(event) => setNewExpense({ ...newExpense, description: event.target.value })}
                onKeyDown={handleSubmitKey}
                className={fieldClasses}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(event) => setNewExpense({ ...newExpense, date: event.target.value })}
                max={new Date().toISOString().split("T")[0]}
                className={fieldClasses}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={addExpense}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold to-amber-300 px-5 py-3.5 text-sm font-bold text-black transition duration-300 hover:scale-[1.01] hover:shadow-[0_18px_35px_rgba(255,215,0,0.28)]"
              >
                <CircleDollarSign className="h-4 w-4" />
                Add expense
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">Category mix</div>
                <h3 className="mt-1 text-xl font-semibold text-white">Where the money goes</h3>
              </div>
              <BarChart3 className="h-5 w-5 text-gold" />
            </div>

            {chartData.length > 0 ? (
              <div className="mt-5 h-[320px] rounded-3xl border border-white/10 bg-black/20 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={58}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={entry.name} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-gray-400">
                Add your first expense to unlock category insights.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">Category ranking</div>
                <h3 className="mt-1 text-xl font-semibold text-white">Fastest way to spot drift</h3>
              </div>
              <LayoutList className="h-5 w-5 text-gold" />
            </div>

            <div className="mt-5 space-y-3">
              {chartData.length > 0 ? (
                chartData.map((item, index) => (
                  <div key={item.name} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                        <span className="font-medium text-white">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gold">${item.value.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.value / totalAmount) * 100}%`,
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-gray-400">
                  Category breakdown appears once you log expenses.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">Transaction history</div>
              <h3 className="mt-1 text-xl font-semibold text-white">Ledger with a cleaner reading order</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Sort by</label>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-gold focus:outline-none">
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
                <option value="description">Description</option>
              </select>
              <button
                onClick={() => setSortOrder((current) => (current === "asc" ? "desc" : "asc"))}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:border-gold/40 hover:text-gold"
              >
                <ArrowDownUp className="h-4 w-4" />
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>

          {sortedExpenses.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                  <thead className="bg-white/[0.05] text-xs uppercase tracking-[0.24em] text-gray-400">
                    <tr>
                      <th className="px-4 py-4 font-semibold">Date</th>
                      <th className="px-4 py-4 font-semibold">Amount</th>
                      <th className="px-4 py-4 font-semibold">Category</th>
                      <th className="px-4 py-4 font-semibold">Description</th>
                      <th className="px-4 py-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedExpenses.map((expense) => (
                      <tr key={expense.id} className="border-t border-white/8 bg-black/15 transition hover:bg-black/25">
                        <td className="px-4 py-4 text-sm text-gray-300">
                          <div className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-gold" />
                            {formatDate(expense.date)}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gold">${Number(expense.amount).toFixed(2)}</td>
                        <td className="px-4 py-4 text-sm text-gray-200">
                          <span className="inline-block rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gold whitespace-nowrap">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">{expense.description || "—"}</td>
                        <td className="px-4 py-4 text-sm">
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-dashed border-white/10 bg-black/20 px-6 py-14 text-center text-gray-400">
              No expenses recorded yet. Add your first transaction above to populate the ledger.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
