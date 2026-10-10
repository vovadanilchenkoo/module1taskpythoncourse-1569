import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, IndentDecrease, IndentIncrease, X } from "lucide-react";
import { ASSEMBLE, type Line } from "../lib/content";
import { Feedback, CodeBlock } from "../components/code-block";
import { fmt } from "../lib/store";

type PLine = { id: string; indent: number };
const ALL: (Line & { why?: string })[] = [...ASSEMBLE.solution, ...ASSEMBLE.distractors];
const ORDER = ["x2", "e", "h", "c", "a", "g", "x1", "i", "b", "d", "f"];
const byId = (id: string) => ALL.find((l) => l.id === id)!;

type Status = { ok: boolean; note: string };

export default function Assemble({ onDone }: { onDone: (score: number) => void }) {
  const [prog, setProg] = useState<PLine[]>([]);
  const [fails, setFails] = useState(0);
  const [status, setStatus] = useState<Status[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [live, setLive] = useState("");

  const used = new Set(prog.map((p) => p.id));
  const bank = useMemo(() => ORDER.map(byId), []);

  const touch = (fn: (p: PLine[]) => PLine[]) => {
    setProg(fn);
    setStatus(null);
    setMsg(null);
  };
  const add = (id: string) => { touch((p) => [...p, { id, indent: 0 }]); setLive(`Рядок додано до програми`); };
  const remove = (i: number) => touch((p) => p.filter((_, k) => k !== i));
  const move = (i: number, d: number) =>
    touch((p) => {
      const n = [...p];
      const j = i + d;
      if (j < 0 || j >= n.length) return p;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const ind = (i: number, d: number) =>
    touch((p) => p.map((l, k) => (k === i ? { ...l, indent: Math.min(3, Math.max(0, l.indent + d)) } : l)));

  function check() {
    const sol = ASSEMBLE.solution;
    const isD = (id: string) => ASSEMBLE.distractors.some((x) => x.id === id);
    const real = prog.filter((l) => !isD(l.id));
    const swap = real.length >= 2 && ASSEMBLE.swappable.includes(real[0].id) && ASSEMBLE.swappable.includes(real[1].id);
    let k = -1;
    const st: Status[] = prog.map((l) => {
      const d = ASSEMBLE.distractors.find((x) => x.id === l.id);
      if (d) return { ok: false, note: d.why };
      k += 1;
      const expLine = swap && k < 2 ? byId(l.id) : sol[k];
      if (!expLine || l.id !== expLine.id) return { ok: false, note: "Не на своєму місці: подумайте, що має виконатися раніше." };
      if (l.indent !== expLine.indent)
        return { ok: false, note: l.indent > expLine.indent ? "Відступ завеликий: цей рядок не належить до блоку." : "Потрібен відступ: це тіло блоку if або else." };
      return { ok: true, note: "" };
    });
    const missing = sol.length - real.length;
    setStatus(st);
    if (st.every((s) => s.ok) && prog.length === sol.length) {
      setSolved(true);
      setMsg(null);
      setLive("Програму складено правильно");
    } else {
      setFails((f) => f + 1);
      setMsg(
        missing > 0 && st.every((s) => s.ok)
          ? `Поки що правильно, але бракує ще рядків: ${missing}.`
          : "Є помилки — вони позначені біля рядків. Виправте їх і перевірте ще раз.",
      );
      setLive("Є помилки в програмі");
    }
  }
  function reveal() {
    setProg(ASSEMBLE.solution.map((l) => ({ id: l.id, indent: l.indent })));
    setStatus(null);
    setRevealed(true);
    setSolved(true);
    setMsg(null);
  }
  const score = revealed ? 0.5 : fails === 0 ? 3 : fails === 1 ? 2 : 1;

  return (
    <section className="card pop" aria-labelledby="p2h">
      <span className="eyebrow">Вправа 2 з 4</span>
      <h2 id="p2h" className="h-part">Склади програму</h2>
      <p className="lead">{ASSEMBLE.task}</p>
      <div className="chips"><span className="chip">Порядок виконання</span><span className="chip">Відступи</span><span className="chip">Оператори порівняння</span></div>

      {!solved && (
        <div className="cols">
          <div className="pane">
            <h3>Банк рядків</h3>
            {bank.filter((l) => !used.has(l.id)).map((l) => (
              <button key={l.id} className="bank-item" onClick={() => add(l.id)} aria-label={`Додати рядок: ${l.text}`}>
                {l.text}
              </button>
            ))}
            {bank.every((l) => used.has(l.id)) && <p className="empty">Усі рядки використано.</p>}
          </div>
          <div className="pane" style={{ borderStyle: "solid" }}>
            <h3>Ваша програма</h3>
            {prog.length === 0 && <p className="empty">Натискайте на рядки зліва, щоб додати їх сюди.</p>}
            {prog.map((l, i) => {
              const st = status?.[i];
              const src = byId(l.id).text;
              return (
                <div key={l.id} className={`prog-line ${st ? (st.ok ? "ok" : "bad") : ""}`} style={{ marginLeft: l.indent * 18 }}>
                  <span className="src"><span aria-hidden="true" style={{ color: "var(--slate)", marginRight: 8 }}>{i + 1}</span>{src}</span>
                  <span className="ctl">
                    <button className="ib" aria-label={`Рядок ${i + 1}: підняти вище`} onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp size={18} /></button>
                    <button className="ib" aria-label={`Рядок ${i + 1}: опустити нижче`} onClick={() => move(i, 1)} disabled={i === prog.length - 1}><ArrowDown size={18} /></button>
                    <button className="ib" aria-label={`Рядок ${i + 1}: зменшити відступ`} onClick={() => ind(i, -1)} disabled={l.indent === 0}><IndentDecrease size={18} /></button>
                    <button className="ib" aria-label={`Рядок ${i + 1}: збільшити відступ`} onClick={() => ind(i, 1)} disabled={l.indent >= 3}><IndentIncrease size={18} /></button>
                    <button className="ib" aria-label={`Рядок ${i + 1}: прибрати з програми`} onClick={() => remove(i)}><X size={18} /></button>
                  </span>
                  {st && <span className="lnote" style={{ color: st.ok ? "var(--ok)" : "var(--bad)" }}>{st.ok ? "✓ Правильно" : `✗ ${st.note}`}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <output aria-live="polite">
        <span className="sr">{live}</span>
        {msg && (
          <Feedback kind="bad" title="Ще не все гаразд">
            <p>{msg}</p>
            {fails >= 2 && <p style={{ marginTop: 6 }}>Підказка: порівняння «від 1000 включно» записують оператором <code className="inl">&gt;=</code>, а блоки if та else завершуються двокрапкою й мають однаковий відступ.</p>}
          </Feedback>
        )}
        {solved && (
          <>
            <Feedback kind="ok" title={revealed ? "Розв'язок показано" : "Програму складено правильно!"}>
              <p>
                Рядок <code className="inl">else:</code> розташований на тому ж рівні, що й <code className="inl">if</code>, а їхні тіла мають відступ. Останній
                <code className="inl"> print</code> без відступу виконується в обох випадках.
              </p>
            </Feedback>
            <CodeBlock code={ASSEMBLE.solution.map((l) => "    ".repeat(l.indent) + l.text)} label="Правильна програма" />
            <div className="term" aria-label="Приклад виконання програми">{ASSEMBLE.sampleOutput}</div>
          </>
        )}
      </output>

      <div className="row">
        {!solved ? (
          <>
            <button className="btn" onClick={check} disabled={prog.length === 0}>Перевірити програму</button>
            <button className="btn ghost" onClick={() => touch(() => [])} disabled={prog.length === 0}>Очистити</button>
            {fails >= 3 && <button className="btn ghost" onClick={reveal}>Показати розв'язок</button>}
          </>
        ) : (
          <button className="btn" onClick={() => onDone(score)}>Далі: Знайди помилку <ArrowRight size={18} aria-hidden="true" /></button>
        )}
        <span style={{ color: "var(--slate)", fontSize: ".85rem", fontWeight: 600 }}>Спроб із помилками: {fails}</span>
        {solved && <span style={{ color: "var(--slate)", fontSize: ".85rem", fontWeight: 600 }}>Бали: {fmt(score)} із 3</span>}
      </div>
    </section>
  );
}
