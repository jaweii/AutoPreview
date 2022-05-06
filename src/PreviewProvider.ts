import * as vscode from "vscode";
import { readFileSync } from "fs";
import { join } from "path";
import { getExtensionConfig } from "./utils/vscode";
import * as http from "http";
import output from "./utils/output";
import wsStore from "./wsStore";
import { reaction } from "mobx";

export class PreviewProvider implements vscode.WebviewViewProvider {
  init({ extensionUri }: { extensionUri: vscode.Uri }) {
    this._extensionUri = extensionUri;
    //#region 自定义指令
    wsStore.on('REFRESH', () => this.refreshPage({ force: true }));
    wsStore.on('ERROR', (data: string) => vscode.window.showErrorMessage(data));
    //#endregion
    //#region 响应数据变化
    reaction(() => wsStore.attributes.serverURL, () => {
      getExtensionConfig().update('serverURL', wsStore.attributes.serverURL);
    });
    reaction(() => wsStore.attributes.locked, () => {
      vscode.commands.executeCommand(`AutoPreview.debug.${wsStore.attributes.locked ? 'lock' : 'unlock'}`);
    });
    reaction(() => wsStore.attributes.background, () => getExtensionConfig().update("background", wsStore.attributes.background));
    reaction(() => wsStore.attributes.center, () => getExtensionConfig().update("center", wsStore.attributes.center));
    reaction(() => wsStore.attributes.appMounted, () => wsStore.attributes.appMounted && this.checkServerURL());
    reaction(() => [wsStore.attributes.components, wsStore.attributes.componentIndex], () => {
      if (!this.view) { return; };
      if ((wsStore.attributes.components || []).length === 0) {
        // this.view.title = '';
      }
      // this.view.title = wsStore.attributes.components![wsStore.attributes.componentIndex!];
    });
    //#endregion
  }

  public static readonly id = "AutoPreview.debug";

  private _extensionUri!: vscode.Uri;

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
    wsStore.update({
      serverURL: config.get("serverURL"),
    });
  }

  async checkServerURL() {
    const { serverURL } = wsStore.attributes;
    if (!serverURL) {
      return wsStore.update({ 'serverURLAvailable': false });
    }
    try {
      await new Promise((resolve, reject) => {
        http
          .get(serverURL!, (res) => {
            wsStore.update({ 'serverURLAvailable': true });
            resolve(true);
          })
          .on("error", (err) => {
            wsStore.update({ 'serverURLAvailable': false });
            resolve(false);
          });
      });
    } catch (err) {
      console.log(err);
      wsStore.update({ 'serverURLAvailable': false });
    }
  }

  async refreshPage({ force }: { force?: boolean } = {}) {
    if (!this.view) {
      return;
    }
    this.loadConfig();
    if (force) {
      this.view.webview.html = "";
      await new Promise((resolve, reject) => setTimeout(resolve, 50));
    }
    wsStore.update({ appMounted: false, componentMounted: false, packageInitiated: false, });
    this.view.webview.html = this._getHtmlForWebview();
  }

  private _getHtmlForWebview() {
    const appFilePath = join(
      this._extensionUri.fsPath,
      "app",
      "dist",
      "index.html"
    );
    let html = readFileSync(appFilePath, "utf-8");
    html = html.replace('__WS_PORT__', wsStore.port.toString());
    return html;
  }

  dispose() { }
}

const previewer = new PreviewProvider();
export default previewer;
