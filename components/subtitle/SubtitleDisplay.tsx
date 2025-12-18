"use client";

import { SubtitlePreset, SubtitlePosition } from "@/app/store/useAppearanceStore";

type Props = {
  preset: SubtitlePreset;
  position: SubtitlePosition;
  jpText: string;
  enText?: string;
  isPreview?: boolean;
  showEnglish?: boolean;
};

export function SubtitleDisplay({
  preset,
  position,
  jpText,
  enText,
  isPreview = false,
  showEnglish = true,
}: Props) {
  if (isPreview) {
    return (
      <div className="yomi-preview-canvas">
        <div className={`overlay-pos-${position}`}>
          <div className={`yomi-caption-box preset-${preset}`}>
            <p className="yomi-caption-line jp">{jpText}</p>
            {showEnglish && (
              <p className={`yomi-caption-line en ${enText ? '' : 'invisible'}`}>
                {enText || '\u00A0'}
              </p>
            )}
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
          {showEnglish && (
            <p className={`yomi-caption-line en ${enText ? '' : 'invisible'}`}>
              {enText || '\u00A0'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
