"use client";

import { useEffect, useState, useRef } from "react";
import { useSessionStore } from "@/app/store/useSessionStore";
import { useAppearanceStore } from "@/app/store/useAppearanceStore";
import { useSubtitleChannel } from "@/app/hooks/useSubtitleChannel";

const PRESET_LABELS = {
  classic: "Classic",
  game: "Game",
  soft: "Soft",
  clear: "Clear",
} as const;

const POSITION_LABELS = {
  "bottom-left": "左",
  "bottom-center": "中央",
  "bottom-right": "右",
} as const;

export function ConnectionCard() {
  const { sessionId, generateNewSession, translationEnabled } = useSessionStore();
  const { preset, position } = useAppearanceStore();
  const [baseUrl, setBaseUrl] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const isFirstRender = useRef(true);

  const { send } = useSubtitleChannel({ sessionId });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!sessionId) {
      generateNewSession();
    }
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, [isHydrated, sessionId, generateNewSession]);

  // 設定変更時にOBSに送信
  useEffect(() => {
    // 初回レンダリング時は送信しない
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (sessionId) {
      send({
        type: "settings",
        preset,
        position,
        showEnglish: translationEnabled,
      });
    }
  }, [preset, position, translationEnabled, sessionId, send]);

  const overlayUrl = baseUrl && sessionId
    ? `${baseUrl}/overlay/${sessionId}?preset=${preset}&position=${position}&showEnglish=${translationEnabled}`
    : "";

  const handleCopy = async () => {
    if (!overlayUrl) return;
    try {
      await navigator.clipboard.writeText(overlayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("コピーに失敗しました", e);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!overlayUrl) return;

    e.dataTransfer.setData("text/plain", overlayUrl);
    e.dataTransfer.setData("text/uri-list", overlayUrl);
    e.dataTransfer.setData("text/x-moz-url", overlayUrl);

    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <section className="card-yomi flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-yomi-text">OBS に接続</h2>
        <p className="text-sm text-yomi-text-sub mt-1">
          URLをOBSのブラウザソースに設定してください。
        </p>
      </div>

      {/* OBS用URL */}
      <div className="space-y-2">
        <p className="text-xs text-yomi-text-sub">OBS 用 URL</p>
        <div className="flex items-center gap-2 bg-yomi-bg border border-yomi-border rounded-lg px-3 py-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded bg-yomi-card border border-yomi-border cursor-grab active:cursor-grabbing select-none shrink-0"
            draggable
            onDragStart={handleDragStart}
            title="OBS にドラッグ＆ドロップ"
          >
            <span className="text-xs text-yomi-text-sub">⋮⋮</span>
          </div>
          <span className="flex-1 text-sm text-yomi-text break-all">
            {overlayUrl || "読み込み中…"}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs rounded border border-yomi-border bg-yomi-card hover:bg-yomi-border text-yomi-text-sub hover:text-yomi-text transition-colors shrink-0"
          >
            {copied ? "コピー済み" : "コピー"}
          </button>
        </div>
        <p className="text-xs text-yomi-text-sub">
          左のアイコンをOBSの配信画面にドラッグしてください。もしくはURLをコピーしてブラウザソースに貼り付けてください。
        </p>
      </div>

      {/* テスト表示 */}
      {overlayUrl && (
        <a
          href={`/overlay/${sessionId}?preset=${preset}&position=${position}&showEnglish=${translationEnabled}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-yomi-accent hover:text-yomi-accent-hover underline underline-offset-2"
        >
          ブラウザでテスト表示 →
        </a>
      )}

      {/* 現在の設定 */}
      <div className="space-y-2">
        <p className="text-xs text-yomi-text-sub">現在の設定</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yomi-border/50 px-3 py-1 text-xs text-yomi-text">
            <span className="opacity-60">字幕</span>
            <span className="font-medium">{PRESET_LABELS[preset]}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yomi-border/50 px-3 py-1 text-xs text-yomi-text">
            <span className="opacity-60">位置</span>
            <span className="font-medium">{POSITION_LABELS[position]}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yomi-border/50 px-3 py-1 text-xs text-yomi-text">
            <span className="opacity-60">英語</span>
            <span className="font-medium">{translationEnabled ? "ON" : "OFF"}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
