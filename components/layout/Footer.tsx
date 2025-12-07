import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* メインコンテンツ：横並び */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-8">
          {/* 左：ブランド情報 */}
          <div className="space-y-1">
            <Link href="/" className="text-lg font-semibold text-yomi-text hover:opacity-80 transition-opacity">
              YomiSub
            </Link>
            <p className="text-sm text-yomi-text-sub">
              配信をリアルタイムで英語字幕に
            </p>
            <p className="text-sm text-yomi-text-sub">
              Made with 💙 by{" "}
              <a
                href="https://x.com/nxouv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yomi-accent hover:underline"
              >
                なな太郎
              </a>
            </p>
          </div>

          {/* 右：ナビゲーション */}
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/" className="text-yomi-text-sub hover:text-yomi-text">
              ホーム
            </Link>
            <Link href="/about" className="text-yomi-text-sub hover:text-yomi-text">
              YomiSubについて
            </Link>
          </nav>
        </div>

        {/* コピーライト */}
        <div className="mt-10">
          <p className="text-xs text-yomi-text-sub">© 2025 YomiSub</p>
        </div>
      </div>
    </footer>
  );
}
