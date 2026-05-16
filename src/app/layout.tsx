import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkDock — Hyperlink Command Center / ハイパーリンク・コマンドセンター",
  description:
    "Portable cyber-modern hyperlink launcher. Edit links.json and reload. / ポータブルなサイバーモダン・ランチャー。links.json を編集して再読込してください。",
};

export const viewport: Viewport = {
  themeColor: "#0a0f1d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="min-h-screen bg-cyber-stage text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
