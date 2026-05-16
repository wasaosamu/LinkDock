"use client";

/**
 * 読み込み中 / エラー / 空状態の表示。Pattern A のコンソール風。
 */

export function LoadingState() {
  return (
    <div className="relative border border-cyan-400/20 bg-slate-950/40 px-5 py-8 font-mono text-sm text-cyan-200/80">
      <CornerBrackets />
      <p className="animate-pulseGlow tracking-widest">
        <span className="text-cyan-300">[boot]</span> loading links.json …
      </p>
      <p className="mt-1 text-xs tracking-widest text-slate-400">
        // 起動中 — links.json を読み込んでいます
      </p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="relative border border-pink-400/40 bg-slate-950/50 px-5 py-4 font-mono text-sm text-pink-200 shadow-[0_0_18px_rgba(244,114,182,0.25)]">
      <CornerBrackets tone="pink" />
      <p className="tracking-widest text-pink-300">
        <span className="text-pink-400">[fatal]</span> failed to load links.json
      </p>
      <p className="mt-0.5 text-xs tracking-widest text-pink-200/70">
        // 致命的エラー — links.json の読み込みに失敗しました
      </p>
      <p className="mt-2 text-xs text-pink-200/80">{message}</p>
      <p className="mt-3 text-xs text-slate-400">
        // ファイル位置（探索順）:
        <br />
        &nbsp;&nbsp;1) EXE と同階層 / resource ディレクトリ
        <br />
        &nbsp;&nbsp;2) アプリ設定ディレクトリ
        <br />
        &nbsp;&nbsp;3) public/links.json (dev)
      </p>
    </div>
  );
}

export function EmptyState({ query }: { query: string }) {
  return (
    <div className="relative border border-cyan-400/20 bg-slate-950/40 px-5 py-8 text-center font-mono text-sm text-slate-400">
      <CornerBrackets />
      {query ? (
        <>
          <p className="text-cyan-200">
            <span className="text-cyan-400">[query]</span> &quot;{query}&quot;
          </p>
          <p className="mt-2 tracking-widest text-slate-500">
            // no matching links — 該当するリンクはありません
          </p>
        </>
      ) : (
        <>
          <p className="text-cyan-200">
            <span className="text-cyan-400">[ready]</span> links.json is empty
          </p>
          <p className="mt-2 tracking-widest text-slate-500">
            // 準備完了 — メモ帳で links.json を編集して Reload してください
          </p>
        </>
      )}
    </div>
  );
}

function CornerBrackets({ tone = "cyan" }: { tone?: "cyan" | "pink" }) {
  const c =
    tone === "pink" ? "border-pink-300/80" : "border-cyan-300/80";
  return (
    <>
      <span className={`pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t ${c}`} />
      <span className={`pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t ${c}`} />
      <span className={`pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l ${c}`} />
      <span className={`pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r ${c}`} />
    </>
  );
}
