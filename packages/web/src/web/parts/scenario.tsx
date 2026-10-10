import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Heart, RotateCcw, XCircle, MessageSquareWarning } from "lucide-react";
import { SCENARIO, SCENARIO_START, SCENARIO_TRUST } from "../lib/content";
import { CodeBlock, Feedback } from "../components/code-block";

type Step = { node: string; choice: string; ok: boolean };

export default function Scenario({ onDone }: { onDone: (score: number) => void }) {
  const [nid, setNid] = useState(SCENARIO_START);
  const [trust, setTrust] = useState(SCENARIO_TRUST);
  const [tried, setTried] = useState<string[]>([]);
  const [hist, setHist] = useState<Step[]>([]);
  const [debt, setDebt] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);
  const node = SCENARIO[nid];
  const finished = nid === "end";

  useEffect(() => {
    if (nid !== SCENARIO_START) head.current?.focus();
  }, [nid]);

  function pick(i: number) {
    const c = node.choices[i];
    if (c.cost) setTrust((t) => Math.max(0, t - c.cost!));
    if (c.next === "review_debt") setDebt(true);
    if (node.returnTo === undefined && c.cost) setTried((t) => [...t, `${node.id}:${i}`]);
    if (node.returnTo === undefined && node.choices.length > 1) setHist((h) => [...h, { node: node.title, choice: c.label, ok: !c.cost }]);
    setNid(c.next);
  }
  function restart() {
    setNid(SCENARIO_START);
    setTrust(SCENARIO_TRUST);
    setTried([]);
    setHist([]);
    setDebt(false);
    window.scrollTo({ top: 0 });
  }

  const hearts = (
    <div className="trust" aria-label={`Довіра команди: ${trust} із ${SCENARIO_TRUST}`}>
      <span>Довіра команди:</span>
      {Array.from({ length: SCENARIO_TRUST }).map((_, i) => (
        <span key={i} className={`hrt ${i < trust ? "on" : "off"}`} aria-hidden="true"><Heart size={15} fill={i < trust ? "currentColor" : "none"} /></span>
      ))}
      <span className="sr">{trust} із {SCENARIO_TRUST}</span>
    </div>
  );

  if (finished) {
    const verdict =
      trust === 3
        ? { kind: "ok" as const, t: "Approved — код-рев'ю пройдено", d: "Ви знайшли причину швидко, виправили умову правильно й перевірили межові значення. Конструкції Python були підібрані слушно." }
        : trust === 2
          ? { kind: "info" as const, t: "Approved with comments — зі зауваженнями", d: "Рішення працює, але у процесі були зайві кроки. Перегляньте нижче, де саме." }
          : { kind: "hint" as const, t: "Changes requested — потрібне доопрацювання", d: "Кілька рішень виявились хибними. Прочитайте розбір кроків нижче й спробуйте пройти сценарій ще раз іншим шляхом." };
    return (
      <section className="card pop" aria-labelledby="p4h">
        <span className="eyebrow">Вправа 4 з 4 · Фінал</span>
        <h2 id="p4h" ref={head} tabIndex={-1} className="h-part">{verdict.t}</h2>
        {hearts}
        <output aria-live="polite">
          <Feedback kind={verdict.kind} title="Підсумок код-рев'ю">
            <p>{verdict.d}</p>
            {debt && (
              <p style={{ marginTop: 6 }}>
                <MessageSquareWarning size={16} style={{ display: "inline", verticalAlign: "-3px" }} aria-hidden="true" /> Коментар рецензента: сума кошика підрахована за індексами — код не працюватиме для списку іншої довжини. Використайте цикл <code className="inl">for</code>.
              </p>
            )}
          </Feedback>
        </output>
        <h3 style={{ marginTop: 22, fontSize: "1rem" }}>Ваш шлях</h3>
        <ul className="path">
          {hist.map((h, i) => (
            <li key={i}>
              {h.ok ? <CheckCircle2 size={18} color="var(--ok)" aria-label="Вдале рішення" /> : <XCircle size={18} color="var(--bad)" aria-label="Хибне рішення" />}
              <span><strong>{h.node}.</strong> {h.choice}</span>
            </li>
          ))}
        </ul>
        <div className="row">
          <button className="btn" onClick={() => onDone(trust)}>Переглянути результати <ArrowRight size={18} aria-hidden="true" /></button>
          <button className="btn ghost" onClick={restart}><RotateCcw size={18} aria-hidden="true" /> Пройти сценарій ще раз</button>
        </div>
      </section>
    );
  }

  const isDetour = node.returnTo !== undefined;
  return (
    <section className="card pop" aria-labelledby="p4h">
      <span className="eyebrow">Вправа 4 з 4 · Розгалужений сценарій «Баг у магазині»</span>
      {nid === SCENARIO_START && (
        <p className="lead">Ви — стажер. Ухвалюйте рішення, і сценарій піде за вашим вибором: кожен вибір має наслідки. Помилка не штрафується суворо — вона просто коштує «довіри» команди.</p>
      )}
      {hearts}
      <div className="story">
        <div className="ava" aria-hidden="true">{isDetour ? "!" : "Py"}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2 id="p4h" className="h-part" style={{ marginTop: 0 }} ref={head} tabIndex={-1}>{node.title}</h2>
          <p className="lead" style={{ color: "var(--ink)" }}>{node.text}</p>
        </div>
      </div>
      {node.code && <CodeBlock code={node.code} />}
      {node.terminal && <div className="term" aria-label="Вивід у консолі">{node.terminal}</div>}
      <output aria-live="polite">
        {node.consequence && (
          <Feedback kind={node.consequence.kind === "bad" ? "bad" : "ok"} title={node.consequence.kind === "bad" ? "Наслідок вашого рішення" : "Результат"}>
            <p>{node.consequence.text}</p>
          </Feedback>
        )}
      </output>
      <fieldset className="opts" style={{ marginTop: 18 }}>
        <legend className="sr">Ваші дії</legend>
        {node.choices.map((c, i) => {
          const done = tried.includes(`${node.id}:${i}`);
          return (
            <button key={i} className="opt" disabled={done} onClick={() => pick(i)}>
              <span className="mk" aria-hidden="true"><ArrowRight size={14} /></span>
              <span style={{ minWidth: 0 }}>
                {c.label}
                {c.code && <CodeBlock code={c.code} inert />}
                {done && <em style={{ display: "block", marginTop: 4, color: "var(--bad)", fontStyle: "normal", fontWeight: 700, fontSize: ".82rem" }}>✗ Вже перевірено — не підійшло</em>}
              </span>
            </button>
          );
        })}
      </fieldset>
    </section>
  );
}
