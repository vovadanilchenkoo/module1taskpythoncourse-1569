import { useCallback, useEffect, useState } from "react";

export type Part = "p1" | "p2" | "p3" | "p4";
export const STAGES = ["intro", "p1", "p2", "p3", "p4", "result"] as const;
export type Stage = (typeof STAGES)[number];

export const MAX: Record<Part, number> = { p1: 4, p2: 3, p3: 3, p4: 3 };
export const MAX_TOTAL = 13;
export const PASS_PCT = 60;

export const PART_META: Record<Part, { title: string; short: string; topics: string }> = {
  p1: { title: "Передбач результат", short: "Передбач", topics: "типи даних, умови if / elif / else, цикл for, арифметичні оператори" },
  p2: { title: "Склади програму", short: "Склади", topics: "порядок виконання, відступи, оператори порівняння, ввід і вивід" },
  p3: { title: "Знайди помилку", short: "Знайди", topics: "двокрапка, відступи, різниця між = та ==, читання повідомлень інтерпретатора" },
  p4: { title: "Сценарій «Баг у магазині»", short: "Сценарій", topics: "межові умови, цикли for та while, тестування" },
};

type State = {
  stage: Stage;
  unlocked: number;
  scores: Record<Part, number | null>;
  fs: number;
};

const KEY = "pylab-m1-rn1-v1";
const initial: State = { stage: "intro", unlocked: 0, scores: { p1: null, p2: null, p3: null, p4: null }, fs: 17 };

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return initial;
}

export function fmt(n: number) {
  return (Math.round(n * 10) / 10).toString().replace(".", ",");
}

export function useProgress() {
  const [s, setS] = useState<State>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
    document.documentElement.style.setProperty("--fs", `${s.fs}px`);
  }, [s]);

  const go = useCallback((stage: Stage) => {
    setS((p) => (STAGES.indexOf(stage) <= p.unlocked ? { ...p, stage } : p));
    window.scrollTo({ top: 0 });
  }, []);

  const complete = useCallback((part: Part, score: number) => {
    setS((p) => {
      const idx = STAGES.indexOf(part);
      const prev = p.scores[part];
      return {
        ...p,
        scores: { ...p.scores, [part]: prev === null ? score : Math.max(prev, score) },
        unlocked: Math.max(p.unlocked, idx + 1),
        stage: STAGES[idx + 1],
      };
    });
    window.scrollTo({ top: 0 });
  }, []);

  const start = useCallback(() => {
    setS((p) => ({ ...p, stage: "p1", unlocked: Math.max(p.unlocked, 1) }));
    window.scrollTo({ top: 0 });
  }, []);

  const reset = useCallback(() => setS((p) => ({ ...initial, fs: p.fs })), []);
  const setFs = useCallback((d: number) => setS((p) => ({ ...p, fs: Math.min(22, Math.max(15, p.fs + d)) })), []);

  return { s, go, complete, start, reset, setFs };
}

export function totalScore(sc: Record<Part, number | null>) {
  return (Object.values(sc) as (number | null)[]).reduce<number>((a, b) => a + (b ?? 0), 0);
}
export function allDone(sc: Record<Part, number | null>) {
  return (Object.values(sc) as (number | null)[]).every((v) => v !== null);
}
export function completionCode(total: number) {
  const pct = Math.round((total / MAX_TOTAL) * 100);
  let h = 5381;
  const str = `PY1|M1|${pct}|kubg`;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return `PY1-${pct}-${h.toString(16).toUpperCase().slice(-4).padStart(4, "0")}`;
}
