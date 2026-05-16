# CLAUDE.md - Project Rules & Guidelines

## 1. プロジェクト概要
- **アプリ名**: link-dock (Next-Gen Cyber Launcher)
- **目的**: 誰のPCに配置してもインストール不要で動作し、外部の `links.json` をメモ帳で編集するだけで運用できる、サイバーモダンなデザインのデスクトップ型ハイパーリンク集（EXEアプリ）。

## 2. 技術スタック & ベストプラクティス
### フロントエンド (Next.js & TypeScript)
- **Framework**: Next.js (App Router)
- **Build Mode**: `output: 'export'` (Tauriに組み込むため、完全な静的HTMLエクスポートを必須とする)
- **Type Safety**: インターフェース、関数の引数・戻り値には厳格にTypeScriptの型を定義すること。`any` の使用は原則禁止。
- **Component**: UIコンポーネントは機能ごとに細かく分割し、再利用性と可視性を高める。

### デザイン (Tailwind CSS)
- **Theme**: サイバーパンク / 近未来SFダッシュボード
- **Palette**: ベースはディープネイビー・リッチブラック、アクセントにネオンサイアン（水色）およびネオンパープルを使用。
- **Effect**: グラスモフィズム（`backdrop-blur`）、ネオン発光効果（`shadow`）、等幅フォント（`font-mono`）を効果的に使用すること。
- **Responsiveness**: ウィンドウサイズが変更されても崩れないレスポンシブデザイン（Flexbox/Grid）を徹底する。

### デスクトップ化 (Tauri)
- **Core**: Tauri (Rustベースの軽量ランタイム)
- **Build Target**: Windows環境用の `.exe` アプリケーション。

---

## 3. 重要ルール（外部JSON運用）
- **データの分離**: リンクデータはNext.jsのソースコード内にハードコーディング（埋め込み）してはならない。
- **動的ローカル読み込み**: アプリ起動時に、EXEと同じ階層（または指定のローカル相対パス）にある `links.json` を非同期でフェッチ（またはTauriのfs APIで読み込み）し、画面に動的反映するロジックにすること。
- **ノンプログラマー配慮**: `links.json` の構造は、非エンジニアがメモ帳で直感的に編集できるよう、極力シンプルで階層の浅いキー定義にすること。

---

## 4. 開発コマンド
Claude Code内でビルドや検証を行う際は、以下の標準コマンドを使用すること。

- **開発サーバー起動 (Next.js単体)**: `npm run dev`
- **Tauri開発モード (ウィンドウ起動)**: `npm run tauri dev`
- **静的HTMLエクスポート**: `npm run build` (内部で `next build` が走り、`out` フォルダを生成)
- **Windows用EXEビルド**: `npm run tauri build`
- **Lintチェック**: `npm run lint`

---

## 5. コードスタイル & ガイドライン
- **エラーハンドリング**: `links.json` の記述ミス（カンマ落ちやタイポ）によってアプリがクラッシュしないよう、try-catchによる堅牢なエラーハンドリングと、画面へのエラー通知UIを実装すること。
- **クリーンコード**: 未使用のインポート（Unused imports）はビルドエラーの原因になるため、保存前に必ず削除すること。
- **レスポンス**: コードを生成または修正する際は、必ずこの `CLAUDE.md` の記述をベースに、一貫性のあるサイバーテーマのUI/UXを維持すること。