"use client";

import {
  useAppearanceStore,
  SubtitlePosition,
} from "@/app/store/useAppearanceStore";

const POSITIONS: { key: SubtitlePosition; label: string }[] = [
  { key: "bottom-left", label: "左" },
  { key: "bottom-center", label: "中央" },
  { key: "bottom-right", label: "右" },
];

export function PositionSelector() {
  const { position, setPosition } = useAppearanceStore();

  return (
    <div className="space-y-2 sm:space-y-3">
      <p className="text-xs sm:text-sm text-yomi-text-sub">位置</p>
      <div className="grid grid-cols-3 gap-2">
        {POSITIONS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPosition(p.key)}
            className={`preset-btn ${position === p.key ? "selected" : ""}`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
