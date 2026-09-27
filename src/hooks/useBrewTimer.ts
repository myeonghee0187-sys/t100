import { useEffect, useState } from "react";
import type { BrewTimer } from "../store/types";
export function timerSnapshot(timer: BrewTimer | null, now: number) {
  if (!timer) return { remaining: 0, progress: 0 };
  const remainingMs = Math.max(0, timer.endsAt - now);
  return {
    remaining: Math.ceil(remainingMs / 1000),
    progress: Math.min(
      1,
      Math.max(0, 1 - remainingMs / (timer.endsAt - timer.startedAt)),
    ),
  };
}
export function useBrewTimer(timer: BrewTimer | null) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!timer) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 100);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("pageshow", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("pageshow", tick);
    };
  }, [timer]);
  return timerSnapshot(timer, now);
}
