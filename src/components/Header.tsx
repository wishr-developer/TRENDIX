"use client";

import Link from "next/link";

/**
 * ヘッダーコンポーネント（Xiora - Cyberpunk UI）
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020617]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-black rounded-lg border border-white/10 shadow-neon-cyan">
            <span className="text-xl font-bold text-primary">X</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-white">XIORA</h1>
            <p className="text-[10px] text-primary tracking-widest uppercase leading-none">
              Price Intelligence
            </p>
          </div>
        </Link>
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-black/50 border border-white/10 text-white text-sm rounded-full pl-4 pr-10 py-2 focus:border-primary/50 outline-none transition-all"
          />
          <svg
            className="absolute right-3 top-2 text-gray-400"
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}
