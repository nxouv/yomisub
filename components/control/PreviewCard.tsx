"use client";

import { useAppearanceStore } from "@/app/store/useAppearanceStore";
import { SubtitleDisplay } from "@/components/subtitle/SubtitleDisplay";
import { PresetSelector } from "./PresetSelector";
import { PositionSelector } from "./PositionSelector";

export function PreviewCard() {
  const { preset, position } = useAppearanceStore();

  return (
    <section className="card-yomi flex flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-yomi-text">字幕デザイン</h2>
        <p className="text-xs sm:text-sm text-yomi-text-sub mt-1">
          プリセットと位置を選んで、プレビューで確認できます。
        </p>
      </div>

      <div className="-mx-4 sm:-mx-4">
        <SubtitleDisplay
          preset={preset}
          position={position}
          jpText="こんにちは、これはプレビューです。"
          enText="Hello, this is a preview."
          isPreview
        />
      </div>

      <PresetSelector />
      <PositionSelector />
    </section>
  );
}
