import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { BUGS } from "../lib/content";
import { CodeBlock, Feedback, highlight } from "../components/code-block";
import { fmt } from "../lib/store";

export default function FindBug({ onDone }: { onDone: (score: number) => void }) {
  const [bi, setBi] = useState(0);
  const [stage, setStage] = useState<"line" | "cause" | "done">("line");
  const [badLines, setBadLines] = useState<number[]>([]);
  const [badCauses, setBadCauses] = useState<number[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const b = BUGS[bi];

  function pickLine(n: number) {
    if (n === b.bugLine) {
      setStage("cause");
      setScore((s) => s + (badLines.length === 0 ? 0.5 : 0));
    } else setBadLines((x) => [...x, n]);
  }
  function checkCause() {
    if (sel === null) return;
    if (b.causes[sel].right) {
      setStage("done");
      setScore((s) => s + (badCauses.length === 0 ? 0.5 : 0));
    } else {
      setBadCauses((x) => [...x, sel]);
      setSel(null);
    }
  }
  function next() {
    if (bi + 1 >= BUGS.length) return onDone(score);
    setBi(bi + 1);
    setStage("line");
    setBadLines([]);
    setBadCauses([]);
    setSel(null);
  }
  const lastBadCause = badCauses.length ? badCauses[badCauses.length - 1] : null;

  return (
    <section className="card pop" aria-labelledby="p3h">
      <span className="eyebrow">Вправа 3 з 4 · Фрагмент {bi + 1} із {BUGS.length}</span>
      <h2 id="p3h" className="h-part">Знайди помилку</h2>
      <p className="lead">
        {stage === "line" ? "У коді одна синтаксична помилка. Натисніть на рядок, у якому вона є." : stage === "cause" ? "Рядок знайдено. Тепер оберіть, у чому саме полягає помилка." : "Помилку виправлено."}
      </p>
      <div className="chips"><span className="chip">Синтаксис</span><span className="chip">Повідомлення інтерпретатора</span></div>

      {stage === "line" && (
        <pre className="code" aria-label="Код із помилкою. Оберіть рядок з помилкою">
          {b.lines.map((l, i) => {
            const n = i + 1;
            const bad = badLines.includes(n);
            return (
              <button key={n} className={`bugline ${bad ? "hl-bad" : ""}`} disabled={bad} onClick={() => pickLine(n)} aria-label={`Рядок ${n}: ${l.trim()}${bad ? " — не містить помилки" : ""}`}>
                <span className="no" aria-hidden="true">{n}</span>
                <code className="tx">{highlight(l)}</code>
                {bad && <span aria-hidden="true" style={{ marginLeft: 14, color: "#FFB4A2", fontWeight: 700 }}>✗ помилки тут немає</span>}
              </button>
            );
          })}
        </pre>
      )}
      {stage === "cause" && <CodeBlock code={b.lines} marks={{ [b.bugLine]: "hl-bad" }} label={`Код. Помилка в рядку ${b.bugLine}`} />}
      {stage === "done" && <CodeBlock code={b.fixed} marks={{ [b.bugLine]: "hl-ok" }} label="Виправлений код" />}

      <output aria-live="polite">
        {stage === "line" && badLines.length > 0 && (
          <>
            <Feedback kind="bad" title={`У рядку ${badLines[badLines.length - 1]} помилки немає`}>
              <p>Підказка: ось що повідомляє інтерпретатор. Зверніть увагу на номер рядка й стрілку «^».</p>
            </Feedback>
            <div className="term">{b.traceback}</div>
          </>
        )}
        {stage === "cause" && (
          <>
            <div className="term" aria-label="Повідомлення інтерпретатора">{b.traceback}</div>
            <div className="opts" role="radiogroup" aria-label="Причина помилки">
              {b.causes.map((c, i) => {
                const w = badCauses.includes(i);
                return (
                  <label key={i} className={`opt ${w ? "wrong" : ""}`}>
                    <input type="radio" name={b.id} className="sr" aria-label={c.text + (w ? " — неправильно" : "")} checked={sel === i} disabled={w} onChange={() => setSel(i)} />
                    <span className="mk" aria-hidden="true">{w ? "×" : sel === i ? <Check size={14} /> : null}</span>
                    <span>{c.text}</span>
                  </label>
                );
              })}
            </div>
            {lastBadCause !== null && (
              <Feedback kind="bad" title="Не зовсім так">
                <p>{b.causes[lastBadCause].why}</p>
              </Feedback>
            )}
          </>
        )}
        {stage === "done" && (
          <Feedback kind="ok" title="Правильно!">
            <p>{b.explain}</p>
          </Feedback>
        )}
      </output>

      <div className="row">
        {stage === "cause" && <button className="btn" onClick={checkCause} disabled={sel === null}>Перевірити</button>}
        {stage === "done" && (
          <button className="btn" onClick={next}>
            {bi + 1 >= BUGS.length ? "Далі: сценарій" : "Наступний фрагмент"} <ArrowRight size={18} aria-hidden="true" />
          </button>
        )}
        <span style={{ color: "var(--slate)", fontSize: ".85rem", fontWeight: 600 }}>Бали за вправу: {fmt(score)} із 3</span>
      </div>
    </section>
  );
}
