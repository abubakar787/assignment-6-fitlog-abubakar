 
"use client";

import Link from "next/link";
import { Dumbbell, Bookmark } from "lucide-react";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b10]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Dumbbell className="text-[#ccff00]" size={28} />
          <span className="text-xl font-black tracking-wider text-white">
            FITLOG<span className="text-[#ccff00]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-white hover:text-[#ccff00]">
            Workout
          </Link>

          <Link href="/my-plan" className="font-semibold text-white hover:text-[#ccff00]">
            My Plan
          </Link>

          <Link
            href="/my-plan"
            className="flex items-center gap-2 rounded-full bg-[#ccff00] px-4 py-2 font-bold text-black"
          >
            <Dumbbell size={17} />
            Plan
          </Link>

          <Link
            href="/my-plan"
            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white"
          >
            <Bookmark size={17} />
            Saved
          </Link>
        </div>
      </nav>
    </header>
  );
}