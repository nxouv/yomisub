"use client";

import { SubtitlePreset, SubtitlePosition } from "@/app/store/useAppearanceStore";

type Props = {
  preset: SubtitlePreset;
  position: SubtitlePosition;
  jpText: string;
  enText?: string;
  isPreview?: boolean;
};

export function SubtitleDisplay({
  preset,
  position,
  jpText,
  enText,
  isPreview = false,
}: Props) {
  if (isPreview) {
    return (
      <div className="yomi-preview-canvas">
        <div className={`overlay-pos-${position}`}>
          <div className={`yomi-caption-box preset-${preset}`}>
            <p className="yomi-caption-line jp">{jpText}</p>
            {enText && <p className="yomi-caption-line en">{enText}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-transparent pointer-events-none">
      <div className={`overlay-pos-${position}`}>
        <div className={`yomi-caption-box preset-${preset}`}>
          <p className="yomi-caption-line jp">{jpText}</p>
          {enText && <p className="yomi-caption-line en">{enText}</p>}
        </div>
      </div>
    </div>
  );
}
