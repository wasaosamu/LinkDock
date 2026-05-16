// @ts-check
"use strict";

/**
 * Preload script — exposes a minimal, typed API to the renderer
 * via contextBridge. The renderer cannot import `electron` directly
 * (contextIsolation: true, sandbox: true).
 */

const { contextBridge, ipcRenderer } = require("electron");

const api = Object.freeze({
  /**
   * Reads the LinkDock links.json from the EXE-adjacent location.
   * @returns {Promise<{ source: string; json: string }>}
   */
  readLinks: () => ipcRenderer.invoke("linkdock:read-links"),

  /**
   * Opens a URL in the OS default browser.
   * @param {string} url
   * @returns {Promise<void>}
   */
  openExternal: (url) => ipcRenderer.invoke("linkdock:open-external", url),

  /** Marker so the renderer can detect Electron quickly. */
  isElectron: true,
});

contextBridge.exposeInMainWorld("linkdock", api);
