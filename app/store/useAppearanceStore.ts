import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SubtitlePreset = "classic" | "game" | "soft" | "clear";
export type SubtitlePosition = "bottom-left" | "bottom-center" | "bottom-right";

interface AppearanceState {
  preset: SubtitlePreset;
  position: SubtitlePosition;
  setPreset: (preset: SubtitlePreset) => void;
  setPosition: (position: SubtitlePosition) => void;
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      preset: "classic",
      position: "bottom-center",
      setPreset: (preset) => set({ preset }),
      setPosition: (position) => set({ position }),
    }),
    {
      name: "yomisub-appearance",
    }
  )
);
