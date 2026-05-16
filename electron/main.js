// @ts-check
"use strict";

/**
 * LinkDock — Electron main process.
 *
 *  - dev: http://localhost:3000 (Next.js dev server)
 *  - prod: app:// custom protocol that serves the static export from `out/`
 *  - IPC: read external links.json + open external URLs via OS default browser
 */

const {
  app,
  BrowserWindow,
  protocol,
  net,
  ipcMain,
  shell,
} = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const { pathToFileURL } = require("node:url");

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

// Register the `app://` scheme as standard so relative URLs (CSS, JS) resolve.
// Must run before `app.whenReady()` resolves.
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
    },
  },
]);

/** @type {BrowserWindow | null} */
let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 720,
    minHeight: 480,
    title: "LinkDock",
    backgroundColor: "#0a0f1d",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Block in-app navigation; route any link click to the OS default browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url).catch(() => {});
    return { action: "deny" };
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000").catch((e) => {
      console.error("[LinkDock] failed to load dev server", e);
    });
  } else {
    mainWindow.loadURL("app://-/index.html").catch((e) => {
      console.error("[LinkDock] failed to load packaged UI", e);
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/**
 * Returns the directory that contains the EXE the user is actually running.
 * Electron-builder's "portable" target sets PORTABLE_EXECUTABLE_DIR;
 * for installed (NSIS) builds, `process.execPath`'s dir is the install location.
 */
function executableDir() {
  if (process.env.PORTABLE_EXECUTABLE_DIR) {
    return process.env.PORTABLE_EXECUTABLE_DIR;
  }
  return path.dirname(process.execPath);
}

/**
 * Read links.json. Search order:
 *  1) EXE-adjacent (portable / installed binary)
 *  2) extraResources bundled `links.json` (next to app.asar)
 *  3) project root (dev only)
 *  4) public/links.json (dev only)
 *
 * @returns {Promise<{ source: string; json: string }>}
 */
async function readLinksJson() {
  /** @type {string[]} */
  const candidates = [];

  if (app.isPackaged) {
    candidates.push(path.join(executableDir(), "links.json"));
    if (process.resourcesPath) {
      candidates.push(path.join(process.resourcesPath, "links.json"));
    }
  } else {
    candidates.push(path.join(__dirname, "..", "links.json"));
    candidates.push(path.join(__dirname, "..", "public", "links.json"));
  }

  for (const p of candidates) {
    try {
      const json = await fs.readFile(p, "utf-8");
      return { source: p, json };
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    "links.json was not found. Place it next to the executable.",
  );
}

/**
 * Resolve a request path under app:// to a local file in the export.
 * @param {string} pathname
 */
function resolveExportPath(pathname) {
  let p = decodeURIComponent(pathname);
  if (!p || p === "/" || p === "") p = "/index.html";
  // Trailing slash → index.html (matches Next.js export with trailingSlash:true)
  if (p.endsWith("/")) p += "index.html";
  // Strip leading slash for path.join
  const rel = p.replace(/^\/+/, "");
  return path.join(__dirname, "..", "out", rel);
}

app.whenReady().then(async () => {
  // Custom protocol — serve files from the Next.js export.
  protocol.handle("app", async (request) => {
    try {
      const url = new URL(request.url);
      let filePath = resolveExportPath(url.pathname);

      // If the resolved file doesn't exist but a directory variant does, try its index.html
      if (!fsSync.existsSync(filePath)) {
        const indexCandidate = path.join(filePath, "index.html");
        if (fsSync.existsSync(indexCandidate)) {
          filePath = indexCandidate;
        }
      }

      return net.fetch(pathToFileURL(filePath).toString());
    } catch (err) {
      console.error("[LinkDock] protocol handler error", err);
      return new Response("Not Found", { status: 404 });
    }
  });

  // IPC
  ipcMain.handle("linkdock:read-links", async () => readLinksJson());
  ipcMain.handle("linkdock:open-external", async (_event, url) => {
    if (typeof url !== "string") throw new Error("url must be string");
    // Only allow http(s), file, and mailto schemes — refuse anything weirder.
    const allowed = /^(https?:|mailto:|file:)/i;
    if (!allowed.test(url)) {
      throw new Error(`refused to open URL with scheme: ${url}`);
    }
    await shell.openExternal(url);
  });

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
