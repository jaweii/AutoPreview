import getPort from 'get-port';
import * as puppeteer from 'puppeteer-core';
import * as chrome from 'karma-chrome-launcher';
import wsStore from './wsStore';
import previewer from './PreviewProvider';
import * as vscode from "vscode";

function getChromiumPath() {
  let foundPath: string | undefined = undefined;
  const knownChromiums = Object.keys(chrome);
  knownChromiums.forEach((key) => {
    if (foundPath) { return; }
    if (!key.startsWith('launcher')) { return; }
    // @ts-ignore
    const info: typeof import('karma-chrome-launcher').example = chrome[key];
    if (!info[1].prototype) { return; }
    if (!info[1].prototype.DEFAULT_CMD) { return; }
    const possiblePaths = info[1].prototype.DEFAULT_CMD;
    const maybeThisPath = possiblePaths[process.platform];
    if (maybeThisPath && typeof maybeThisPath === 'string') {
      foundPath = maybeThisPath;
    }
  });
  return foundPath;
}


export const domains = ["Accessibility", "Animation", "Audits", "BackgroundService", "Browser", "CacheStorage", "Cast",
  "Console", "CSS", "Database", "Debugger", "DeviceOrientation", "DOM", "DOMDebugger", "DOMSnapshot", "DOMStorage",
  "Emulation", "EventBreakpoints", "Fetch", "HeadlessExperimental", "HeapProfiler", "IndexedDB", "Input", "Inspector",
  "IO", "LayerTree", "Log", "Media", "Memory", "Network", "Overlay", "Page", "Performance", "PerformanceTimeline",
  "Profiler", "Runtime", "Schema", "Security", "ServiceWorker", "Storage", "SystemInfo", "Target", "Tethering",
  "Tracing", "WebAudio", "WebAuthn"];


class CDPController {
  previewer = previewer;

  async init() {
    this.port = await getPort();
    this.browser = await puppeteer.launch({
      executablePath: getChromiumPath(),
      args: [`--remote-debugging-port=${this.port}`],
      ignoreHTTPSErrors: true
    });
    const [page] = await this.browser.pages();
    this.page = page;

    this.page.on('dialog', dialog => {
      const type = dialog.type();
      const message = dialog.message();
      const value = dialog.defaultValue();
      if (type === 'alert') {
        vscode.window.showInformationMessage(message);
        dialog.accept();
      }
      if (type === 'confirm') {
        vscode.window.showQuickPick(['Ok', 'Cancel'], { title: message }).then((result) => {
          if (result === 'Ok') {
            dialog.accept();
          } else {
            dialog.dismiss();
          }
        });
      }
      if (type === 'prompt') {
        vscode.window.showInputBox({ placeHolder: message }).then((result) => {
          dialog.accept(result);
        });
      }
    });

    this.client = await page.target().createCDPSession();

    // 接收CDP事件
    this.client.on('*', (action: string, data?: any) => {
      if (action.indexOf('screen') === -1) { console.log(action, data); };
      wsStore.appClient?.send(JSON.stringify({ action, data }));
    });

    // 执行CDP请求
    wsStore.on('CDP', ({ action, data }) => {
      return new Promise((resolve) => {
        this.client?.send(action, data).then(resolve).catch(resolve);
      });
    });
  }

  port?: number;
  browser?: puppeteer.Browser;
  page?: puppeteer.Page;
  client?: puppeteer.CDPSession;

  dispose() {
    this.browser?.close();
    wsStore.off('CDP');
  }
}

const cdpController = new CDPController();
export default cdpController;