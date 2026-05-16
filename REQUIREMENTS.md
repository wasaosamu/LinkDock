# LinkDock — 要件定義書

## 1. プロジェクト概要

**プロジェクト名**: LinkDock
**目的**: Windows 用のインストール不要・ポータブル型「ハイパーリンク集（ランチャーアプリ）」を提供する。
**コンセプト**: かつての HTA（HTML Application）のように、EXE と同階層に置かれた `links.json` をメモ帳で書き換えるだけで、リンクが動的に更新される。誰の PC にも配置可能で、運用・編集のハードルがゼロのモダンランチャー。

## 2. ターゲット環境

| 項目 | 内容 |
| --- | --- |
| OS | Windows 10 / 11（64bit） |
| 配布形態 | NSIS インストーラ EXE + ポータブル EXE（electron-builder） |
| 依存ランタイム | なし（Electron は Chromium / Node を同梱） |
| 同階層ファイル | `LinkDock.exe`, `links.json` |

## 3. 技術スタック

| レイヤ | 技術 |
| --- | --- |
| フロントエンド | Next.js 15 (App Router) / TypeScript / Tailwind CSS |
| デスクトップ化 | **Electron 33** + electron-builder |
| ビルドターゲット | `win --x64`（NSIS + portable） |
| データ管理 | 起動時に EXE と同階層の `links.json` を IPC で読み込み |
| Next.js モード | `output: "export"`（静的書き出し）→ Electron がカスタム `app://` プロトコルで配信 |

> 採用デザイン: **Pattern A — Hacker Terminal**（ネオンサイアン基調 / 鋭利なコーナーブラケット / 等幅フォント）

## 4. 機能要件

### 4.1 必須機能 (MVP)

| ID | 機能 | 内容 |
| --- | --- | --- |
| F-01 | リンク表示 | `links.json` を読み込みカテゴリ別にカード表示 |
| F-02 | リンク起動 | カードクリックで既定ブラウザで URL を開く（`shell.openExternal`） |
| F-03 | リアルタイム検索 | 検索窓に入力した瞬間に title / url / description / tags を横断フィルタ |
| F-04 | カテゴリ表示 | カテゴリ単位にグルーピングしてセクション表示 |
| F-05 | エラーハンドリング | `links.json` が無い・壊れている場合のフォールバック表示 |
| F-06 | 再読込 | 「Reload」ボタンで `links.json` を再読込 |

### 4.2 オプション機能（後続検討）

- ピン留め（お気に入り上位固定）
- カテゴリフィルタ（タブ切替）
- ダーク/ライト切替（基本はサイバーダーク固定）
- 最近開いたリンク履歴

## 5. データ仕様（links.json）

```jsonc
{
  "title": "LinkDock",
  "subtitle": "Hyperlink Command Center",
  "categories": [
    {
      "id": "dev",
      "label": "DEVELOPMENT",
      "links": [
        {
          "id": "gh",
          "title": "GitHub",
          "url": "https://github.com",
          "description": "Source hosting",
          "tags": ["git", "code"],
          "icon": "GH",
          "accent": "cyan"
        }
      ]
    }
  ]
}
```

### 5.1 型定義（TypeScript）

```ts
interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  icon?: string;
  accent?: "cyan" | "purple" | "magenta";
}
interface LinkCategory { id: string; label: string; links: LinkItem[]; }
interface LinkConfig {
  title?: string;
  subtitle?: string;
  categories: LinkCategory[];
}
```

## 6. 非機能要件

| 項目 | 要件 |
| --- | --- |
| 起動時間 | 4 秒以内（初回起動・Electron Chromium ウォームアップ後）|
| バイナリサイズ | NSIS インストーラ ~ 80–100 MB（Electron は重め）|
| メモリ | 200 MB 前後を目安 |
| 編集容易性 | `links.json` をメモ帳で編集 → 「Reload」で即時反映 |
| 配布容易性 | ポータブル EXE は単体配布、NSIS はインストーラ配布 |

## 7. UI / UX 要件（Pattern A: Hacker Terminal）

