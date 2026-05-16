/**
 * preload.js が `contextBridge` 経由で window に注入する API の型。
 */

export {};

declare global {
  interface LinkDockBridge {
    readonly isElectron: true;
    readLinks(): Promise<{ source: string; json: string }>;
    openExternal(url: string): Promise<void>;
  }

  interface Window {
    linkdock?: LinkDockBridge;
  }
}
