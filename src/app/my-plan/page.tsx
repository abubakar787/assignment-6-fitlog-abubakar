 
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
  Plus,
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

  // Load data from LocalStorage after the page mounts.
  useEffect(() => {
    let cancelled = false;

    const frame = window.requestAnimationFrame(() => {
      try {
        const storedPlan = JSON.parse(
          localStorage.getItem("fitlog-plan") || "[]"
        );

        const storedSaved = JSON.parse(
          localStorage.getItem("fitlog-saved") || "[]"
        );

        if (cancelled) return;

        setPlan(
          Array.isArray(storedPlan)
            ? storedPlan.map((item: Workout) => ({
                ...item,
                done: item.done ?? false,
              }))
            : []
        );

        setSaved(Array.isArray(storedSaved) ? storedSaved : []);
      } catch (error) {
        console.error("Failed to load workout data:", error);

        if (!cancelled) {
          setPlan([]);
          setSaved([]);
        }
      }

      if (!cancelled) {
        setLoaded(true);
      }
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  // Show notification.
  const notify = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2500);
  };

  // Update today's plan and LocalStorage.
  const updatePlan = (updated: Workout[]) => {
    setPlan(updated);

    try {
      localStorage.setItem("fitlog-plan", JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save today's plan:", error);
    }
  };

  // Update saved workouts and LocalStorage.
  const updateSaved = (updated: Workout[]) => {
    setSaved(updated);

    try {
      localStorage.setItem("fitlog-saved", JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save workouts:", error);
    }
  };

  // Mark a workout as completed or undo completion.
  const toggleDone = (id: number) => {
    const updated = plan.map((item) =>
      item.id === id
        ? { ...item, done: !item.done }
        : item
    );

    updatePlan(updated);

    const workout = updated.find((item) => item.id === id);

    notify(
      workout?.done
        ? "Workout marked as done!"
        : "Workout marked as pending."
    );
  };

  // Remove workout from today's plan.
  const removeFromPlan = (id: number) => {
    updatePlan(plan.filter((item) => item.id !== id));
    notify("Removed from today's plan.");
  };

  // Remove workout from saved list.
  const removeFromSaved = (id: number) => {
    updateSaved(saved.filter((item) => item.id !== id));
    notify("Removed from saved workouts.");
  };

  // Current tab items.
  const currentItems = activeTab === "plan" ? plan : saved;

  // Today's plan summary.
  const totalMinutes = plan.reduce(
    (sum, item) => sum + Number(item.duration || 0),
    0
  );

  const totalCalories = plan.reduce(
    (sum, item) => sum + Number(item.caloriesBurned || 0),
    0
  );

  // Loading screen.
  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0c0d12] text-white">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="h-10 w-10 animate-spin text-[#ccff00]" />

          <p className="text-sm text-gray-400">
            Loading your workouts...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c0d12] px-5 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-[1280px]">

        {/* Back to workouts */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#ccff00]"
        >
          <ArrowLeft size={18} />
          Back to workouts
        </Link>

        {/* Page heading */}
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

          {/* Exercises */}
          <div className="rounded-xl border border-white/10 bg-[#15161d] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                EXERCISES
              </p>

              <Dumbbell className="text-[#ccff00]" />
            </div>

            <p className="text-4xl font-black">
              {plan.length}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Out of 5 lifts
            </p>
          </div>

          {/* Total minutes */}
          <div className="rounded-xl border border-white/10 bg-[#15161d] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                TOTAL MINUTES
              </p>

              <Clock3 className="text-[#ccff00]" />
            </div>

            <p className="text-4xl font-black">
              {totalMinutes}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Estimated duration
            </p>
          </div>

          {/* Calories */}
          <div className="rounded-xl border border-white/10 bg-[#15161d] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                CALORIES
              </p>

              <Flame className="text-[#ccff00]" />
            </div>

            <p className="text-4xl font-black">
              {totalCalories}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Estimated kcal
            </p>
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
            className="mb-3 inline-flex items-center gap-2 rounded-lg bg-[#ccff00] px-5 py-3 text-sm font-black text-black transition hover:bg-white"
          >
            <Plus size={17} />
            Add Workouts
          </Link>
        </div>

        {/* Workout list */}
        {currentItems.length === 0 ? (

          /* Empty state */
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 px-5 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#15161d]">
              {activeTab === "plan" ? (
                <Dumbbell
                  className="text-[#ccff00]"
                  size={28}
                />
              ) : (
                <Bookmark
                  className="text-[#ccff00]"
                  size={28}
                />
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

          /* Workout cards */
          <div className="grid gap-4">

            {currentItems.map((workout) => (

              <div
                key={workout.id}
                className={`flex flex-col gap-5 rounded-2xl border bg-[#15161d] p-4 transition sm:flex-row sm:items-center sm:p-5 ${
                  activeTab === "plan" && workout.done
                    ? "border-[#ccff00]/50"
                    : "border-white/10 hover:border-[#ccff00]/40"
                }`}
              >

                {/* Workout image */}
                <img
                  src={workout.image}
                  alt={workout.name}
                  className="h-48 w-full rounded-xl object-cover sm:h-28 sm:w-36"
                />

                {/* Workout information */}
                <div className="min-w-0 flex-1">

                  {/* Muscle groups */}
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

                  {/* Name */}
                  <h3 className="text-xl font-black uppercase">
                    {workout.name}
                  </h3>

                  {/* Equipment */}
                  <p className="mt-2 text-sm text-gray-400">
                    {workout.equipment}
                  </p>

                  {/* Stats */}
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">

                    <span className="flex items-center gap-1">
                      <Clock3 size={15} />
                      {workout.duration} min
                    </span>

                    <span className="flex items-center gap-1">
                      <Flame size={15} />
                      {workout.caloriesBurned} kcal
                    </span>

                    <span>
                      {workout.sets} sets
                    </span>

                    <span>
                      {workout.reps} reps
                    </span>
                  </div>

                  {/* Completion status */}
                  {activeTab === "plan" && workout.done && (
                    <p className="mt-3 flex items-center gap-2 text-xs font-bold text-[#ccff00]">
                      <CheckCircle2 size={15} />
                      COMPLETED
                    </p>
                  )}

                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:flex-col">

                  {/* Details */}
                  <Link
                    href={`/workout/${workout.id}`}
                    className="flex flex-1 items-center justify-center rounded-lg border border-white/20 px-4 py-3 text-xs font-bold transition hover:border-[#ccff00] hover:text-[#ccff00] sm:w-36"
                  >
                    View Details
                  </Link>

                  {/* Mark as done */}
                  {activeTab === "plan" && (
                    <button
                      onClick={() => toggleDone(workout.id)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-black transition sm:w-36 ${
                        workout.done
                          ? "border border-[#ccff00] text-[#ccff00] hover:bg-[#ccff00]/10"
                          : "bg-[#ccff00] text-black hover:bg-white"
                      }`}
                    >
                      <CheckCircle2 size={16} />

                      {workout.done
                        ? "Undo Done"
                        : "Mark as Done"}
                    </button>
                  )}

                  {/* Remove */}
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

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 py-8 text-center text-sm text-gray-500">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </footer>

      </div>

      {/* Toast notification */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-[#ccff00]/30 bg-[#15161d] px-6 py-4 text-sm font-bold text-[#ccff00] shadow-xl"
        >
          {toast}
        </div>
      )}
    </main>
  );
}