- **背景**: ダークネイビー (`#0a0f1d`) ＋ うっすらサイアン/パープルのアンビエント発光 + 48px グリッド
- **アクセント**: ネオンサイアン (`#22d3ee`) を基調、補助でパープル / マゼンタ
- **カード**: グラスモフィズム (`backdrop-blur`) + 鋭利な角 + 四隅コーナーブラケット + サイアン発光 (`shadow-[0_0_18px_...]`)
- **タイポ**: 等幅フォント (`font-mono`) を見出し・コード文字列に積極使用
- **インタラクション**: hover で `-2px` 浮上 + 発光強化、検索窓フォーカスでライン強化、`/` でフォーカス、`Esc` でクリア
- **アニメーション**: `pulseGlow`（カーソル風）、`floatY`、すべて Tailwind の transition

## 8. ファイル配置（ランタイム）

### ポータブル EXE 構成（推奨）

```
LinkDock/
├── LinkDock-0.1.0-portable.exe   ← electron-builder 成果物
└── links.json                    ← ユーザーが編集する設定ファイル
```

### NSIS インストーラ構成

```
%LOCALAPPDATA%\Programs\LinkDock\
├── LinkDock.exe
├── resources\
│   ├── app.asar
│   └── links.json                ← extraResources で同梱
└── ...
```

## 9. ディレクトリ構成（リポジトリ）

```
LinkDock/
├── REQUIREMENTS.md
├── TODO.md
├── CLAUDE.MD
├── package.json                # electron-builder 設定を含む
├── next.config.ts              # output: "export"
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── links.json                  # 開発時の参照用
├── public/
│   └── links.json              # next dev / fetch フォールバック
├── electron/
│   ├── main.js                 # Electron メインプロセス
│   └── preload.js              # contextBridge で API 注入
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── AppHeader.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CategorySection.tsx
│   │   ├── LinkCard.tsx
│   │   └── StateMessages.tsx
│   ├── lib/
│   │   ├── loadLinks.ts        # window.linkdock.readLinks() を最優先
│   │   └── openExternal.ts     # window.linkdock.openExternal()
│   └── types/
│       ├── links.ts
│       └── electron.d.ts       # window.linkdock の型
├── out/                        # next build 生成（コミット対象外）
└── dist/                       # electron-builder 成果物（コミット対象外）
```

## 10. 前提条件・開発環境

| ツール | バージョン |
| --- | --- |
| Node.js | 20 以上 |
| npm | 10 以上 |
| OS | 開発は macOS / Linux / Windows いずれも可。Windows EXE のビルドも macOS から可能（コード署名なし）|

> Rust / cargo は不要（Tauri から Electron に切替）。

## 11. セキュリティ設計（Electron）

| 項目 | 値 |
| --- | --- |
| `contextIsolation` | `true` |
| `nodeIntegration` | `false` |
| `sandbox` | `true` |
| `preload` | `electron/preload.js`（`contextBridge` 経由のみ API 公開）|
| `setWindowOpenHandler` | すべてのリンクを `shell.openExternal` に転送して既定ブラウザを起動 |
| URL スキーマ検証 | `openExternal` は `https?:` / `mailto:` / `file:` のみ許可 |
| ファイル読み取り | `links.json` 1 ファイル限定。`fs.readFile` をメインプロセスで実行 |

## 12. 起動・ビルドコマンド

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | Next.js 単体（ブラウザでデバッグ用）|
| `npm run electron:dev` | Next dev + Electron ウィンドウを同時起動 |
| `npm run build` | Next.js を静的書き出し（`out/`）|
| `npm run electron:build` | Windows 用 NSIS + portable EXE をビルド（`dist/`）|
| `npm run electron:build:portable` | portable EXE のみ |

## 13. リスク・留意点

1. **コード署名なし**: SmartScreen が警告を出すことがある。商用配布では Code Signing 証明書を検討。
2. **EXE 隣接の `links.json`**: portable では `process.env.PORTABLE_EXECUTABLE_DIR`、インストール版では `path.dirname(process.execPath)` を参照。
3. **`out/` の `links.json`**: `public/links.json` は dev / fetch フォールバック用に同梱されるが、配布物では `extraResources` から読む。
4. **ASAR**: `links.json` は `extraResources` 経由なので ASAR の外に配置され、ユーザー編集可能。

## 14. 完了条件 (Definition of Done)

- [ ] `npm run electron:dev` でデスクトップウィンドウが起動する
- [ ] `links.json` を書き換え → 「Reload」で UI に反映される
- [ ] 検索窓でインクリメンタル絞り込みが動く
- [ ] `npm run electron:build` で `.exe` がビルドできる（macOS からも可）
- [ ] ポータブル EXE と同階層に置いた `links.json` が読まれる
