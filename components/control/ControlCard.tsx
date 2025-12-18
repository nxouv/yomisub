"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useSessionStore } from "@/app/store/useSessionStore";
import { useSpeechRecognition } from "@/app/hooks/useSpeechRecognition";
import { useSubtitleChannel } from "@/app/hooks/useSubtitleChannel";
import { useTranslator } from "@/app/hooks/useTranslator";

const MAX_DISPLAY_CHARACTERS = 35;
const DISPLAY_DURATION = 3000;

export function ControlCard() {
  const {
    sessionId,
    status,
    setStatus,
    translationEnabled,
    setTranslationEnabled,
    selectedMicId,
    setSelectedMicId,
    availableMics,
    setAvailableMics,
  } = useSessionStore();

  const [currentText, setCurrentText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = status === "active";

  const { send } = useSubtitleChannel({ sessionId });

  const {
    initialize: initializeTranslator,
    translate,
    reset: resetTranslator,
    status: translatorStatus,
    downloadProgress,
    error: translatorError,
    isReady: isTranslatorReady,
  } = useTranslator({
    sourceLanguage: "ja",
    targetLanguage: "en",
  });

  const clearTimer = useCallback(() => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  }, []);

  const clearSubtitle = useCallback(() => {
    setCurrentText("");
    send({ type: "clear" });
  }, [send]);

  const truncateText = useCallback((text: string): string => {
    if (text.length <= MAX_DISPLAY_CHARACTERS) {
      return text;
    }
    return "…" + text.slice(-(MAX_DISPLAY_CHARACTERS - 1));
  }, []);

  const handleResult = useCallback(
    async (result: { transcript: string; isFinal: boolean }) => {
      clearTimer();

      const displayText = truncateText(result.transcript);
      setCurrentText(displayText);

      if (!result.isFinal) {
        // 中間結果は日本語のみ送信（翻訳しない）
        send({
          type: "subtitle",
          jpText: displayText,
          enText: undefined,
          isFinal: false,
        });
        return;
      }


      // 確定結果の場合、翻訳を実行
      let enText: string | undefined;


      if (translationEnabled) {
        const translated = await translate(result.transcript);
        if (translated) {
          enText = translated;
        }
      }

      send({
        type: "subtitle",
        jpText: displayText,
        enText,
        isFinal: true,
      });

      // 表示時間後にクリア
      clearTimerRef.current = setTimeout(() => {
        clearSubtitle();
      }, DISPLAY_DURATION);
    },
    [
      send,
      clearTimer,
      clearSubtitle,
      truncateText,
      translationEnabled,
      isTranslatorReady,
      translate,
    ]
  );

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      setStatus("error");
    },
    [setStatus]
  );

  const { start, stop } = useSpeechRecognition({
    onResult: handleResult,
    onError: handleError,
    deviceId: selectedMicId,
  });

  useEffect(() => {
    const getMicrophones = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices
          .filter((device) => device.kind === "audioinput")
          .map((device) => ({
            deviceId: device.deviceId,
            label: device.label || `マイク ${device.deviceId.slice(0, 5)}`,
          }));

        setAvailableMics(mics);

        if (!selectedMicId && mics.length > 0) {
          setSelectedMicId(mics[0].deviceId);
        }
      } catch (err) {
        console.error("マイクの取得に失敗しました:", err);
        setError("マイクへのアクセスが拒否されました。");
      }
    };

    getMicrophones();
  }, [selectedMicId, setSelectedMicId, setAvailableMics]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  useEffect(() => {
    if (!translationEnabled) {
      resetTranslator();
    }
  }, [translationEnabled, resetTranslator]);

  const handleToggle = async () => {
    setError(null);
    clearTimer();
    clearSubtitle();

    if (isActive) {
      stop();
      send({ type: "clear" });
      setStatus("idle");
    } else {
      setStatus("connecting");

      if (translationEnabled) {
        const translatorReady = await initializeTranslator();
        if (!translatorReady && translatorError) {
          console.warn("翻訳機能の初期化に失敗しましたが、字幕は開始します");
        }
      }

      await start();
      if (useSessionStore.getState().status !== "error") {
        setStatus("active");
      }
    }
  };

  const getTranslatorStatusText = () => {
    if (!translationEnabled) return null;
    if (!isActive && translatorStatus === "idle") return null;

    switch (translatorStatus) {
      case "initializing":
        return "翻訳機能を準備中...";
      case "downloading":
        return `翻訳モデルをダウンロード中... ${downloadProgress}%`;
      case "error":
        return translatorError;
      case "ready":
        return null;
      default:
        return null;
    }
  };

  const translatorStatusText = getTranslatorStatusText();

  return (
    <section className="card-yomi flex flex-col gap-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-yomi-text">
          字幕コントロール
        </h2>
        <p className="text-xs sm:text-sm text-yomi-text-sub mt-1">
          マイクを選択して、字幕を開始してください。
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="mic-select" className="text-xs text-yomi-text-sub">
          マイク
        </label>
        <select
          id="mic-select"
          value={selectedMicId}
          onChange={(e) => setSelectedMicId(e.target.value)}
          disabled={isActive}
          className="w-full px-3 py-2 rounded-lg bg-yomi-bg border border-yomi-border text-sm text-yomi-text focus:outline-none focus:border-yomi-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {availableMics.length === 0 ? (
            <option value="">マイクが見つかりません</option>
          ) : (
            availableMics.map((mic) => (
              <option key={mic.deviceId} value={mic.deviceId}>
                {mic.label}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-yomi-text">英語翻訳</p>
          <p className="text-xs text-yomi-text-sub">
            日本語字幕の下に英語訳を表示
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTranslationEnabled(!translationEnabled)}
          disabled={isActive}
          className={`relative w-12 h-7 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${translationEnabled ? "bg-yomi-accent" : "bg-yomi-border"
            }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${translationEnabled ? "translate-x-5" : "translate-x-0"
              }`}
          />
        </button>
      </div>

      {translatorStatusText && (
        <div className="text-xs text-yomi-text-sub">
          {translatorStatus === "downloading" ? (
            <div className="space-y-1">
              <p>{translatorStatusText}</p>
              <div className="w-full h-1.5 bg-yomi-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-yomi-accent transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          ) : translatorStatus === "error" ? (
            <p className="text-red-400">{translatorStatusText}</p>
          ) : (
            <p>{translatorStatusText}</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        disabled={!selectedMicId || status === "connecting"}
        className={`w-full py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isActive
          ? "bg-red-500 hover:bg-red-600"
          : "bg-yomi-accent hover:bg-yomi-accent-hover"
          }`}
      >
        {status === "connecting"
          ? "接続中..."
          : isActive
            ? "字幕を停止"
            : "字幕を開始"}
      </button>

      {error && <p className="text-xs text-center text-red-400">{error}</p>}

      {isActive && !error && (
        <div className="space-y-2">
          <p className="text-xs text-center text-green-400">● 字幕を配信中です</p>
          <p className="text-sm text-center text-yomi-text-sub truncate min-h-[1.5em]">
            {currentText || "\u00A0"}
          </p>
        </div>
      )}
    </section>
  );
}
