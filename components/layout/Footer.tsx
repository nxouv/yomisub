import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
          {/* 左側：ブランド情報 */}
          <div className="space-y-2">
            <Link 
              href="/" 
              className="text-lg font-bold hover:opacity-80 transition-opacity"
            >
              YomiSub
            </Link>
            <p className="text-sm text-muted-foreground">
              配信をリアルタイムで英語字幕に
            </p>
            <p className="text-sm text-muted-foreground">
              Made with 💙 by{" "}
              <a
                href="https://x.com/nxouv"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                なな太郎
              </a>
            </p>
          </div>

          {/* 右側：ナビゲーション */}
          <div className="flex flex-col gap-2 text-sm">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ホーム
            </Link>
            <Link 
              href="/about" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              YomiSubってなに？
            </Link>
            <a
              href="https://nanataro.app/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              プライバシーポリシー
            </a>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 pt-6 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            © 2025 YomiSub
          </p>
        </div>
      </div>
    </footer>
  );
}
