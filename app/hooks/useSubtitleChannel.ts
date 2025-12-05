"use client";

import { useEffect, useRef, useCallback } from "react";

export type SubtitleMessage = {
  type: "subtitle";
  jpText: string;
  enText?: string;
  isFinal: boolean;
} | {
  type: "clear";
};

type UseSubtitleChannelProps = {
  sessionId: string;
  onMessage?: (message: SubtitleMessage) => void;
};

export function useSubtitleChannel({ sessionId, onMessage }: UseSubtitleChannelProps) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const channel = new BroadcastChannel(`yomisub-${sessionId}`);
    channelRef.current = channel;

    if (onMessage) {
      channel.onmessage = (event) => {
        onMessage(event.data as SubtitleMessage);
      };
    }

    return () => {
      channel.close();
    };
  }, [sessionId, onMessage]);

  const send = useCallback((message: SubtitleMessage) => {
    if (channelRef.current) {
      channelRef.current.postMessage(message);
    }
  }, []);

  return { send };
}
