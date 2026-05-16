/**
 * リンクを開く。Electron 実行時は IPC 経由で `shell.openExternal` を呼び、
 * 既定ブラウザを起動。ブラウザ環境（next dev）では window.open フォールバック。
 */
export async function openExternal(url: string): Promise<void> {
  if (typeof window === "undefined") return;

  if (window.linkdock?.openExternal) {
    try {
      await window.linkdock.openExternal(url);
      return;
    } catch (err) {
      console.warn(
        "[LinkDock] electron openExternal failed, fallback to window.open",
        err,
      );
    }
  }

  window.open(url, "_blank", "noopener,noreferrer");
}
