 
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Dumbbell, Bookmark } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();

  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      try {
        const plan = JSON.parse(
          localStorage.getItem("fitlog-plan") || "[]"
        );

        const saved = JSON.parse(
          localStorage.getItem("fitlog-saved") || "[]"
        );

        setPlanCount(Array.isArray(plan) ? plan.length : 0);
        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch {
        setPlanCount(0);
        setSavedCount(0);
      }
    };

    updateCounts();

    // Update when localStorage changes in another tab
    window.addEventListener("storage", updateCounts);

    // Refresh counts after navigation or same-tab updates
    const interval = window.setInterval(updateCounts, 1000);

    return () => {
      window.removeEventListener("storage", updateCounts);
      window.clearInterval(interval);
    };
  }, [pathname]);

  const navLinkClass = (active: boolean) =>
    `font-semibold transition ${
      active
        ? "text-[#ccff00]"
        : "text-white hover:text-[#ccff00]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b10]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Dumbbell className="text-[#ccff00]" size={28} />

          <span className="text-xl font-black tracking-wider text-white">
            FITLOG<span className="text-[#ccff00]">.</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">

          <Link
            href="/"
            className={navLinkClass(pathname === "/")}
          >
            Workout
          </Link>

          <Link
            href="/my-plan"
            className={navLinkClass(pathname === "/my-plan")}
          >
            My Plan
          </Link>

          {/* Plan counter */}
          <Link
            href="/my-plan"
            className="flex items-center gap-2 rounded-full bg-[#ccff00] px-3 py-2 font-bold text-black transition hover:bg-white sm:px-4"
          >
            <Dumbbell size={17} />

            <span>Plan</span>

            <span className="min-w-5 rounded-full bg-black/10 px-1.5 text-center text-sm">
              {planCount}
            </span>
          </Link>

          {/* Saved counter */}
          <Link
            href="/my-plan"
            className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-white transition hover:border-[#ccff00] hover:text-[#ccff00] sm:px-4"
          >
            <Bookmark size={17} />

            <span>Saved</span>

            <span className="min-w-5 rounded-full bg-white/10 px-1.5 text-center text-sm">
              {savedCount}
            </span>
          </Link>

        </div>
      </nav>
    </header>
  );
}