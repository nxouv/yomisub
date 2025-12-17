"use client";

import { useEffect, useRef, useCallback } from "react";
import Ably from "ably";

export type SubtitleMessage =
  | {
    type: "subtitle";
    jpText: string;
    enText?: string;
    isFinal: boolean;
  }
  | {
    type: "clear";
  };

type UseSubtitleChannelProps = {
  sessionId: string;
  onMessage?: (message: SubtitleMessage) => void;
};

export function useSubtitleChannel({
  sessionId,
  onMessage,
}: UseSubtitleChannelProps) {
  const ablyRef = useRef<Ably.Realtime | null>(null);
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const apiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY;
    if (!apiKey) {
      console.error("NEXT_PUBLIC_ABLY_API_KEY is not set");
      return;
    }

    // OBS環境検出してトランスポートを設定
    const isOBS = typeof window !== "undefined" && !!(window as any).obsstudio;

    const ably = new Ably.Realtime({
      key: apiKey,
      transports: isOBS ? ["xhr_streaming", "xhr_polling"] : undefined,
    });

    ablyRef.current = ably;

    const channel = ably.channels.get(`yomisub-${sessionId}`);
    channelRef.current = channel;

    if (onMessage) {
      channel.subscribe("subtitle", (message) => {
        onMessage(message.data as SubtitleMessage);
      });
    }

    ably.connection.on("connected", () => {
      console.log("Ably connected");
    });

    ably.connection.on("failed", (err) => {
      console.error("Ably connection failed:", err);
    });

    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, [sessionId, onMessage]);

  const send = useCallback((message: SubtitleMessage) => {
    if (channelRef.current) {
      channelRef.current.publish("subtitle", message);
    }
  }, []);

  return { send };
}
