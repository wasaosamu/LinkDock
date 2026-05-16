"use client";

import type { LinkItem } from "@/types/links";
import { openExternal } from "@/lib/openExternal";

interface Props {
  link: LinkItem;
}

const accentStyles: Record<
  NonNullable<LinkItem["accent"]>,
  { ring: string; glow: string; chip: string; text: string }
> = {
  cyan: {
    ring: "border-cyan-400/30 group-hover:border-cyan-300",
    glow: "shadow-[0_0_18px_rgba(34,211,238,0.18)] group-hover:shadow-[0_0_28px_rgba(34,211,238,0.5)]",
    chip: "bg-cyan-400/10 text-cyan-200 border-cyan-300/40",
    text: "text-cyan-200",
  },
  purple: {
    ring: "border-purple-400/30 group-hover:border-purple-300",
    glow: "shadow-[0_0_18px_rgba(168,85,247,0.18)] group-hover:shadow-[0_0_28px_rgba(168,85,247,0.5)]",
    chip: "bg-purple-400/10 text-purple-200 border-purple-300/40",
    text: "text-purple-200",
  },
  magenta: {
    ring: "border-pink-400/30 group-hover:border-pink-300",
    glow: "shadow-[0_0_18px_rgba(236,72,153,0.18)] group-hover:shadow-[0_0_28px_rgba(236,72,153,0.5)]",
    chip: "bg-pink-400/10 text-pink-200 border-pink-300/40",
    text: "text-pink-200",
  },
};

export function LinkCard({ link }: Props) {
  const accent = accentStyles[link.accent ?? "cyan"];
  const host = safeHost(link.url);

  return (
    <button
      type="button"
      onClick={() => openExternal(link.url)}
      className="group relative text-left"
      title={link.url}
    >
      <article
        className={[
          "relative h-full",
          "bg-slate-950/55 backdrop-blur-md",
          "border",
          accent.ring,
          accent.glow,
          "transition-all duration-200 ease-out",
          "group-hover:-translate-y-[2px]",
          "px-4 py-3",
        ].join(" ")}
      >
        {/* corner accents */}
        <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-cyan-300/80" />
        <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-cyan-300/80" />
        <span className="pointer-events-none absolute left-0 bottom-0 h-2 w-2 border-l border-b border-cyan-300/80" />
        <span className="pointer-events-none absolute right-0 bottom-0 h-2 w-2 border-r border-b border-cyan-300/80" />

        <header className="flex items-start gap-3">
          <div
            className={[
              "shrink-0 grid place-items-center",
              "h-10 w-10",
              "border",
              accent.ring,
              "bg-slate-900/70",
              "font-mono text-sm font-semibold",
              accent.text,
            ].join(" ")}
          >
            {link.icon ?? initials(link.title)}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-mono text-sm font-semibold tracking-wide text-slate-100 group-hover:text-white">
              {link.title}
            </h3>
            <p className="truncate font-mono text-[11px] text-slate-400 group-hover:text-cyan-200/90">
              {host}
            </p>
          </div>

          <ArrowIcon
            className={[
              "h-4 w-4 -translate-x-1 opacity-0",
              "transition-all duration-200",
              "group-hover:translate-x-0 group-hover:opacity-100",
              accent.text,
            ].join(" ")}
          />
        </header>

        {link.description && (
          <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-slate-400 group-hover:text-slate-300">
            {link.description}
          </p>
        )}

        {link.tags && link.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {link.tags.map((t) => (
              <li
                key={t}
                className={[
                  "border px-1.5 py-0.5",
                  "font-mono text-[10px] tracking-wider uppercase",
                  accent.chip,
                ].join(" ")}
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </article>
    </button>
  );
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function initials(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "??";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function ArrowIcon({ className = "" }: { className?: string }) {
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
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
