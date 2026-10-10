import { useState } from "react";
import { Award, Copy, RotateCcw, AlertTriangle } from "lucide-react";
import { MAX, MAX_TOTAL, PART_META, PASS_PCT, allDone, completionCode, fmt, totalScore, type Part } from "../lib/store";

export default function Results({ scores, onReset, onGo }: { scores: Record<Part, number | null>; onReset: () => void; onGo: (p: Part) => void }) {
  const [copied, setCopied] = useState(false);
  const total = totalScore(scores);
  const pct = Math.round((total / MAX_TOTAL) * 100);
  const done = allDone(scores);
  const pass = pct >= PASS_PCT;
  const code = completionCode(total);
  const weak = (Object.keys(MAX) as Part[]).filter((p) => (scores[p] ?? 0) / MAX[p] < 0.7);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* fallback: text is user-selectable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <section className="card pop" aria-labelledby="rh">
      <span className="eyebrow">Результати</span>
      <h2 id="rh" className="h-part">{done ? (pass ? "Матеріал пройдено" : "Матеріал пройдено, але результат потребує повторення") : "Спершу пройдіть усі вправи"}</h2>
      <p className="lead">Підсумок: <strong>{fmt(total)} із {MAX_TOTAL} балів ({pct} %)</strong>. Поріг для переходу до наступного кроку курсу — {PASS_PCT} %.</p>

      <div className="score">
        {(Object.keys(MAX) as Part[]).map((p) => (
          <div className="sc" key={p}>
            <span>{PART_META[p].title}</span>
            <b>{scores[p] === null ? "—" : fmt(scores[p]!)} <small style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--slate)" }}>/ {MAX[p]}</small></b>
          </div>
        ))}
      </div>

      {done && (
        <div className="instr" style={{ background: pass ? "var(--ok-bg)" : "var(--amber-l)", borderColor: pass ? "var(--ok)" : "var(--amber)" }}>
          <h2><Award size={20} aria-hidden="true" /> Код завершення</h2>
          <p style={{ marginTop: 6 }}>Скопіюйте код і вставте його у відповідь на завдання в Google Classroom — так викладач побачить, що ви пройшли матеріал.</p>
          <div className="code-box" aria-label={`Код завершення: ${code}`}>{code}</div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" onClick={copy}><Copy size={18} aria-hidden="true" /> {copied ? "Скопійовано" : "Скопіювати код"}</button>
          </div>
          <output aria-live="polite" className="sr">{copied ? "Код скопійовано" : ""}</output>
        </div>
      )}

      {done && weak.length > 0 && (
        <div className="fb hint" style={{ marginTop: 16 }}>
          <AlertTriangle size={22} aria-hidden="true" style={{ flex: "none", marginTop: 3 }} />
          <div>
            <strong>Що варто повторити</strong>
            <ul style={{ margin: "6px 0 0", paddingLeft: "1.1rem", listStyle: "disc" }}>
              {weak.map((p) => (
                <li key={p}>
                  <button style={{ background: "none", border: 0, padding: 0, color: "inherit", textDecoration: "underline", fontWeight: 700 }} onClick={() => onGo(p)}>{PART_META[p].title}</button>: {PART_META[p].topics}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {done && weak.length === 0 && <p className="lead">Усі вправи пройдено впевнено. Можна переходити до тестування за Модулем 1.</p>}

      <div className="row">
        <button className="btn ghost" onClick={onReset}><RotateCcw size={18} aria-hidden="true" /> Пройти матеріал спочатку</button>
      </div>
    </section>
  );
}
