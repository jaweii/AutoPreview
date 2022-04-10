import * as vscode from "vscode";
import { readFileSync } from "fs";
import { join } from "path";
import { getExtensionConfig } from "./utils/vscode";
import * as http from "http";
import output from "./utils/output";
import WSStore from "./WSStore";
import { reaction } from "mobx";

export class PreviewProvider implements vscode.WebviewViewProvider {
  init({ extensionUri, wsStore }: { extensionUri: vscode.Uri; wsStore: WSStore }) {
    this._extensionUri = extensionUri;
    this.wsStore = wsStore;
    wsStore._on('REFRESH', () => this.refreshPage({ force: true }));
    wsStore._on('ERROR', (data: string) => vscode.window.showErrorMessage(data));
    wsStore._on('CONSOLE', ({ type, data }: { type: string, data: string }) => {
      const args: any[] = JSON.parse(data);
      for (const line of args) {
        if (typeof line === "string") {
          // 过滤输出
          if (/^(\[PACKAGE\]|\[EXTENSION\]|\[EXTENSION\/VIEW\])/.test(line)) {
            break;
          }
          const index = args.indexOf(line);
          if (index === 0) {
            output.appendLine(`[${type}] ${line}`);
          } else {
            output.appendLine(`${line}`);
          }
        } else {
          output.appendLine(JSON.stringify(line));
        }
      }
    });
    reaction(() => wsStore.serverURL, () => {
      getExtensionConfig().update('serverURL', wsStore.serverURL);
      // this.refreshPage({ force: true });
    });
    reaction(() => wsStore.locked, () => {
      vscode.commands.executeCommand(`AutoPreview.debug.${wsStore.locked ? 'lock' : 'unlock'}`);
    });
    reaction(() => wsStore.background, () => getExtensionConfig().update("background", wsStore.background));
    reaction(() => wsStore.center, () => getExtensionConfig().update("center", wsStore.center));
    reaction(() => wsStore.appMounted, () => wsStore.appMounted && this.checkServerURL());
  }

  public static readonly id = "AutoPreview.debug";

  private _extensionUri!: vscode.Uri;
  public wsStore!: WSStore;

  view?: vscode.WebviewView;

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
      enableForms: true,
      enableCommandUris: true,
    };
    this.view.onDidChangeVisibility(() => this.refreshPage());
    this.refreshPage({ force: true });
  }

  loadConfig() {
    const config = getExtensionConfig();
    this.wsStore._update({
      serverURL: config.get("serverURL"),
    });
  }

  async checkServerURL() {
    if (!this.wsStore.serverURL) {
      return this.wsStore._update({ 'serverURLAvailable': false });
    }
    try {
      await new Promise((resolve, reject) => {
        http
          .get(this.wsStore.serverURL!, (res) => {
            this.wsStore._update({ 'serverURLAvailable': true });
            resolve(true);
          })
          .on("error", (err) => {
            this.wsStore._update({ 'serverURLAvailable': false });
            resolve(false);
          });
      });
    } catch (err) {
      console.log(err);
      this.wsStore._update({ 'serverURLAvailable': false });
    }
  }

  async refreshPage({ force }: { force?: boolean } = {}) {
    if (!this.view) {
      return;
    }
    this.wsStore._update({ appMounted: false, componentMounted: false, packageInitiated: false, });
    this.loadConfig();
    if (force) {
      this.view.webview.html = "";
      await new Promise((resolve, reject) => setTimeout(resolve, 50));
      this.view!.webview.html = this._getHtmlForWebview();
    } else {
      this.view.webview.html = this._getHtmlForWebview();
    }
  }

  private _getHtmlForWebview() {
    const appFilePath = join(
      this._extensionUri.fsPath,
      "app",
      "dist",
      "index.html"
    );
    let html = readFileSync(appFilePath, "utf-8");
    html = html.replace('__WS_PORT__', this.wsStore._port.toString());
    return html;
  }

  dispose() { }
}

const previewer = new PreviewProvider();
export default previewer;
