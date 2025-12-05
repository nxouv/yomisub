"use client";

import { useRef, useState, useCallback } from "react";

type TranslatorStatus = "idle" | "initializing" | "downloading" | "ready" | "error";

type UseTranslatorProps = {
  sourceLanguage?: string;
  targetLanguage?: string;
};

type TranslatorInstance = {
  translate: (text: string) => Promise<string>;
};

declare global {
  interface Window {
    Translator?: {
      availability: (options: {
        sourceLanguage: string;
        targetLanguage: string;
      }) => Promise<"unavailable" | "downloadable" | "downloading" | "available">;
      create: (options: {
        sourceLanguage: string;
        targetLanguage: string;
        monitor?: (monitor: {
          addEventListener: (
            event: "downloadprogress",
            callback: (e: { loaded: number }) => void
          ) => void;
        }) => void;
      }) => Promise<TranslatorInstance>;
    };
  }
}

// 感嘆詞ホワイトリスト
const EXCLAMATION_WHITELIST = /^(?:やばい|すごい|えっ|うわ|まじ|きた|よし|ええ|おお|わあ)$/;

// 「言いさし」助詞パターン
const OPEN_ENDING_PATTERNS = /(?:て|で|から|けど|けれど|ので|のに|たら|ながら|し|が|は|を|に|へ|も|と|や|たり|だし)$/;

export function prepareForTranslation(text: string): {
  processedText: string;
  isWhitelisted: boolean;
} {
  const trimmed = text.trim();

  if (!trimmed) {
    return { processedText: "", isWhitelisted: false };
  }

  const isWhitelisted = EXCLAMATION_WHITELIST.test(trimmed);

  if (/[。！？!?、.,…]$/.test(trimmed) || /\.\.\.$/.test(trimmed)) {
    return { processedText: trimmed, isWhitelisted };
  }

  if (OPEN_ENDING_PATTERNS.test(trimmed)) {
    return { processedText: trimmed + "…", isWhitelisted };
  }

  if (isWhitelisted) {
    return { processedText: trimmed + "！", isWhitelisted };
  }

  return { processedText: trimmed + "。", isWhitelisted };
}

export function shouldTranslate(text: string, isWhitelisted: boolean): boolean {
  const trimmed = text.trim();

  if (!trimmed) {
    return false;
  }

  if (isWhitelisted) {
    return true;
  }

  if (trimmed.length <= 2) {
    return false;
  }

  return true;
}

export function useTranslator({
  sourceLanguage = "ja",
  targetLanguage = "en",
}: UseTranslatorProps = {}) {
  const translatorRef = useRef<TranslatorInstance | null>(null);
  const [status, setStatus] = useState<TranslatorStatus>("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const initializingRef = useRef(false);

  const initialize = useCallback(async (): Promise<boolean> => {
    if (translatorRef.current && status === "ready") {
      return true;
    }

    if (initializingRef.current) {
      return false;
    }

    initializingRef.current = true;
    setStatus("initializing");
    setError(null);

    try {
      if (!window.Translator) {
        throw new Error(
          "このブラウザは翻訳機能に対応していません。Chrome 138以降をお使いください。"
        );
      }

      const availability = await window.Translator.availability({
        sourceLanguage,
        targetLanguage,
      });

      if (availability === "unavailable") {
        throw new Error(
          `${sourceLanguage}→${targetLanguage}の翻訳は対応していません。`
        );
      }

      // ダウンロードが必要な場合のみ進捗表示
      if (availability === "downloadable" || availability === "downloading") {
        setStatus("downloading");
        setDownloadProgress(0);
      }

      const translator = await window.Translator.create({
        sourceLanguage,
        targetLanguage,
        monitor: (monitor) => {
          monitor.addEventListener("downloadprogress", (e) => {
            setDownloadProgress(Math.round(e.loaded * 100));
          });
        },
      });

      translatorRef.current = translator;
      setStatus("ready");
      setDownloadProgress(100);
      setError(null);
      initializingRef.current = false;
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "翻訳機能の初期化に失敗しました。";

      setError(errorMessage);
      setStatus("error");
      initializingRef.current = false;
      return false;
    }
  }, [sourceLanguage, targetLanguage, status]);

  const translate = useCallback(
    async (text: string): Promise<string | null> => {
      if (!translatorRef.current || status !== "ready") {
        return null;
      }

      const { processedText, isWhitelisted } = prepareForTranslation(text);

      if (!shouldTranslate(text, isWhitelisted)) {
        return null;
      }

      try {
        const result = await translatorRef.current.translate(processedText);
        return result;
      } catch (err) {
        console.error("翻訳エラー:", err);
        return null;
      }
    },
    [status]
  );

  const reset = useCallback(() => {
    translatorRef.current = null;
    setStatus("idle");
    setDownloadProgress(0);
    setError(null);
    initializingRef.current = false;
  }, []);

  return {
    initialize,
    translate,
    reset,
    status,
    downloadProgress,
    error,
    isReady: status === "ready",
  };
}
