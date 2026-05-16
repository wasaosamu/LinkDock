"use client";

import { useEffect, useState } from "react";

interface Props {
  subtitle?: string;
  onReload: () => void;
}

/**
 * Pattern A の header。コマンドプロンプト風タイトル + Reload。
 */
export function AppHeader({ subtitle, onReload }: Props) {
  const [now, setNow] = useState<string>(formatNow());
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(formatNow()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleReload = () => {
    setSpinning(true);
    onReload();
    setTimeout(() => setSpinning(false), 600);
  };

  return (
    <header className="relative border border-cyan-400/30 bg-slate-950/60 px-5 py-4 shadow-[0_0_24px_rgba(34,211,238,0.18)] backdrop-blur-md">
      <CornerBrackets />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-300/70">
            // {subtitle ?? "hyperlink command center"}
          </p>
          <h1 className="font-mono text-2xl font-bold tracking-widest text-cyan-200 [text-shadow:0_0_12px_rgba(34,211,238,0.55)]">
            &gt; LINKDOCK<span className="animate-pulseGlow">_</span>
          </h1>
          <p className="mt-1 text-[11px] tracking-widest text-slate-400">
            リンクドック — ポータブル・サイバーランチャー
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex flex-col items-end font-mono text-[10px] tracking-widest text-slate-400">
            <span>
              <span className="text-cyan-300/70">T+</span> {now}
            </span>
            <span className="text-[9px] text-slate-500">経過時刻</span>
          </span>
          <button
            type="button"
            onClick={handleReload}
            className="group flex flex-col items-center gap-0.5 border border-cyan-400/50 bg-slate-900/60 px-3 py-1.5 font-mono text-[11px] tracking-widest text-cyan-200 transition-all hover:bg-cyan-400/10 hover:shadow-[0_0_18px_rgba(34,211,238,0.55)]"
            title="links.json を再読込"
          >
            <span className="flex items-center gap-2">
              <span
                className={[
                  "inline-block transition-transform",
                  spinning
                    ? "rotate-[540deg] duration-700"
                    : "group-hover:rotate-180",
                ].join(" ")}
              >
                ⟳
              </span>
              RELOAD
            </span>
            <span className="text-[9px] tracking-wider text-cyan-200/70">
              再読込
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function CornerBrackets() {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-cyan-300/80" />
      <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-cyan-300/80" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-300/80" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-300/80" />
    </>
  );
}

function formatNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
