import type { LinkConfig } from "@/types/links";
import { EMPTY_CONFIG } from "@/types/links";

/**
 * `links.json` を読み込む。
 *
 * 探索順:
 *  1) Electron 実行時: メインプロセスの IPC (EXE 隣接 → extraResources → dev フォールバック)
 *  2) ブラウザ環境 (next dev): `/links.json` を fetch（public/ 配下）
 *  3) すべて失敗 → 空の構成
 */
export async function loadLinks(): Promise<LinkConfig> {
  if (typeof window !== "undefined" && window.linkdock?.readLinks) {
    try {
      const { json, source } = await window.linkdock.readLinks();
      console.info("[LinkDock] loaded from", source);
      return parseConfig(json);
    } catch (err) {
      console.warn(
        "[LinkDock] electron read failed, fallback to fetch",
        err,
      );
    }
  }

  const fromFetch = await tryFetch("/links.json");
  if (fromFetch) return fromFetch;

  return EMPTY_CONFIG;
}

async function tryFetch(url: string): Promise<LinkConfig | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return parseConfig(await res.text());
  } catch {
    return null;
  }
}

function parseConfig(text: string): LinkConfig {
  const data = JSON.parse(text) as Partial<LinkConfig>;
  if (!data || !Array.isArray(data.categories)) {
    throw new Error("Invalid links.json: missing 'categories' array");
  }
  return {
    title: data.title ?? "LinkDock",
    subtitle: data.subtitle,
    categories: data.categories,
  };
}
