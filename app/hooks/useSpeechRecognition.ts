"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// SpeechRecognition の型定義（ビルドエラー回避のため）
type SpeechRecognitionType = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventType) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventType) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventType = {
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
};

type SpeechRecognitionErrorEventType = {
  error: string;
};

type SpeechRecognitionResult = {
  transcript: string;
  isFinal: boolean;
};

type UseSpeechRecognitionProps = {
  onResult: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
  language?: string;
  deviceId?: string;
};

// 文字数に応じた無音待ち時間（ミリ秒）
function getSilenceThreshold(charCount: number): number {
  if (charCount <= 5) return 650;
  if (charCount <= 10) return 550;
  if (charCount <= 20) return 450;
  return 400;
}

const FORCE_SPLIT_CHAR_COUNT = 25;
const MIN_SPLIT_INTERVAL = 300;
const EMERGENCY_SPLIT_MS = 8000;

export function useSpeechRecognition({
  onResult,
  onError,
  language = "ja-JP",
  deviceId,
}: UseSpeechRecognitionProps) {
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);

  const currentTranscriptRef = useRef("");
  const lastTranscriptRef = useRef("");
  const lastActivityAtRef = useRef(0);
  const lastSplitAtRef = useRef(0);
  const silenceCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearSilenceCheck = useCallback(() => {
    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }
  }, []);

  const executeSplit = useCallback(() => {
    const transcript = currentTranscriptRef.current.trim();
    const now = Date.now();

    if (now - lastSplitAtRef.current < MIN_SPLIT_INTERVAL) {
      return;
    }

    if (transcript) {
      onResult({ transcript, isFinal: true });
      currentTranscriptRef.current = "";
      lastTranscriptRef.current = "";
      lastSplitAtRef.current = now;
      lastActivityAtRef.current = now;
    }
  }, [onResult]);

  const startSilenceCheck = useCallback(() => {
    clearSilenceCheck();

    silenceCheckIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const transcript = currentTranscriptRef.current;
      const charCount = transcript.trim().length;

      if (charCount === 0) return;

      const timeSinceActivity = now - lastActivityAtRef.current;
      const timeSinceLastSplit = now - lastSplitAtRef.current;
      const threshold = getSilenceThreshold(charCount);

      if (timeSinceLastSplit >= EMERGENCY_SPLIT_MS) {
        executeSplit();
        return;
      }

      if (charCount >= FORCE_SPLIT_CHAR_COUNT && timeSinceLastSplit >= MIN_SPLIT_INTERVAL) {
        executeSplit();
        return;
      }

      if (timeSinceActivity >= threshold) {
        executeSplit();
      }
    }, 100);
  }, [clearSilenceCheck, executeSplit]);

  const stop = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    clearSilenceCheck();

    if (currentTranscriptRef.current.trim()) {
      onResult({ transcript: currentTranscriptRef.current.trim(), isFinal: true });
      currentTranscriptRef.current = "";
      lastTranscriptRef.current = "";
    }

    if (recognitionRef.current) {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      try {
        recognition.stop();
      } catch {
        // 既に停止している場合のエラーを無視
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, [clearSilenceCheck, onResult]);

  const start = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      onError?.("このブラウザは音声認識に対応していません。Chromeをお使いください。");
      return;
    }

    const recognition = new SpeechRecognitionAPI() as SpeechRecognitionType;
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const lastIndex = event.results.length - 1;
      const result = event.results[lastIndex];
      const transcript = result[0].transcript;
      const now = Date.now();

      if (result.isFinal) {
        currentTranscriptRef.current = transcript;
        executeSplit();
      } else {
        currentTranscriptRef.current = transcript;

        if (transcript !== lastTranscriptRef.current) {
          lastActivityAtRef.current = now;
          lastTranscriptRef.current = transcript;
        }

        onResult({ transcript, isFinal: false });
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        onError?.("マイクへのアクセスが拒否されました。");
      } else if (event.error === "audio-capture") {
        onError?.("マイクが見つかりません。");
      } else if (event.error === "no-speech" || event.error === "aborted") {
        // 無音または停止時は無視
      } else {
        onError?.(`音声認識エラー: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // 既に開始している場合のエラーを無視
        }
      }
    };

    recognitionRef.current = recognition;

    try {
      const constraints: MediaStreamConstraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const now = Date.now();

      isListeningRef.current = true;
      setIsListening(true);
      currentTranscriptRef.current = "";
      lastTranscriptRef.current = "";
      lastActivityAtRef.current = now;
      lastSplitAtRef.current = now;

      startSilenceCheck();
      recognition.start();
    } catch {
      console.error("Failed to start speech recognition");
      onError?.("音声認識の開始に失敗しました。マイクの設定を確認してください。");
    }
  }, [language, deviceId, onResult, onError, executeSplit, startSilenceCheck]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop, isListening };
}
