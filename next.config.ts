import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Tauri は静的書き出し (out/) を WebView に配信する想定。
 * - 本番ビルド: `output: "export"` で SSR を行わない
 * - 画像最適化は無効化（Tauri の `tauri://` 環境では Next の最適化サーバが無い）
 */
const nextConfig: NextConfig = {
  output: isProd ? "export" : undefined,
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
