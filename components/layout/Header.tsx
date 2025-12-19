"use client";

import Link from "next/link";
import Image from "next/image";
import { useSessionStore } from "@/app/store/useSessionStore";

const STATUS_LABELS = {
  idle: "待機中",
  connecting: "接続中…",
  active: "認識中",
  error: "エラー",
} as const;

const STATUS_COLORS = {
  idle: "bg-yomi-text-sub",
  connecting: "bg-yellow-500",
  active: "bg-green-500",
  error: "bg-red-500",
} as const;

export function Header() {
  const { status } = useSessionStore();

  return (
    <header className="border-b border-yomi-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* ロゴ + ツール名 */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/icon.png"
            alt="YomiSub"
            width={32}
            height={32}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg"
          />
          <span className="text-sm sm:text-base font-semibold tracking-wide">YomiSub</span>
        </Link>

        {/* 状態表示 */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-yomi-card border border-yomi-border">
          <span
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${STATUS_COLORS[status]}`}
          />
          <span className="text-[10px] sm:text-xs text-yomi-text-sub">
            {STATUS_LABELS[status]}
          </span>
          <span className="hidden sm:inline text-xs text-yomi-text-sub opacity-60">
            JP → EN
          </span>
        </div>
      </div>
    </header>
  );
}
