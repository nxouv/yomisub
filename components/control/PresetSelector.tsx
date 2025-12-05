"use client";

import {
  useAppearanceStore,
  SubtitlePreset,
} from "@/app/store/useAppearanceStore";

const PRESETS: { key: SubtitlePreset; label: string; description: string }[] = [
  {
    key: "classic",
    label: "Classic",
    description: "どんな配信でも使える標準的な字幕。",
  },
  {
    key: "game",
    label: "Game",
    description: "ゲーム画面の上でも読みやすいスタイル。",
  },
  {
    key: "soft",
    label: "Soft",
    description: "VTuberや雑談配信向けのやわらかい印象。",
  },
  {
    key: "clear",
    label: "Clear",
    description: "ミニマルでおしゃれな配信画面向け。",
  },
];

export function PresetSelector() {
  const { preset, setPreset } = useAppearanceStore();
  const currentPreset = PRESETS.find((p) => p.key === preset);

  return (
    <div className="space-y-2 sm:space-y-3">
      <p className="text-xs sm:text-sm text-yomi-text-sub">字幕プリセット</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPreset(p.key)}
            className={`preset-btn ${preset === p.key ? "selected" : ""}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] sm:text-xs text-yomi-text-sub min-h-[2.5em]">
        {currentPreset?.description}
      </p>
    </div>
  );
}
