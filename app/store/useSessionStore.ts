import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ConnectionStatus = "idle" | "connecting" | "active" | "error";

export type MicrophoneDevice = {
  deviceId: string;
  label: string;
};

interface SessionState {
  sessionId: string;
  status: ConnectionStatus;
  translationEnabled: boolean;
  selectedMicId: string;
  availableMics: MicrophoneDevice[];
  setSessionId: (id: string) => void;
  setStatus: (status: ConnectionStatus) => void;
  setTranslationEnabled: (enabled: boolean) => void;
  setSelectedMicId: (id: string) => void;
  setAvailableMics: (mics: MicrophoneDevice[]) => void;
  generateNewSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: "",
      status: "idle",
      translationEnabled: true,
      selectedMicId: "",
      availableMics: [],
      setSessionId: (id) => set({ sessionId: id }),
      setStatus: (status) => set({ status }),
      setTranslationEnabled: (enabled) => set({ translationEnabled: enabled }),
      setSelectedMicId: (id) => set({ selectedMicId: id }),
      setAvailableMics: (mics) => set({ availableMics: mics }),
      generateNewSession: () => set({ sessionId: crypto.randomUUID() }),
    }),
    {
      name: "yomisub-session",
      partialize: (state) => ({
        sessionId: state.sessionId,
        selectedMicId: state.selectedMicId,
        translationEnabled: state.translationEnabled,
      }),
    }
  )
);
