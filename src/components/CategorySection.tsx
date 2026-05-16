"use client";

import type { LinkCategory } from "@/types/links";
import { LinkCard } from "./LinkCard";

interface Props {
  category: LinkCategory;
}

/**
 * カテゴリ単位のセクション。Pattern A の "── LABEL ─────" 区切り。
 */
export function CategorySection({ category }: Props) {
  return (
    <section className="space-y-3">
      <header className="flex items-center gap-3">
        <span className="font-mono text-[11px] tracking-[0.4em] text-cyan-300/80">
          ──
        </span>
        <h2 className="font-mono text-[12px] font-semibold tracking-[0.4em] text-cyan-200 [text-shadow:0_0_10px_rgba(34,211,238,0.35)]">
          {category.label}
        </h2>
        <span className="h-px flex-1 bg-cyan-400/20" />
        <span className="font-mono text-[10px] tracking-widest text-slate-500">
          {category.links.length} link{category.links.length === 1 ? "" : "s"}
          <span className="ml-1 text-slate-600">／{category.links.length} 件</span>
        </span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {category.links.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}
