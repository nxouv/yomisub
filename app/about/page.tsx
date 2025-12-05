import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "YomiSubについて | YomiSub",
  description:
    "YomiSubは配信者の声をリアルタイムで英語字幕に変換するツールです。OBSにURLを貼るだけで使えて、無料・登録不要。開発の思いや特徴を紹介します。",
  openGraph: {
    title: "YomiSubについて | YomiSub",
    description:
      "YomiSubは配信者の声をリアルタイムで英語字幕に変換するツールです。OBSにURLを貼るだけで使えて、無料・登録不要。開発の思いや特徴を紹介します。",
    url: "/about",
  },
  twitter: {
    title: "YomiSubについて | YomiSub",
    description:
      "YomiSubは配信者の声をリアルタイムで英語字幕に変換するツールです。OBSにURLを貼るだけで使えて、無料・登録不要。開発の思いや特徴を紹介します。",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <Shell>
      <article className="max-w-xl mx-auto py-8 sm:py-12">
        {/* タイトル：アイコン + About（縦並び） */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-yomi-accent flex items-center justify-center mb-3">
            <span className="text-white text-xl sm:text-2xl font-bold">Y</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-yomi-text">About</h1>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-yomi-text leading-relaxed">
          <p>
            YomiSubは
            <a
              href="https://x.com/nxouv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yomi-accent hover:underline"
            >
              なな太郎
            </a>
            が開発している、配信者のための字幕ツールです。
          </p>

          <p>
            日本語で配信していると、海外のリスナーが見に来てくれることがあります。でも言葉が通じないと、せっかく来てくれても配信の面白さが伝わらない。それはもったいないなと思っていました。
          </p>

          <p>
            そこで、配信者の声をリアルタイムで英語字幕に変換するツールを作ることにしました。OBSにURLを貼るだけで使えて、難しい設定は必要ありません。
          </p>

          <p>
            すべての処理はブラウザ内で完結するので、音声データが外部に送られることもありません。無料で、登録も不要です。
          </p>

          <p>
            海外のリスナーにも配信の面白さが伝わるように。そんな思いで開発しています。
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-yomi-border">
          <h2 className="text-lg font-semibold text-yomi-text mb-3">使い方</h2>
          <p className="text-sm sm:text-base text-yomi-text">
            →{" "}
            <a
              href="https://haishinsekai.jp/yomisub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yomi-accent hover:underline"
            >
              使い方の詳しい解説はこちら
            </a>
          </p>
        </div>
      </article>
    </Shell>
  );
}
