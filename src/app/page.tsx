"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadLinks } from "@/lib/loadLinks";
import type { LinkConfig, LinkItem } from "@/types/links";
import { AppHeader } from "@/components/AppHeader";
import { SearchBar } from "@/components/SearchBar";
import { CategorySection } from "@/components/CategorySection";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/StateMessages";

export default function HomePage() {
  const [config, setConfig] = useState<LinkConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadLinks()
      .then((c) => {
        if (cancelled) return;
        setConfig(c);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setConfig(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const filteredCategories = useMemo(() => {
    if (!config) return [];
    const q = query.trim().toLowerCase();
    if (!q) return config.categories;
    return config.categories
      .map((cat) => ({
        ...cat,
        links: cat.links.filter((l) => matchLink(l, q)),
      }))
      .filter((cat) => cat.links.length > 0);
  }, [config, query]);

  const totalLinks = useMemo(() => {
    if (!config) return 0;
    return config.categories.reduce((s, c) => s + c.links.length, 0);
  }, [config]);

  const visibleLinks = useMemo(
    () => filteredCategories.reduce((s, c) => s + c.links.length, 0),
    [filteredCategories],
  );

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return (
    <main className="min-h-screen bg-cyber-stage px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <AppHeader subtitle={config?.subtitle} onReload={reload} />

        <SearchBar
          value={query}
          onChange={setQuery}
          count={visibleLinks}
          total={totalLinks}
        />

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && filteredCategories.length === 0 && (
          <EmptyState query={query} />
        )}

        {!loading && !error && filteredCategories.length > 0 && (
          <div className="space-y-8">
            {filteredCategories.map((cat) => (
              <CategorySection key={cat.id} category={cat} />
            ))}
          </div>
        )}

        <footer className="mt-8 space-y-1 border-t border-cyan-400/15 pt-4 font-mono text-[10px] tracking-widest text-slate-500">
          <p>
            // edit{" "}
            <span className="text-cyan-300/80">links.json</span> next to the
            executable, then hit RELOAD
          </p>
          <p className="text-slate-600">
            // EXE と同じフォルダの{" "}
            <span className="text-cyan-300/80">links.json</span>{" "}
            をメモ帳で編集して、RELOAD（再読込）を押してください
          </p>
        </footer>
      </div>
    </main>
  );
}

function matchLink(l: LinkItem, q: string): boolean {
  const hay = [
    l.title,
    l.url,
    l.description ?? "",
    ...(l.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}
