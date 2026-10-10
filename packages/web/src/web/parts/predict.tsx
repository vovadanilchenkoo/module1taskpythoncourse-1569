import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { PREDICT } from "../lib/content";
import { CodeBlock, Feedback } from "../components/code-block";
import { fmt } from "../lib/store";

export default function Predict({ onDone }: { onDone: (score: number) => void }) {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const q = PREDICT[qi];
  const lastWrong = wrong.length ? wrong[wrong.length - 1] : null;

  function check() {
    if (sel === null) return;
    if (q.options[sel].right) {
      setSolved(true);
      setScore((s) => s + (wrong.length === 0 ? 1 : wrong.length === 1 ? 0.5 : 0));
    } else {
      setWrong((w) => [...w, sel]);
      setSel(null);
    }
  }
  function next() {
    if (qi + 1 >= PREDICT.length) return onDone(score);
    setQi(qi + 1);
    setSel(null);
    setWrong([]);
    setSolved(false);
  }

  return (
    <section className="card pop" aria-labelledby="p1h">
      <span className="eyebrow">Вправа 1 з 4 · Питання {qi + 1} із {PREDICT.length}</span>
      <h2 id="p1h" className="h-part">Передбач результат</h2>
      <p className="lead">Прочитайте код і оберіть, що він виведе. Запускати його не потрібно — спробуйте «виконати» код у голові, як інтерпретатор.</p>
      <div className="chips"><span className="chip">{q.tag}</span></div>
      <CodeBlock code={q.code} />
      <p style={{ marginTop: 16, fontWeight: 700 }} id="qprompt">{q.prompt}</p>
      <div className="opts" role="radiogroup" aria-labelledby="qprompt">
        {q.options.map((o, i) => {
          const isWrong = wrong.includes(i);
          const isRight = solved && o.right;
          return (
            <label key={i} className={`opt mono ${isWrong ? "wrong" : ""} ${isRight ? "right" : ""}`}>
              <input type="radio" name={q.id} className="sr" aria-label={o.text + (isWrong ? " — неправильно" : isRight ? " — правильно" : "")} checked={sel === i} disabled={isWrong || solved} onChange={() => setSel(i)} />
              <span className="mk" aria-hidden="true">{isRight ? <Check size={14} /> : isWrong ? "×" : sel === i ? <Check size={14} /> : null}</span>
              <span>
                {o.text}
              </span>
            </label>
          );
        })}
      </div>
      <output aria-live="polite">
        {!solved && lastWrong !== null && (
          <Feedback kind="bad" title="Не зовсім так">
            <p>{q.options[lastWrong].why}</p>
            <p style={{ marginTop: 6 }}>Оберіть інший варіант і перевірте ще раз.</p>
          </Feedback>
        )}
        {solved && (
          <Feedback kind="ok" title={wrong.length === 0 ? "Правильно з першої спроби!" : "Правильно!"}>
            <p>{q.explain}</p>
          </Feedback>
        )}
      </output>
      <div className="row">
        {!solved ? (
          <button className="btn" onClick={check} disabled={sel === null}>Перевірити</button>
        ) : (
          <button className="btn" onClick={next}>
            {qi + 1 >= PREDICT.length ? "Завершити вправу" : "Наступне питання"} <ArrowRight size={18} aria-hidden="true" />
          </button>
        )}
        <span style={{ color: "var(--slate)", fontSize: ".85rem", fontWeight: 600 }}>Бали за вправу: {fmt(score)} із 4</span>
      </div>
    </section>
  );
}
