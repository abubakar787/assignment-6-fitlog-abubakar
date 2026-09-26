
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  Flame,
  Star,
  Dumbbell,
  CheckCircle2,
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
};

export default function WorkoutDetails() {
  const params = useParams();
  const id = params.id as string;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorkout() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://api.abcz.workers.dev/api/fitlog/${id}`
        );

        if (!response.ok) {
          throw new Error("Workout not found");
        }

        const data = await response.json();

        // Supports either a direct workout object
        // or an object containing a workout property.
        const item = data.workout ?? data;

        setWorkout(item);
      } catch {
        setError("Unable to load this workout. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadWorkout();
    }
  }, [id]);

  const addToPlan = () => {
    if (!workout) return;

    const current = JSON.parse(
      localStorage.getItem("fitlog-plan") || "[]"
    );

    if (current.some((item: Workout) => item.id === workout.id)) {
      alert("Already in today's plan!");
      return;
    }

    if (current.length >= 5) {
      alert("Today's plan is limited to five lifts.");
      return;
    }

    const updated = [...current, workout];

    localStorage.setItem("fitlog-plan", JSON.stringify(updated));
    alert("Added to today's plan!");
  };

  const saveWorkout = () => {
    if (!workout) return;

    const current = JSON.parse(
      localStorage.getItem("fitlog-saved") || "[]"
    );

    if (current.some((item: Workout) => item.id === workout.id)) {
      alert("Already saved!");
      return;
    }

    const updated = [...current, workout];

    localStorage.setItem("fitlog-saved", JSON.stringify(updated));
    alert("Saved for later!");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0c0d12] text-white">
        <div className="text-center">
          <LoaderCircle className="mx-auto mb-4 h-10 w-10 animate-spin text-[#ccff00]" />
          <p className="text-sm text-gray-400">
            Loading workout details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !workout) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0c0d12] px-5 text-center text-white">
        <h1 className="mb-3 text-3xl font-black">WORKOUT NOT FOUND</h1>
        <p className="mb-6 text-gray-400">
          {error || "This workout could not be found."}
        </p>
        <Link
          href="/"
          className="rounded-lg bg-[#ccff00] px-6 py-3 font-bold text-black"
        >
          Back to Workouts
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c0d12] text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-10 lg:px-8">
        <Link
          href="/#library"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#ccff00]"
        >
          <ArrowLeft size={18} />
          Back to Library
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Workout image */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15161d]">
              <img
                src={workout.image}
                alt={workout.name}
                className="h-[300px] w-full object-cover sm:h-[450px]"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {workout.muscleGroups?.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ccff00]"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Workout information */}
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.25em] text-[#ccff00]">
              WORKOUT DETAILS
            </p>

            <h1 className="mb-5 text-4xl font-black uppercase leading-tight sm:text-5xl">
              {workout.name}
            </h1>

            <p className="mb-8 leading-7 text-gray-400">
              {workout.description}
            </p>

            {/* Workout stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-[#15161d] p-4">
                <Dumbbell className="mb-3 text-[#ccff00]" size={20} />
                <p className="text-xs text-gray-500">EQUIPMENT</p>
                <p className="mt-1 font-bold">{workout.equipment}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#15161d] p-4">
                <CheckCircle2 className="mb-3 text-[#ccff00]" size={20} />
                <p className="text-xs text-gray-500">DIFFICULTY</p>
                <p className="mt-1 font-bold">{workout.difficulty}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#15161d] p-4">
                <Dumbbell className="mb-3 text-[#ccff00]" size={20} />
                <p className="text-xs text-gray-500">SETS</p>
                <p className="mt-1 font-bold">{workout.sets}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#15161d] p-4">
                <CheckCircle2 className="mb-3 text-[#ccff00]" size={20} />
                <p className="text-xs text-gray-500">REPS</p>
                <p className="mt-1 font-bold">{workout.reps}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#15161d] p-4">
                <Clock3 className="mb-3 text-[#ccff00]" size={20} />
                <p className="text-xs text-gray-500">DURATION</p>
                <p className="mt-1 font-bold">{workout.duration} min</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#15161d] p-4">
                <Flame className="mb-3 text-[#ccff00]" size={20} />
                <p className="text-xs text-gray-500">CALORIES</p>
                <p className="mt-1 font-bold">
                  {workout.caloriesBurned} kcal
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <Star size={18} className="fill-[#ccff00] text-[#ccff00]" />
              <span>{workout.rating} Rating</span>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={addToPlan}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#ccff00] px-5 py-4 font-black text-black transition hover:bg-white"
              >
                <CheckCircle2 size={19} />
                Add to Today&apos;s Plan
              </button>

              <button
                onClick={saveWorkout}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-4 font-bold transition hover:border-[#ccff00] hover:text-[#ccff00]"
              >
                <Bookmark size={19} />
                Save for Later
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <section className="mt-16 border-t border-white/10 pt-10">
          <p className="mb-3 text-xs font-bold tracking-[0.25em] text-[#ccff00]">
            STEP BY STEP
          </p>

          <h2 className="mb-8 text-3xl font-black uppercase">
            HOW TO PERFORM
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {workout.instructions?.map((instruction, index) => (
              <div
                key={index}
                className="flex gap-5 rounded-xl border border-white/10 bg-[#15161d] p-6"
              >
                <span className="text-3xl font-black text-[#ccff00]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="leading-7 text-gray-300">{instruction}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}