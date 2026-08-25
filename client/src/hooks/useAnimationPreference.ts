import { useEffect, useState } from "react";

export type AnimationIntensity = "penuh" | "ringan" | "mati";
export const ANIMATION_PREFERENCE_KEY = "mrkiplay-animation-intensity";
const allowed: AnimationIntensity[] = ["penuh", "ringan", "mati"];

function readPreference(): AnimationIntensity {
  if (typeof window === "undefined") return "penuh";
  const value = window.localStorage.getItem(ANIMATION_PREFERENCE_KEY);
  return allowed.includes(value as AnimationIntensity) ? value as AnimationIntensity : "penuh";
}

export function useAnimationPreference() {
  const [intensity, setIntensityState] = useState<AnimationIntensity>(readPreference);
  useEffect(() => {
    const sync = () => setIntensityState(readPreference());
    window.addEventListener("storage", sync);
    window.addEventListener("mrkiplay-animation-preference", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("mrkiplay-animation-preference", sync);
    };
  }, []);
  const setIntensity = (next: AnimationIntensity) => {
    window.localStorage.setItem(ANIMATION_PREFERENCE_KEY, next);
    setIntensityState(next);
    window.dispatchEvent(new Event("mrkiplay-animation-preference"));
  };
  return { intensity, setIntensity };
}
