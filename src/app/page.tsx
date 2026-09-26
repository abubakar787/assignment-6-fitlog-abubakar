 
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  Clock,
  Flame,
  Star,
  Dumbbell,
  Search,
  SlidersHorizontal,
  LoaderCircle,
} from "lucide-react";

type Workout = {
  id: number | string;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string | number;
  rating: number;
  description: string;
  instructions: string[];
};

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("duration");
  const [retryCount, setRetryCount] = useState(0);

  // Fetch real workout data from the API
  useEffect(() => {
    let isMounted = true;

    async function fetchWorkouts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load workouts. Status: ${response.status}`
          );
        }

        const result = await response.json();

        // Support common API response formats
        const workoutList = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.workouts)
          ? result.workouts
          : [];

        if (!Array.isArray(workoutList)) {
          throw new Error("Invalid workout API response");
        }

        if (isMounted) {
          setWorkouts(workoutList);
        }
      } catch (err) {
        console.error("Workout API error:", err);

        if (isMounted) {
          setError(
            "Unable to load workouts. Please check your connection and try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWorkouts();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  // Search and sort workouts
  const filteredWorkouts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    const filtered = workouts.filter((workout) => {
      const name = workout.name?.toLowerCase() || "";
      const equipment = workout.equipment?.toLowerCase() || "";

      const muscles = Array.isArray(workout.muscleGroups)
        ? workout.muscleGroups.join(" ").toLowerCase()
        : "";

      return (
        name.includes(keyword) ||
        equipment.includes(keyword) ||
        muscles.includes(keyword)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "calories") {
        return (b.caloriesBurned || 0) - (a.caloriesBurned || 0);
      }

      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }

      return (a.duration || 0) - (b.duration || 0);
    });
  }, [workouts, search, sortBy]);

  // Scroll to the workout library
  function scrollToLibrary() {
    document.getElementById("library")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  // Retry API request
  function handleRetry() {
    setRetryCount((previous) => previous + 1);
  }

  return (
    <main className="min-h-screen bg-[#0b0b10] text-white">
      {/* HERO SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid items-center gap-12 overflow-hidden rounded-3xl border border-white/10 bg-[#15151e] p-8 md:grid-cols-2 md:p-16">
          <div>
            <p className="mb-6 text-sm font-black tracking-[0.3em] text-[#ccff00]">
              WORKOUT LIBRARY
            </p>

            <h1 className="mb-6 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              TRAIN WITH
              <br />
              INTENT.
              <br />
              LOG EVERY SET.
            </h1>

            <p className="mb-10 max-w-2xl text-lg leading-8 text-slate-400">
              FitLog is a dark, no-nonsense gym companion: pick a lift,
              lock it into today&apos;s plan, and watch the week&apos;s work
              add up.
            </p>

            <button
              onClick={scrollToLibrary}
              className="inline-flex items-center gap-3 rounded-xl bg-[#ccff00] px-7 py-5 font-black text-black transition hover:bg-lime-300"
            >
              <ArrowDown size={20} />
              BROWSE WORKOUTS
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <Image
              src="/asset/banner.png"
              alt="FitLog workout training"
              width={800}
              height={800}
              priority
              className="h-auto max-h-[540px] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      </section>

      {/* WORKOUT LIBRARY */}
      <section
        id="library"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16"
      >
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#ccff00]">
              THE LIBRARY
            </p>

            <h2 className="text-4xl font-black tracking-tight md:text-6xl">
              FIND YOUR LIFT.
            </h2>

            <p className="mt-4 text-lg text-slate-400">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          {/* SEARCH AND SORT */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#15151e] px-4 py-3">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search workouts..."
                className="w-full bg-transparent text-white outline-none placeholder:text-slate-500 sm:w-48"
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#15151e] px-4 py-3">
              <SlidersHorizontal
                size={18}
                className="text-[#ccff00]"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white outline-none"
              >
                <option value="duration" className="bg-[#15151e]">
                  Duration
                </option>

                <option value="calories" className="bg-[#15151e]">
                  Calories
                </option>

                <option value="rating" className="bg-[#15151e]">
                  Rating
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4">
            <LoaderCircle
              className="animate-spin text-[#ccff00]"
              size={48}
            />

            <p className="text-slate-400">
              Loading workouts...
            </p>
          </div>
        )}

        {/* API ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <p className="mb-4 text-red-400">{error}</p>

            <button
              onClick={handleRetry}
              className="rounded-lg bg-[#ccff00] px-6 py-3 font-bold text-black transition hover:bg-lime-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY SEARCH RESULTS */}
        {!loading && !error && filteredWorkouts.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#15151e] p-12 text-center">
            <Dumbbell
              className="mx-auto mb-4 text-[#ccff00]"
              size={48}
            />

            <h3 className="text-2xl font-black">
              NO WORKOUTS FOUND
            </h3>

            <p className="mt-3 text-slate-400">
              Try searching with another name or muscle group.
            </p>
          </div>
        )}

        {/* WORKOUT CARDS */}
        {!loading && !error && filteredWorkouts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorkouts.map((workout) => (
              <Link
                key={workout.id}
                href={`/workout/${workout.id}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#15151e] transition duration-300 hover:-translate-y-1 hover:border-[#ccff00]/50"
              >
                {/* Workout Image */}
                <div className="relative h-64 overflow-hidden bg-[#20202a]">
                  <img
                    src={workout.image}
                    alt={workout.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {(workout.muscleGroups || []).map((muscle) => (
                      <span
                        key={muscle}
                        className="rounded-full border border-[#ccff00]/30 bg-black/70 px-3 py-1 text-xs font-bold uppercase text-[#ccff00]"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Workout Information */}
                <div className="p-6">
                  <h3 className="mb-2 text-2xl font-black uppercase tracking-wide">
                    {workout.name}
                  </h3>

                  <p className="mb-5 text-sm text-slate-400">
                    {workout.equipment}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                      <Clock
                        size={17}
                        className="text-[#ccff00]"
                      />
                      {workout.duration} min
                    </span>

                    <span className="flex items-center gap-2">
                      <Flame
                        size={17}
                        className="text-[#ccff00]"
                      />
                      {workout.caloriesBurned} kcal
                    </span>

                    <span className="flex items-center gap-2">
                      <Star
                        size={17}
                        className="fill-[#ccff00] text-[#ccff00]"
                      />
                      {workout.rating}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#ccff00]">
                      VIEW WORKOUT
                    </span>

                    <span className="text-xl text-[#ccff00] transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-6 py-10 text-center">
        <p className="text-slate-400">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </footer>
    </main>
  );
}