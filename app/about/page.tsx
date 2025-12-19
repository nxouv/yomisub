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
      <article className="max-w-2xl mx-auto py-8 sm:py-12 px-4">
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <Image
            src="/icon.png"
            alt="YomiSub"
            width={72}
            height={72}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl mx-auto mb-4"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-yomi-text mb-3">YomiSub</h1>
          <p className="text-yomi-text-sub text-base sm:text-lg">
            配信者のためのリアルタイム字幕ツール
          </p>
        </div>

        {/* 特徴カード */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          <div className="bg-yomi-card border border-yomi-border rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-yomi-text mb-1">かんたん設定</h3>
            <p className="text-sm text-yomi-text-sub">URLをOBSにドラッグするだけ</p>
          </div>
          <div className="bg-yomi-card border border-yomi-border rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">🆓</div>
            <h3 className="font-semibold text-yomi-text mb-1">無料・登録不要</h3>
            <p className="text-sm text-yomi-text-sub">すぐに使い始められる</p>
          </div>
          <div className="bg-yomi-card border border-yomi-border rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-yomi-text mb-1">リアルタイム</h3>
            <p className="text-sm text-yomi-text-sub">話した瞬間に字幕表示</p>
          </div>
        </div>

        {/* YomiSubとは */}
        <section className="mb-14">
          <h2 className="text-lg font-semibold text-yomi-text mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-yomi-accent rounded-full"></span>
            YomiSubとは
          </h2>
          <div className="space-y-3 text-sm sm:text-base text-yomi-text-sub leading-relaxed">
            <p>
              YomiSub（よみさぶ）は、
              <a
                href="https://x.com/nxouv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yomi-accent hover:underline"
              >
                なな太郎
              </a>
              が開発した配信者のためのリアルタイム字幕ツールです。
            </p>
            <p>
              話した言葉が自動で日本語・英語字幕になり、OBSの配信画面に表示されます。
              英語翻訳のオン・オフも切り替えられます。
            </p>
            <div className="bg-yomi-bg border border-yomi-border rounded-lg p-4 mt-4">
              <p className="text-sm font-medium text-yomi-text">
                ⚠️ 動作環境：Google Chrome 138以降
              </p>
            </div>
          </div>
        </section>

        {/* 使いかた */}
        <section className="mb-14">
          <h2 className="text-lg font-semibold text-yomi-text mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-yomi-accent rounded-full"></span>
            使いかた
          </h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "「字幕デザイン」を選ぶ", desc: "プリセット（Classic / Game / Soft / Clear）と表示位置を選びます" },
              { step: 2, title: "「字幕コントロール」を設定", desc: "使用するマイクを選び、英語翻訳が必要ならオンにします" },
              { step: 3, title: "「OBSに接続」でURLをドラッグ", desc: "「OBS用URL」の左にあるアイコンをOBSの配信画面にドラッグするか、URLをコピーしてブラウザソースに貼り付けます" },
              { step: 4, title: "字幕を開始", desc: "「字幕を開始」をクリックすると、話した言葉がリアルタイムで字幕になります" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-yomi-accent text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-yomi-text mb-1">{item.title}</p>
                  <p className="text-sm text-yomi-text-sub">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 次回以降の配信 */}
        <section className="mb-14">
          <h2 className="text-lg font-semibold text-yomi-text mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-yomi-accent rounded-full"></span>
            次回以降の配信
          </h2>
          <div className="bg-yomi-card border border-yomi-border rounded-xl p-5">
            <p className="text-sm sm:text-base text-yomi-text-sub leading-relaxed">
              設定はブラウザに自動保存されます。<br />
              次回の配信では、YomiSubを開いて「字幕を開始」を押すだけでOKです。
            </p>
            <p className="text-sm sm:text-base text-yomi-text-sub leading-relaxed mt-3">
              OBSのブラウザソースもそのまま。URLを再設定する必要はありません。
            </p>
          </div>
        </section>

        {/* うまくいかないとき */}
        <section>
          <h2 className="text-lg font-semibold text-yomi-text mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-yomi-accent rounded-full"></span>
            うまくいかないとき
          </h2>
          <div className="space-y-4">
            <div className="bg-yomi-bg border border-yomi-border rounded-lg p-4">
              <p className="font-medium text-yomi-text mb-1">字幕が表示されない</p>
              <p className="text-sm text-yomi-text-sub">
                URLバーの左にあるアイコンをクリックして「マイク」の権限を確認してください。
                マイクを選択し直すと認識することがあります。
              </p>
            </div>
            <div className="bg-yomi-bg border border-yomi-border rounded-lg p-4">
              <p className="font-medium text-yomi-text mb-1">マイクが認識されない</p>
              <p className="text-sm text-yomi-text-sub">
                ブラウザのマイク許可を確認してください。
              </p>
            </div>
            <div className="bg-yomi-bg border border-yomi-border rounded-lg p-4">
              <p className="font-medium text-yomi-text mb-1">英語翻訳が出ない</p>
              <p className="text-sm text-yomi-text-sub">
                Chrome 138以降が必要です。Google Chromeが最新版かどうか確認してみてください。
              </p>
            </div>
          </div>
        </section>
      </article>
    </Shell>
  );
}
