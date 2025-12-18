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
  const showEnglishParam = searchParams.get("showEnglish");

  const initialPreset: SubtitlePreset = VALID_PRESETS.includes(
    presetParam as SubtitlePreset
  )
    ? (presetParam as SubtitlePreset)
    : "classic";

  const initialPosition: SubtitlePosition = VALID_POSITIONS.includes(
    positionParam as SubtitlePosition
  )
    ? (positionParam as SubtitlePosition)
    : "bottom-center";

  const initialShowEnglish = showEnglishParam !== "false";

  const [preset, setPreset] = useState<SubtitlePreset>(initialPreset);
  const [position, setPosition] = useState<SubtitlePosition>(initialPosition);
  const [showEnglish, setShowEnglish] = useState(initialShowEnglish);
  const [jpText, setJpText] = useState("");
  const [enText, setEnText] = useState("");

  const handleMessage = useCallback((message: SubtitleMessage) => {
    if (message.type === "clear") {
      setJpText("");
      setEnText("");
      return;
    }

    if (message.type === "settings") {
      if (VALID_PRESETS.includes(message.preset as SubtitlePreset)) {
        setPreset(message.preset as SubtitlePreset);
      }
      if (VALID_POSITIONS.includes(message.position as SubtitlePosition)) {
        setPosition(message.position as SubtitlePosition);
      }
      setShowEnglish(message.showEnglish);
      return;
    }

    if (message.type === "subtitle") {
      setJpText(message.jpText);

      if (message.enText) {
        setEnText(message.enText);
      } else if (message.isFinal && !message.enText) {
        setEnText("");
      }
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
      showEnglish={showEnglish}
    />
  );
}
