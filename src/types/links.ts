/**
 * LinkDock データ仕様 (links.json)
 * このファイル一つで全リンクが定義されます。
 */

export interface LinkItem {
  /** 一意な ID（重複時は表示順で安定化） */
  id: string;
  /** カード見出し */
  title: string;
  /** 遷移先 URL（http/https/file 等） */
  url: string;
  /** カード本文に表示する補足説明 */
  description?: string;
  /** タグ（検索対象） */
  tags?: string[];
  /** 1〜2文字のラベル / 絵文字（左上のアイコン枠に表示） */
  icon?: string;
  /** ホバー時のアクセント色キー */
  accent?: "cyan" | "purple" | "magenta";
}

export interface LinkCategory {
  id: string;
  label: string;
  links: LinkItem[];
}

export interface LinkConfig {
  title?: string;
  subtitle?: string;
  categories: LinkCategory[];
}

export const EMPTY_CONFIG: LinkConfig = {
  title: "LinkDock",
  subtitle: "links.json not found",
  categories: [],
};
