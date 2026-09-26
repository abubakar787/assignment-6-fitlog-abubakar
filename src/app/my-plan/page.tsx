
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Flame,
  CheckCircle2,
  Trash2,
  Dumbbell,
  Bookmark,
  LoaderCircle,
} from "lucide-react";

type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
  done?: boolean;
};

type Tab = "plan" | "saved";

export default function MyPlanPage() {
  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const storedPlan = JSON.parse(
        localStorage.getItem("fitlog-plan") || "[]"
      );
      const storedSaved = JSON.parse(
        localStorage.getItem("fitlog-saved") || "[]"
      );

      setPlan(
        Array.isArray(storedPlan)
          ? storedPlan.map((item) => ({
              ...item,
              done: item.done ?? false,
            }))
          : []
      );

      setSaved(Array.isArray(storedSaved) ? storedSaved : []);
    } catch {
      setPlan([]);
      setSaved([]);
    }

    setLoaded(true);
  }, []);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const updatePlan = (updated: Workout[]) => {
    setPlan(updated);
    localStorage.setItem("fitlog-plan", JSON.stringify(updated));
  };

  const updateSaved = (updated: Workout[]) => {
    setSaved(updated);
    localStorage.setItem("fitlog-saved", JSON.stringify(updated));
  };

  const toggleDone = (id: number) => {
    const updated = plan.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );

    updatePlan(updated);

    const item = updated.find((workout) => workout.id === id);
    notify(item?.done ? "Workout marked as done!" : "Workout marked as pending.");
  };

  const removeFromPlan = (id: number) => {
    updatePlan(plan.filter((item) => item.id !== id));
    notify("Removed from today's plan.");
  };

  const removeFromSaved = (id: number) => {
    updateSaved(saved.filter((item) => item.id !== id));
    notify("Removed from saved workouts.");
  };

  const currentItems = activeTab === "plan" ? plan : saved;

  const totalMinutes = plan.reduce(
    (sum, item) => sum + Number(item.duration || 0),
    0
  );

  const totalCalories = plan.reduce(
    (sum, item) => sum + Number(item.caloriesBurned || 0),
    0
  );

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0c0d12] text-white">
        <LoaderCircle className="h-10 w-10 animate-spin text-[#ccff00]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c0d12] px-5 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#ccff00]"
        >
          <ArrowLeft size={18} />
          Back to workouts
        </Link>

        <div className="mb-10">
          <p className="mb-3 text-xs font-bold tracking-[0.25em] text-[#ccff00]">
            YOUR WORKOUTS
          </p>

          <h1 className="text-4xl font-black uppercase sm:text-6xl">
            MY PLAN<span className="text-[#ccff00]">.</span>
          </h1>

          <p className="mt-4 text-gray-400">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#15161d] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">EXERCISES</p>
              <Dumbbell className="text-[#ccff00]" />
            </div>
            <p className="text-4xl font-black">{plan.length}</p>
            <p className="mt-2 text-xs text-gray-500">Out of 5 lifts</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#15161d] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">TOTAL MINUTES</p>
              <Clock3 className="text-[#ccff00]" />
            </div>
            <p className="text-4xl font-black">{totalMinutes}</p>
            <p className="mt-2 text-xs text-gray-500">Estimated duration</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#15161d] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">CALORIES</p>
              <Flame className="text-[#ccff00]" />
            </div>
            <p className="text-4xl font-black">{totalCalories}</p>
            <p className="mt-2 text-xs text-gray-500">Estimated kcal</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("plan")}
              className={`border-b-2 px-1 pb-4 text-sm font-bold transition ${
                activeTab === "plan"
                  ? "border-[#ccff00] text-[#ccff00]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              TODAY&apos;S PLAN ({plan.length})
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`border-b-2 px-1 pb-4 text-sm font-bold transition ${
                activeTab === "saved"
                  ? "border-[#ccff00] text-[#ccff00]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              SAVED ({saved.length})
            </button>
          </div>

          <Link
            href="/#library"
            className="mb-3 rounded-lg bg-[#ccff00] px-5 py-3 text-sm font-black text-black transition hover:bg-white"
          >
            + Add Workouts
          </Link>
        </div>

        {/* Workout list */}
        {currentItems.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 px-5 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#15161d]">
              {activeTab === "plan" ? (
                <Dumbbell className="text-[#ccff00]" size={28} />
              ) : (
                <Bookmark className="text-[#ccff00]" size={28} />
              )}
            </div>

            <h2 className="text-2xl font-black">
              NOTHING HERE YET
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
              Browse the library and add a lift to get today moving.
            </p>

            <Link
              href="/#library"
              className="mt-6 rounded-lg bg-[#ccff00] px-6 py-3 font-black text-black transition hover:bg-white"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {currentItems.map((workout) => (
              <div
                key={workout.id}
                className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#15161d] p-4 transition hover:border-[#ccff00]/40 sm:flex-row sm:items-center sm:p-5"
              >
                <img src={workout.image}
                  alt={workout.name}
                  className="h-48 w-full rounded-xl object-cover sm:h-28 sm:w-36"
                />

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {workout.muscleGroups?.map((muscle) => (
                      <span
                        key={muscle}
                        className="rounded-full border border-[#ccff00]/30 px-3 py-1 text-[10px] font-bold uppercase text-[#ccff00]"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-black uppercase">
                    {workout.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    {workout.equipment}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock3 size={15} />
                      {workout.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame size={15} />
                      {workout.caloriesBurned} kcal
                    </span>
                    <span>{workout.sets} sets</span>
                    <span>{workout.reps} reps</span>
                  </div>

                  {activeTab === "plan" && workout.done && (
                    <p className="mt-3 text-xs font-bold text-[#ccff00]">
                      COMPLETED
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:flex-col">
                  <Link
                    href={`/workout/${workout.id}`}
                    className="flex flex-1 items-center justify-center rounded-lg border border-white/20 px-4 py-3 text-xs font-bold transition hover:border-[#ccff00] hover:text-[#ccff00] sm:w-36"
                  >
                    View Details
                  </Link>

                  {activeTab === "plan" ? (
                    <button
                      onClick={() => toggleDone(workout.id)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-black transition sm:w-36 ${
                        workout.done
                          ? "border border-[#ccff00] text-[#ccff00]"
                          : "bg-[#ccff00] text-black hover:bg-white"
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      {workout.done ? "Undo Done" : "Mark as Done"}
                    </button>
                  ) : null}

                  <button
                    onClick={() =>
                      activeTab === "plan"
                        ? removeFromPlan(workout.id)
                        : removeFromSaved(workout.id)
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-3 text-xs font-bold text-red-400 transition hover:bg-red-500/10 sm:w-36"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-16 border-t border-white/10 py-8 text-center text-sm text-gray-500">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </footer>
      </div>

      {/* Simple notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-[#ccff00]/30 bg-[#15161d] px-6 py-4 text-sm font-bold text-[#ccff00] shadow-xl">
          {toast}
        </div>
      )}
    </main>
  );
}