# LinkDock

> ポータブルなサイバーモダン・ハイパーリンクランチャー
> Portable cyber-modern hyperlink launcher — **Next.js × Electron**

EXE と同階層に置いた `links.json` をメモ帳で編集するだけで使える、インストール不要のリンク集アプリ。かつての HTA（HTML Application）のように、誰の PC に置いても運用できることを目指しています。

---

## 特徴

- **インストール不要** — ポータブル EXE をフォルダごとコピーするだけ
- **メモ帳で編集** — `links.json` を書き換えて RELOAD（再読込）で即反映
- **爆速検索** — タイトル / URL / 説明 / タグを横断するインクリメンタル検索
- **サイバーモダン UI** — ネオンサイアン × グラスモフィズム × 等幅フォント（Pattern A: Hacker Terminal）
- **英日併記** — UI メッセージ・サンプルデータすべて bilingual

---

## クイックスタート

### 前提

- Node.js 20+
- npm 10+

### 開発

```bash
git clone https://github.com/wasaosamu/LinkDock.git
cd LinkDock
npm install

# A) Next.js 単体（ブラウザでデバッグ）
npm run dev
# → http://localhost:3000

# B) Electron ウィンドウで起動（Next dev と Electron を同時起動）
npm run electron:dev
```

### Windows 用 EXE をビルド（macOS / Linux からも可能）

```bash
npm run electron:build            # NSIS インストーラ + portable
npm run electron:build:portable   # portable のみ
```

成果物は `dist/` 配下:

| ファイル | 用途 |
| --- | --- |
| `LinkDock-0.1.0-x64.exe` | NSIS インストーラ |
| `LinkDock-0.1.0-portable.exe` | ポータブル（インストール不要） |

> macOS 上から Windows EXE をビルド可能（Wine / Rust 不要）。コード署名なしのため、初回起動時に Windows SmartScreen の警告が出る場合があります。「詳細情報 → 実行」で起動できます。

---

## ポータブル運用

```
お好みのフォルダ/
├── LinkDock-0.1.0-portable.exe
└── links.json          ← メモ帳で編集
```

1. ポータブル EXE を任意のフォルダに配置
2. **同じフォルダ** に `links.json` を置く
3. EXE をダブルクリックで起動
4. `links.json` を書き換えたら、画面右上の **RELOAD（再読込）** で即時反映

`links.json` の探索順:

1. EXE と同階層（`PORTABLE_EXECUTABLE_DIR` → `path.dirname(process.execPath)`）
2. アプリ resources ディレクトリ（インストール版の同梱 `links.json`）
3. dev: プロジェクトルート → `public/`
4. ブラウザ環境: `fetch("/links.json")`

---

## `links.json` の書き方

```json
{
  "title": "LinkDock",
  "subtitle": "Hyperlink Command Center / ハイパーリンク・コマンドセンター",
  "categories": [
    {
      "id": "dev",
      "label": "DEVELOPMENT / 開発",
      "links": [
        {
          "id": "gh",
          "title": "GitHub",
          "url": "https://github.com",
          "description": "Source hosting / ソースホスティング",
          "tags": ["git", "code", "開発"],
          "icon": "GH",
          "accent": "cyan"
        }
      ]
    }
  ]
}
```

### スキーマ

| フィールド | 必須 | 型 | 説明 |
| --- | --- | --- | --- |
| `title` | optional | string | 表示用タイトル |
| `subtitle` | optional | string | ヘッダー下のサブタイトル |
| `categories[]` | **required** | array | カテゴリ配列 |
| `categories[].id` | required | string | カテゴリの一意 ID |
| `categories[].label` | required | string | カテゴリの見出し |
| `categories[].links[]` | required | array | リンク配列 |
| `links[].id` | required | string | リンクの一意 ID |
| `links[].title` | required | string | カード見出し |
| `links[].url` | required | string | 遷移先 URL（`https?:` / `mailto:` / `file:`） |
| `links[].description` | optional | string | カードの説明文 |
| `links[].tags` | optional | string[] | タグ配列（検索対象） |
| `links[].icon` | optional | string | 1〜2 文字のラベル or 絵文字 |
| `links[].accent` | optional | `"cyan"` / `"purple"` / `"magenta"` | カード強調色 |

---

## ショートカット

| キー | 動作 |
| --- | --- |
| `/` | 検索窓にフォーカス |
| `Esc` | 検索内容をクリア |

---

## 技術スタック

| レイヤ | 技術 |
| --- | --- |
| フロントエンド | Next.js 15 (App Router) / React 19 / TypeScript 5 / Tailwind CSS 3 |
| デスクトップ化 | Electron 33 + electron-builder 25 |
| 静的書き出し | `output: "export"` → `out/` |
| Electron 連携 | カスタム `app://` プロトコル + `contextBridge` IPC |

### Electron セキュリティ設定

| 項目 | 値 |
| --- | --- |
| `contextIsolation` | `true` |
| `nodeIntegration` | `false` |
| `sandbox` | `true` |
| `setWindowOpenHandler` | 内部ナビゲーションを全て `shell.openExternal` に転送 |
| 許可 URL スキーマ | `https?:` / `mailto:` / `file:` |
| ファイル読み取り | `links.json` のみ（IPC 経由） |

---

## プロジェクト構成

```
LinkDock/
├── electron/
│   ├── main.js          # メインプロセス (IPC + app:// プロトコル)
│   └── preload.js       # contextBridge で window.linkdock を公開
├── src/
│   ├── app/             # Next.js App Router (layout / page / globals.css)
│   ├── components/      # AppHeader / SearchBar / CategorySection / LinkCard / StateMessages
│   ├── lib/             # loadLinks / openExternal
│   └── types/           # LinkConfig / window.linkdock の型
├── public/links.json    # next dev / fetch フォールバック用
├── links.json           # 開発時の参照ファイル
├── REQUIREMENTS.md      # 要件定義
├── TODO.md              # 進捗管理
└── CLAUDE.MD            # プロジェクトルール
```

---

## スクリプト一覧

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | Next.js 単体（ブラウザでデバッグ） |
| `npm run build` | 静的書き出し（`out/`） |
| `npm run electron` | ビルド済み Electron をそのまま起動 |
| `npm run electron:dev` | Next dev + Electron ウィンドウを同時起動 |
| `npm run electron:build` | Windows NSIS + portable EXE をビルド |
| `npm run electron:build:portable` | portable EXE のみ |
| `npm run lint` | ESLint |

---

## デザイン

採用デザイン: **Pattern A — Hacker Terminal**（ネオンサイアン基調 / 鋭利なコーナーブラケット / 等幅フォント）

- 背景: ディープネイビー (`#0a0f1d`) + 48px サイアングリッド + アンビエント発光
- アクセント: ネオンサイアン (`#22d3ee`) を基調、補助でパープル / マゼンタ
- カード: グラスモフィズム + 4 隅コーナーブラケット + hover で `-2px` 浮上 & 発光強化
- タイポ: `font-mono` を見出し・コード文字列に積極使用

---

## 関連ドキュメント

- [REQUIREMENTS.md](./REQUIREMENTS.md) — 要件定義書
- [TODO.md](./TODO.md) — 進捗管理
- [CLAUDE.MD](./CLAUDE.MD) — プロジェクトルール

---

## ライセンス

TBD（要追加）
