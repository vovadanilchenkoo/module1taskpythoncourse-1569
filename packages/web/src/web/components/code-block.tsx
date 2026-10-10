import type { ReactNode } from "react";

const KW = new Set(["if", "elif", "else", "for", "while", "in", "def", "return", "and", "or", "not", "True", "False", "None", "break", "continue", "import"]);
const BI = new Set(["print", "input", "int", "float", "str", "len", "range", "type"]);
const RE = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)\b/g;

export function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const [t, com, str, num, id] = m;
    let cls = "";
    if (com) cls = "tk-c";
    else if (str) cls = "tk-s";
    else if (num) cls = "tk-n";
    else if (id && KW.has(id)) cls = "tk-k";
    else if (id && BI.has(id)) cls = "tk-b";
    out.push(cls ? <span key={m.index} className={cls}>{t}</span> : t);
    last = m.index + t.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function CodeBlock({
  code,
  label,
  marks,
  inert,
}: {
  code: string | string[];
  label?: string;
  marks?: Record<number, "hl" | "hl-bad" | "hl-ok">;
  inert?: boolean;
}) {
  const lines = Array.isArray(code) ? code : code.split("\n");
  return (
    <pre className="code" role={inert ? undefined : "group"} aria-label={inert ? undefined : (label ?? "Фрагмент коду Python")} tabIndex={inert ? undefined : 0}>
      {lines.map((l, i) => (
        <div key={i} className={`cl ${marks?.[i + 1] ?? ""}`}>
          <span className="no" aria-hidden="true">{i + 1}</span>
          <code className="tx">{highlight(l) || " "}</code>
        </div>
      ))}
    </pre>
  );
}

export function Feedback({ kind, title, children }: { kind: "ok" | "bad" | "hint" | "info"; title: string; children?: ReactNode }) {
  return (
    <div className={`fb ${kind} pop`}>
      <FbIcon kind={kind} />
      <div>
        <strong>{title}</strong>
        {children}
      </div>
    </div>
  );
}

import { CheckCircle2, XCircle, Lightbulb, Info } from "lucide-react";
function FbIcon({ kind }: { kind: string }) {
  const p = { size: 22, "aria-hidden": true } as const;
  if (kind === "ok") return <CheckCircle2 {...p} />;
  if (kind === "bad") return <XCircle {...p} />;
  if (kind === "hint") return <Lightbulb {...p} />;
  return <Info {...p} />;
}
