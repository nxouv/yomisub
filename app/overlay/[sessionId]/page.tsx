"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useCallback } from "react";
import { SubtitleDisplay } from "@/components/subtitle/SubtitleDisplay";
import {
  SubtitlePreset,
  SubtitlePosition,
} from "@/app/store/useAppearanceStore";
import {
  useSubtitleChannel,
  SubtitleMessage,
} from "@/app/hooks/useSubtitleChannel";

const VALID_PRESETS: SubtitlePreset[] = ["classic", "game", "soft", "clear"];
const VALID_POSITIONS: SubtitlePosition[] = [
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export default function OverlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const sessionId = params.sessionId as string;

  const presetParam = searchParams.get("preset");
  const positionParam = searchParams.get("position");

  const preset: SubtitlePreset = VALID_PRESETS.includes(
    presetParam as SubtitlePreset
  )
    ? (presetParam as SubtitlePreset)
    : "classic";

  const position: SubtitlePosition = VALID_POSITIONS.includes(
    positionParam as SubtitlePosition
  )
    ? (positionParam as SubtitlePosition)
    : "bottom-center";

  const [jpText, setJpText] = useState("");
  const [enText, setEnText] = useState("");

  const handleMessage = useCallback((message: SubtitleMessage) => {
    if (message.type === "clear") {
      setJpText("");
      setEnText("");
      return;
    }

    if (message.type === "subtitle") {
      setJpText(message.jpText);

      // 英語字幕の更新
      if (message.enText) {
        setEnText(message.enText);
      } else if (message.isFinal && !message.enText) {
        // 確定時に英語がない場合はクリア（翻訳OFFまたは翻訳失敗）
        setEnText("");
      }
      // 中間結果の場合は英語をそのまま維持（前の翻訳を表示し続ける）
    }
  }, []);

  useSubtitleChannel({ sessionId, onMessage: handleMessage });

  if (!jpText) {
    return <div className="fixed inset-0 bg-transparent pointer-events-none" />;
  }

  return (
    <SubtitleDisplay
      preset={preset}
      position={position}
      jpText={jpText}
      enText={enText || undefined}
    />
  );
}
