import type { Metadata } from "next";
import Image from "next/image";
import { Shell } from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "YomiSubについて | YomiSub",
  description:
    "YomiSubは配信者の声をリアルタイムで字幕に変換するツールです。OBSにURLを貼るだけで使えて、無料・登録不要。",
  openGraph: {
    title: "YomiSubについて | YomiSub",
    description:
      "YomiSubは配信者の声をリアルタイムで字幕に変換するツールです。OBSにURLを貼るだけで使えて、無料・登録不要。",
    url: "/about",
  },
  twitter: {
    title: "YomiSubについて | YomiSub",
    description:
      "YomiSubは配信者の声をリアルタイムで字幕に変換するツールです。OBSにURLを貼るだけで使えて、無料・登録不要。",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <Shell>
      <article className="max-w-xl mx-auto py-8 sm:py-12">
        {/* タイトル */}
        <div className="flex flex-col items-center mb-12">
          <Image
            src="/icon.png"
            alt="YomiSub"
            width={56}
            height={56}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-3"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-yomi-text">YomiSubについて</h1>
        </div>

        <div className="space-y-10">
          {/* このツールについて */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-yomi-text">YomiSubとは</h2>
            <div className="space-y-3 text-sm sm:text-base text-yomi-text-sub leading-relaxed">
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
                が作った、配信者のためのリアルタイム字幕ツールです。
              </p>
              <p>
                話した言葉が自動で日本語・英語の字幕になって、OBSの配信画面に表示できます。
              </p>
              <p>
                英語翻訳をオンにすれば、海外のリスナーにも配信の内容が伝わります。日本語のみも可能です。
              </p>
            </div>
          </section>

          {/* 特徴 */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-yomi-text">特徴</h2>
            <div className="space-y-3 text-sm sm:text-base text-yomi-text-sub leading-relaxed">
              <p>
                <span className="text-yomi-text font-medium">かんたん設定</span> — 難しい設定は必要なし。URLをOBSに貼るだけ。
              </p>
              <p>
                <span className="text-yomi-text font-medium">無料・登録不要</span> — アカウント作成なしで、すぐに使い始められる。
              </p>
              <p>
                <span className="text-yomi-text font-medium">リアルタイム</span> — 話した瞬間に字幕が表示される。
              </p>
            </div>
          </section>

          {/* 使い方 */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-yomi-text">使いかた</h2>
            <div className="space-y-4 text-sm sm:text-base text-yomi-text-sub leading-relaxed">
              <div className="space-y-1">
                <p className="text-yomi-text font-medium">1. 字幕デザインを選ぶ</p>
                <p>プリセット（Classic / Game / Soft / Clear）と表示位置を選びます</p>
              </div>
              <div className="space-y-1">
                <p className="text-yomi-text font-medium">2. 字幕コントロールを設定</p>
                <p>使用するマイクを選び、英語翻訳が必要ならオンにします</p>
              </div>
              <div className="space-y-1">
                <p className="text-yomi-text font-medium">3. OBSに接続</p>
                <p>「OBS用URL」の左にあるアイコンをOBSの配信画面にドラッグするか、URLをコピーしてブラウザソースに貼り付けます</p>
              </div>
              <div className="space-y-1">
                <p className="text-yomi-text font-medium">4. 字幕を開始</p>
                <p>「字幕を開始」をクリックすると、話した言葉がリアルタイムで字幕になります</p>
              </div>
            </div>
          </section>
          {/* うまくいかないとき */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-yomi-text">うまくいかないとき</h2>
            <div className="space-y-3 text-sm sm:text-base text-yomi-text-sub leading-relaxed">
              <p>
                <span className="text-yomi-text font-medium">字幕が表示されない</span> — 「字幕を停止」をクリックしてから、もう一度「字幕を開始」をクリックしてみてください
              </p>
              <p>
                <span className="text-yomi-text font-medium">マイクが認識されない</span> — ブラウザのマイク許可を確認してください
              </p>
              <p>
                <span className="text-yomi-text font-medium">英語翻訳が出ない</span> — Chrome 138以降が必要です。GoogleChromeが最新版かどうか確認してみてください
              </p>
            </div>
          </section>
        </div>
      </article>
    </Shell>
  );
}
