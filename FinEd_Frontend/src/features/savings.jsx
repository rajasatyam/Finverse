import React, { useEffect, useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  CalendarClock,
  Medal,
  PiggyBank,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { auth, db } from "../firebase.js";
import { fetchSavings } from "../fetchTracker";

const inputClasses =
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

function getDaysRemaining(deadline) {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function Savings() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    deadline: "",
  });
  const [customAmounts, setCustomAmounts] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setGoals([]);
        return;
      }

      const data = await fetchSavings(currentUser.uid);
      setGoals(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("savingsGoals", JSON.stringify(goals));
  }, [goals]);

  const totalTarget = useMemo(
    () => goals.reduce((sum, goal) => sum + Number(goal.target || 0), 0),
    [goals]
  );

  const totalSaved = useMemo(
    () => goals.reduce((sum, goal) => sum + Number(goal.saved || 0), 0),
    [goals]
  );

  const completionRate = totalTarget ? (totalSaved / totalTarget) * 100 : 0;
  const completedGoals = goals.filter((goal) => Number(goal.saved || 0) >= Number(goal.target || 0)).length;
  const dueSoonGoals = goals.filter((goal) => {
    const remaining = getDaysRemaining(goal.deadline);
    return remaining >= 0 && remaining <= 14;
  }).length;

  const upcomingGoal = [...goals]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .find(Boolean);

  const addGoal = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please sign in to save goals.");
      return;
    }

    if (!newGoal.name.trim()) {
      alert("Please enter a goal name.");
      return;
    }

    if (!newGoal.target || Number.isNaN(Number(newGoal.target)) || Number(newGoal.target) <= 0) {
      alert("Please enter a valid target amount.");
      return;
    }

    if (!newGoal.deadline) {
      alert("Please select a deadline.");
      return;
    }

    const goal = {
      id: Date.now(),
      userId: currentUser.uid,
      name: newGoal.name.trim(),
      target: Number(newGoal.target),
      saved: 0,
      deadline: newGoal.deadline,
      createdDate: new Date().toISOString().split("T")[0],
    };

    await addDoc(collection(db, "savings"), goal);

    setGoals((currentGoals) => [...currentGoals, goal]);
    setNewGoal({ name: "", target: "", deadline: "" });
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete this savings goal?")) {
      return;
    }

    try {
      const q = query(collection(db, "savings"), where("id", "==", id));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (documentSnapshot) => {
        await deleteDoc(doc(db, "savings", documentSnapshot.id));
      });
    } catch (error) {
      console.error("Error deleting goal:", error);
    }

    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id));
    setCustomAmounts((currentAmounts) => {
      const nextAmounts = { ...currentAmounts };
      delete nextAmounts[id];
      return nextAmounts;
    });
  };

  const updateGoalAmount = async (id, delta) => {
    const customAmount = Number(customAmounts[id] || 0);
    const amount = delta ?? customAmount;

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const updatedGoals = await Promise.all(
      goals.map(async (goal) => {
        if (goal.id !== id) {
          return goal;
        }

        const nextSaved = Math.max(0, Math.min(Number(goal.target || 0), Number(goal.saved || 0) + amount));

        try {
          const q = query(collection(db, "savings"), where("id", "==", id));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async (documentSnapshot) => {
            await updateDoc(doc(db, "savings", documentSnapshot.id), {
              saved: nextSaved,
            });
          });
        } catch (error) {
          console.error("Error updating goal:", error);
        }

        return { ...goal, saved: nextSaved };
      })
    );

    setGoals(updatedGoals);
    setCustomAmounts((currentAmounts) => ({ ...currentAmounts, [id]: delta ? currentAmounts[id] : "" }));
  };

  const subtractGoalAmount = async (id, delta) => {
    const customAmount = Number(customAmounts[id] || 0);
    const amount = delta ?? customAmount;

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const updatedGoals = await Promise.all(
      goals.map(async (goal) => {
        if (goal.id !== id) {
          return goal;
        }

        const nextSaved = Math.max(0, Number(goal.saved || 0) - amount);

        try {
          const q = query(collection(db, "savings"), where("id", "==", id));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async (documentSnapshot) => {
            await updateDoc(doc(db, "savings", documentSnapshot.id), {
              saved: nextSaved,
            });
          });
        } catch (error) {
          console.error("Error updating goal:", error);
        }

        return { ...goal, saved: nextSaved };
      })
    );

    setGoals(updatedGoals);
    setCustomAmounts((currentAmounts) => ({ ...currentAmounts, [id]: delta ? currentAmounts[id] : "" }));
  };

  const handleGoalSubmitKey = (event, goalId) => {
    if (event.key === "Enter") {
      updateGoalAmount(goalId);
    }
  };

  const handleNewGoalSubmitKey = (event) => {
    if (event.key === "Enter") {
      addGoal();
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0d0d]/95 shadow-[0_35px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,215,0,0.06)_0%,transparent_30%),radial-gradient(circle_at_85%_0%,rgba(56,189,248,0.05)_0%,transparent_28%)]" />

      <div className="relative p-6 md:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-gold">
              <PiggyBank className="h-3.5 w-3.5" />
              Savings Vault
            </span>
            <h2 className="mt-4 max-w-2xl font-sans text-3xl font-extrabold text-white md:text-4xl">
              Give every goal a deadline, a number, and visible momentum.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
              Build savings habits with a calmer layout, clearer progress cards, and the same deposit controls you already use.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
            <div className={statCardClasses}>
              <div className="text-xs uppercase tracking-[0.24em] text-gray-500">Saved</div>
              <div className="mt-2 text-xl font-semibold text-gold">${totalSaved.toFixed(2)}</div>
            </div>
            <div className={statCardClasses}>
              <div className="text-xs uppercase tracking-[0.24em] text-gray-500">Target</div>
              <div className="mt-2 text-xl font-semibold text-white">${totalTarget.toFixed(2)}</div>
            </div>
            <div className={statCardClasses}>
              <div className="text-xs uppercase tracking-[0.24em] text-gray-500">Completion</div>
              <div className="mt-2 text-xl font-semibold text-white">{completionRate.toFixed(1)}%</div>
            </div>
            <div className={statCardClasses}>
              <div className="text-xs uppercase tracking-[0.24em] text-gray-500">Due soon</div>
              <div className="mt-2 text-xl font-semibold text-white">{dueSoonGoals}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-white">
            <Plus className="h-4 w-4 text-gold" />
            Set a new savings goal
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1.3fr_0.8fr_0.8fr_auto]">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Goal name</label>
              <input
                type="text"
                placeholder="Emergency fund"
                value={newGoal.name}
                onChange={(event) => setNewGoal({ ...newGoal, name: event.target.value })}
                onKeyDown={handleNewGoalSubmitKey}
                className={inputClasses}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Target amount</label>
              <input
                type="number"
                placeholder="5000"
                value={newGoal.target}
                onChange={(event) => setNewGoal({ ...newGoal, target: event.target.value })}
                onKeyDown={handleNewGoalSubmitKey}
                min="0"
                step="0.01"
                className={inputClasses}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Deadline</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(event) => setNewGoal({ ...newGoal, deadline: event.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className={inputClasses}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={addGoal}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold to-amber-300 px-5 py-3.5 text-sm font-bold text-black transition duration-300 hover:scale-[1.01] hover:shadow-[0_18px_35px_rgba(255,215,0,0.28)]"
              >
                <Target className="h-4 w-4" />
                Add goal
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">Snapshot</div>
                <h3 className="mt-1 text-xl font-semibold text-white">Progress at a glance</h3>
              </div>
              <TrendingUp className="h-5 w-5 text-gold" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-3 text-sm text-gray-300">
                  <span>Total saved</span>
                  <span className="font-semibold text-gold">${totalSaved.toFixed(2)}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-amber-300"
                    style={{ width: `${Math.min(completionRate, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-gray-500">Active goals</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{goals.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-gray-500">Completed</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{completedGoals}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <CalendarClock className="h-4 w-4 text-gold" />
                  Next deadline
                </div>
                {upcomingGoal ? (
                  <>
                    <div className="mt-2 text-base font-semibold text-white">{upcomingGoal.name}</div>
                    <div className="mt-1 text-sm text-gray-400">
                      {formatDate(upcomingGoal.deadline)}
                      {getDaysRemaining(upcomingGoal.deadline) >= 0
                        ? ` · ${getDaysRemaining(upcomingGoal.deadline)} days left`
                        : ` · overdue by ${Math.abs(getDaysRemaining(upcomingGoal.deadline))} days`}
                    </div>
                  </>
                ) : (
                  <div className="mt-2 text-sm text-gray-400">Create a goal to see the next milestone here.</div>
                )}
              </div>

              {/* Removed the debug text box */}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">Goals</div>
                <h3 className="mt-1 text-xl font-semibold text-white">Manage Savings Milestones</h3>
              </div>
              <Wallet className="h-5 w-5 text-gold" />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {goals.length > 0 ? (
                goals.map((goal) => {
                  const progress = Number(goal.target) ? (Number(goal.saved || 0) / Number(goal.target)) * 100 : 0;
                  const daysRemaining = getDaysRemaining(goal.deadline);
                  const isOverdue = daysRemaining < 0;
                  const isNearDeadline = daysRemaining >= 0 && daysRemaining <= 7;

                  return (
                    <div
                      key={goal.id}
                      className="rounded-[24px] border border-white/10 bg-black/25 p-5 shadow-[0_14px_30px_rgba(0,0,0,0.22)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-lg font-bold text-white">{goal.name}</h4>
                            <div className="mt-1 flex flex-wrap gap-2 items-center text-xs text-gray-400">
                              <span>Goal date: {formatDate(goal.deadline)}</span>
                              {isOverdue && (
                                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium">
                                  Overdue by {Math.abs(daysRemaining)} days
                                </span>
                              )}
                              {isNearDeadline && !isOverdue && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-medium">
                                  {daysRemaining} days left
                                </span>
                              )}
                              {!isOverdue && !isNearDeadline && daysRemaining > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                                  {daysRemaining} days left
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 hover:text-red-200 cursor-pointer"
                            title="Delete goal"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-5">
                          <div className="flex items-center justify-between text-xs text-gray-300">
                            <span>
                              ${Number(goal.saved || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} of ${Number(goal.target || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="font-semibold text-gold">{progress.toFixed(1)}%</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10 border border-white/[0.05]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-gold to-amber-300"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-white/[0.04] space-y-3.5">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Custom amount"
                            value={customAmounts[goal.id] || ""}
                            onChange={(event) =>
                              setCustomAmounts({
                                ...customAmounts,
                                [goal.id]: event.target.value,
                              })
                            }
                            onKeyDown={(event) => handleGoalSubmitKey(event, goal.id)}
                            min="0"
                            step="0.01"
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/10"
                          />
                          <button
                            onClick={() => updateGoalAmount(goal.id)}
                            className="px-4 py-2 bg-gradient-to-r from-gold to-amber-300 hover:brightness-110 text-black font-bold text-xs rounded-xl transition cursor-pointer"
                          >
                            Deposit
                          </button>
                          <button
                            onClick={() => subtractGoalAmount(goal.id)}
                            className="px-4 py-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl transition cursor-pointer"
                          >
                            Withdraw
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Quick Adjust:</span>
                          <button
                            onClick={() => updateGoalAmount(goal.id, 100)}
                            className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] rounded-lg transition border border-emerald-500/20 cursor-pointer"
                          >
                            +$100
                          </button>
                          <button
                            onClick={() => subtractGoalAmount(goal.id, 100)}
                            className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-[10px] rounded-lg transition border border-red-500/20 cursor-pointer"
                          >
                            -$100
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full rounded-[24px] border border-dashed border-white/10 bg-black/20 px-6 py-14 text-center text-gray-400 md:col-span-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
                    <Medal className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-lg font-semibold text-white">No savings goals yet</div>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Create your first goal to start tracking progress, deadlines, and deposits.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
