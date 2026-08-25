import { useEffect, useState } from "react";

export type AnimationIntensity = "penuh" | "ringan" | "mati";
export type ReportStyle = "ringkas" | "eksekutif" | "teknis";
export const ANIMATION_PREFERENCE_KEY = "mrkiplay-animation-intensity";
export const REPORT_STYLE_PREFERENCE_KEY = "mrkiplay-ai-report-style";
const allowed: AnimationIntensity[] = ["penuh", "ringan", "mati"];
const reportStyles: ReportStyle[] = ["ringkas", "eksekutif", "teknis"];

function readPreference(): AnimationIntensity {
  if (typeof window === "undefined") return "penuh";
  const value = window.localStorage.getItem(ANIMATION_PREFERENCE_KEY);
  return allowed.includes(value as AnimationIntensity) ? value as AnimationIntensity : "penuh";
}

function readReportStyle(): ReportStyle {
  if (typeof window === "undefined") return "ringkas";
  const value = window.localStorage.getItem(REPORT_STYLE_PREFERENCE_KEY);
  return reportStyles.includes(value as ReportStyle) ? value as ReportStyle : "ringkas";
}

export function useAnimationPreference() {
  const [intensity, setIntensityState] = useState<AnimationIntensity>(readPreference);
  const [reportStyle, setReportStyleState] = useState<ReportStyle>(readReportStyle);
  useEffect(() => {
    const sync = () => { setIntensityState(readPreference()); setReportStyleState(readReportStyle()); };
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
  const setReportStyle = (next: ReportStyle) => {
    window.localStorage.setItem(REPORT_STYLE_PREFERENCE_KEY, next);
    setReportStyleState(next);
    window.dispatchEvent(new Event("mrkiplay-animation-preference"));
  };
  return { intensity, setIntensity, reportStyle, setReportStyle };
}
