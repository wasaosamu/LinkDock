# LinkDock — TODO / 進捗管理

> 進捗管理ルール: 着手中は `- [~]`、完了は `- [x]`、未着手は `- [ ]`
> 最終更新: 2026-05-16（**Tauri → Electron へフレームワーク切替**）

## 0. 環境準備

- [x] Node.js 20+ の確認（v24 OK）
- [x] ~~Rust / cargo~~ → **不要になりました**（Electron 採用）
- [x] electron 33 / electron-builder 25 / concurrently / wait-on / cross-env 導入

## 1. プロジェクト初期化

- [x] REQUIREMENTS.md / TODO.md / CLAUDE.MD
- [x] `package.json`（electron-builder 設定込み）
- [x] `tsconfig.json`（electron/ を除外）
- [x] `next.config.ts`（`output: "export"`）
- [x] `tailwind.config.ts` + `postcss.config.mjs`
- [x] `.gitignore`（dist/ out/ 追加）
- [x] `npm install`
- [x] **next@15.5.18 / react@19.0.6**（CVE-2025-66478 fixed）
- [x] `npm run dev` 起動確認（http://localhost:3000）

## 2. データ層

- [x] `src/types/links.ts` 型定義
- [x] `src/types/electron.d.ts`（`window.linkdock` の型）
- [x] `src/lib/loadLinks.ts`（IPC 優先 / fetch フォールバック / 空構成）
- [x] `src/lib/openExternal.ts`（IPC 優先 / window.open フォールバック）
- [x] サンプル `links.json` 生成（root と public/ の両方）
- [ ] `links.json` のスキーマバリデーション（後続）

## 3. デザイン

- [x] 3 案を提示（A/B/C）& カタログで比較
- [x] **採用: Pattern A (Hacker Terminal)**
- [x] `/design-catalog` 削除済み

## 4. UI 実装（Pattern A）

- [x] `src/app/globals.css`
- [x] `src/app/layout.tsx`
- [x] `src/app/page.tsx`
- [x] `src/components/AppHeader.tsx`
- [x] `src/components/SearchBar.tsx`
- [x] `src/components/CategorySection.tsx`
- [x] `src/components/LinkCard.tsx`
- [x] `src/components/StateMessages.tsx`

## 5. Electron 統合

- [x] `electron/main.js`
  - `app://` カスタムプロトコルで `out/` を配信
  - dev は `http://localhost:3000` に接続
  - IPC: `linkdock:read-links`, `linkdock:open-external`
  - `setWindowOpenHandler` で外部 URL を OS 既定ブラウザに転送
  - 許可 URL スキーマ: `https?:` / `mailto:` / `file:`
- [x] `electron/preload.js`（`contextBridge` で `window.linkdock` 公開）
- [x] セキュリティ: `contextIsolation` true / `nodeIntegration` false / `sandbox` true
- [x] `package.json` の `build` セクション（NSIS + portable、`links.json` を `extraResources`）
- [x] 構文チェック (`node -c`) OK / `tsc --noEmit` クリーン
- [x] dev モードで Electron 起動確認（クラッシュなし）
- [ ] アイコン素材 (`build/icon.ico`) 用意（未指定 = electron デフォルト）

## 6. スクリプト

- [x] `npm run dev` — Next.js 単体
- [x] `npm run build` — `next build` → `out/`
- [x] `npm run electron` — Electron 単独起動
- [x] `npm run electron:dev` — Next dev + Electron 同時起動（concurrently）
- [x] `npm run electron:build` — Windows NSIS + portable EXE
- [x] `npm run electron:build:portable` — portable EXE のみ

## 7. ビルド & 配布

- [x] `npm run build` で `out/` が生成されることを確認
- [x] **`npm run electron:build` 完走（macOS から Windows EXE ビルド成功）**
  - `dist/LinkDock-0.1.0-x64.exe` (139 MB, NSIS インストーラ)
  - `dist/LinkDock-0.1.0-portable.exe` (139 MB, ポータブル)
  - `dist/win-unpacked/resources/links.json` で extraResources も確認
- [x] dev モードで Electron ウィンドウ起動確認（ヘルパープロセス + `app://` スキーマ登録確認）
- [ ] 生成された EXE を Windows 実機で動作確認
- [ ] ポータブル EXE と `links.json` を同フォルダに置いて動作確認
- [ ] バージョニング（`0.1.0` 開始）

## 8. 後続フェーズ（任意）

- [ ] ピン留め / お気に入り
- [ ] カテゴリタブ切替
- [ ] 履歴
- [ ] アイコン自動取得（favicon フェッチ）
- [ ] アプリアイコン（`build/icon.ico`）
- [ ] 自動アップデート（electron-updater）
- [ ] コード署名

## メモ / 課題

- macOS から Windows EXE をビルド可能（Tauri と異なり Wine 不要）。コード署名なしのため、Windows 側で SmartScreen 警告が出る可能性あり。
- 残存 vulnerabilities: production は moderate 2 件（Next 同梱 postcss、ビルド時のみ）。dev は electron-builder の transitive 多数（許容）。
- `links.json` の探索順:
  1. EXE 隣接（`PORTABLE_EXECUTABLE_DIR` → `path.dirname(process.execPath)`）
  2. `process.resourcesPath/links.json`（extraResources 経由）
  3. dev: プロジェクトルート → public/
  4. ブラウザ環境: `fetch("/links.json")`
  5. すべて失敗 → `EMPTY_CONFIG`
