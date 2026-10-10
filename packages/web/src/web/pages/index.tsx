import { Check, Clock, Laptop, ListChecks, Play, Target } from "lucide-react";
import { PART_META, STAGES, useProgress, type Part } from "../lib/store";
import Predict from "../parts/predict";
import Assemble from "../parts/assemble";
import FindBug from "../parts/findbug";
import Scenario from "../parts/scenario";
import Results from "../parts/results";

const LABELS = ["Передбач", "Склади", "Знайди", "Сценарій", "Результат"];

export default function Index() {
  const { s, go, complete, start, reset, setFs } = useProgress();
  const si = STAGES.indexOf(s.stage);
  const pct = Math.round((Math.max(0, si - 1) / 4) * 100);

  return (
    <>
      <a href="#main" className="skip">Перейти до змісту</a>
      <header className="hdr">
        <div className="hdr-in">
          <div className="logo" aria-hidden="true">{"{ }"}</div>
          <div>
            <h1>Python Syntax Lab</h1>
            <small>Основи Python для початківців · Модуль 1 · РН1</small>
          </div>
          <fieldset className="hdr-tools">
            <legend className="sr">Розмір тексту</legend>
            <button className="tool" onClick={() => setFs(-1)} aria-label="Зменшити розмір тексту" disabled={s.fs <= 15}>A−</button>
            <button className="tool" onClick={() => setFs(1)} aria-label="Збільшити розмір тексту" disabled={s.fs >= 22}>A+</button>
          </fieldset>
        </div>
      </header>

      <div className="wrap">
        {s.stage !== "intro" && (
          <nav aria-label="Етапи матеріалу">
            <ol className="stepper">
              {LABELS.map((l, i) => {
                const idx = i + 1;
                const cur = STAGES[idx] === s.stage;
                const done = idx < si || (s.unlocked > idx && !cur);
                return (
                  <li key={l}>
                    <button className={`step ${done ? "done" : ""}`} aria-current={cur ? "step" : undefined} disabled={idx > s.unlocked} onClick={() => go(STAGES[idx])}>
                      <span className="n">{done ? <Check size={14} aria-label="пройдено" /> : idx}</span>
                      <span className="t">{l}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <progress className="bar" aria-label="Прогрес" value={pct} max={100} />
          </nav>
        )}

        <main id="main">
          {s.stage === "intro" && (
            <section className="card pop" aria-labelledby="ih">
              <span className="eyebrow"><Target size={14} aria-hidden="true" /> Результат навчання РН1</span>
              <h2 id="ih" className="h-part" style={{ fontSize: "1.8rem" }}>Базовий синтаксис Python: практика</h2>
              <p className="lead">Вам належить пояснити, як працюють змінні, типи даних, умови, цикли та відступи — не вгадуючи, а «виконуючи» код у голові. Чотири короткі вправи з миттєвим зворотним зв'язком.</p>

              <div className="chips" aria-label="Параметри матеріалу">
                <span className="chip"><Clock size={12} style={{ display: "inline", verticalAlign: "-2px" }} aria-hidden="true" /> ≈ 20–25 хв</span>
                <span className="chip"><Laptop size={12} style={{ display: "inline", verticalAlign: "-2px" }} aria-hidden="true" /> Комп'ютер або телефон</span>
                <span className="chip"><ListChecks size={12} style={{ display: "inline", verticalAlign: "-2px" }} aria-hidden="true" /> Установлювати Python не потрібно</span>
              </div>

              <div className="instr" aria-labelledby="inh">
                <h2 id="inh">Інструкція для учасника</h2>
                <ol style={{ listStyle: "decimal" }}>
                  <li>Пройдіть вправи по черзі: <strong>Передбач → Склади → Знайди → Сценарій</strong>. Наступна вправа відкривається після завершення попередньої.</li>
                  <li>Після кожної дії отримуєте пояснення. Помилятися можна: вправа підкаже, чому варіант не підходить.</li>
                  <li>Прогрес зберігається в цьому браузері — можна зупинитися й повернутися пізніше.</li>
                  <li>В кінці ви отримаєте <strong>код завершення</strong> — вставте його у відповідь на завдання в Google Classroom.</li>
                </ol>
                <p style={{ marginTop: 10, fontSize: ".85rem", color: "var(--slate)" }}>Зручність: кнопки A− / A+ вгорі змінюють розмір тексту; усе керується й з клавіатури.</p>
              </div>

              <div className="row">
                <button className="btn" onClick={start}><Play size={18} aria-hidden="true" /> {s.unlocked > 1 ? "Продовжити" : "Почати"}</button>
                {s.unlocked > 1 && <button className="btn ghost" onClick={reset}>Почати спочатку</button>}
              </div>

              <h3 style={{ marginTop: 26, fontSize: ".95rem" }}>Що ви вивчите</h3>
              <ul className="path" style={{ listStyle: "none" }}>
                {(Object.keys(PART_META) as Part[]).map((p, i) => (
                  <li key={p}><strong style={{ width: 22 }}>{i + 1}.</strong><span><strong>{PART_META[p].title}</strong> — {PART_META[p].topics}</span></li>
                ))}
              </ul>
            </section>
          )}
          {s.stage === "p1" && <Predict key="p1" onDone={(v) => complete("p1", v)} />}
          {s.stage === "p2" && <Assemble key="p2" onDone={(v) => complete("p2", v)} />}
          {s.stage === "p3" && <FindBug key="p3" onDone={(v) => complete("p3", v)} />}
          {s.stage === "p4" && <Scenario key="p4" onDone={(v) => complete("p4", v)} />}
          {s.stage === "result" && <Results scores={s.scores} onReset={reset} onGo={(p) => go(p)} />}
        </main>
      </div>

      <footer className="footer">
        <div className="wrap">Курс «Основи Python для початківців» · Модуль 1 «Основи синтаксису Python» · Результат навчання РН1: пояснює базові синтаксичні конструкції Python.</div>
      </footer>
    </>
  );
}
