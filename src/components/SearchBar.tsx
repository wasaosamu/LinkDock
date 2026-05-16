"use client";

import { useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  count: number;
  total: number;
}

/**
 * 検索窓: 入力した瞬間にフィルタする。
 * フォーカス時はサイアンのライン発光、未フォーカス時は静かなボーダー。
 */
export function SearchBar({ value, onChange, count, total }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  // 起動時に自動フォーカス + "/" でフォーカス
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== ref.current) {
        e.preventDefault();
        ref.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === ref.current) {
        onChange("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onChange]);

  return (
    <div className="group relative w-full space-y-1">
      <div
        className="
          relative flex items-center gap-3
          border border-cyan-400/30
          bg-slate-950/50 backdrop-blur-md
          px-4 py-3
          shadow-[0_0_20px_rgba(34,211,238,0.12)]
          transition-all duration-200
          focus-within:border-cyan-300
          focus-within:shadow-[0_0_28px_rgba(34,211,238,0.45)]
        "
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
        }}
      >
        {/* corner accents */}
        <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-cyan-300" />
        <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-cyan-300" />

        <SearchIcon className="h-4 w-4 text-cyan-300/80 group-focus-within:text-cyan-200" />

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="filter links —  title / url / tag …    ( タイトル・URL・タグで絞り込み )"
          aria-label="リンクをタイトル・URL・タグで絞り込み"
          className="
            w-full bg-transparent
            font-mono text-sm tracking-wide
            text-slate-100 placeholder:text-slate-500
            outline-none
          "
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />

        <span className="hidden md:flex flex-col items-end font-mono text-cyan-300/70 leading-tight">
          <span className="text-xs">
            {count}/{total}
          </span>
          <span className="text-[9px] text-slate-500">表示 / 全件</span>
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            title="絞り込みをクリア"
            className="
              flex flex-col items-center gap-0.5
              font-mono text-[10px] uppercase tracking-widest
              border border-cyan-300/40 px-2 py-1
              text-cyan-200/80
              hover:bg-cyan-300/10 hover:text-cyan-100
              transition
            "
          >
            <span>clear</span>
            <span className="text-[8px] tracking-wider text-cyan-200/60">
              クリア
            </span>
          </button>
        )}
      </div>
      <p className="px-1 font-mono text-[10px] tracking-widest text-slate-500">
        <span className="text-cyan-300/70">/</span> キーでフォーカス・
        <span className="text-cyan-300/70">Esc</span> でクリア
      </p>
    </div>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
