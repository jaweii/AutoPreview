import * as vscode from "vscode";
import { readFileSync } from "fs";
import { join } from "path";
import { getExtensionConfig } from "./utils/vscode";
import * as http from "http";

export class PreviewProvider implements vscode.WebviewViewProvider {
  init(_extensionUri: vscode.Uri) {
    this._extensionUri = _extensionUri;
  }

  public static readonly id = "AutoPreview.debug";

  private _extensionUri!: vscode.Uri;
  view?: vscode.WebviewView;
  serverURL?: string;
  activeFile?: string;
  serviceAvailable = false;
  componentIndex = 0;

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
    webviewView.webview.onDidReceiveMessage(
      async ({ command, data }: { command: string; data: any }) => {
        console.log("[extension] receive a message:", command, data);
        switch (command) {
          case "APP_MOUNTED":
            this.view?.webview.postMessage({
              command: "LOAD_CONFIG",
              data: {
                serverURL: this.serverURL,
                serviceAvailable: this.serviceAvailable,
                activeFile: this.activeFile,
                componentIndex: this.componentIndex,
                ...JSON.parse(JSON.stringify(getExtensionConfig())),
              },
            });
            break;
          case "UPDATE_CONFIG":
            for (const key in data) {
              await getExtensionConfig().update(key, data[key]);
            }
            this.loadConfig();
            this.refreshPage({ force: true });
            break;
          case "SET_COMPONENT_INDEX":
            this.componentIndex = data;
            break;
          case "REFRESH":
            this.refreshPage({
              force: true,
            });
            break;
          case "LOCK":
            if (data) {
              vscode.commands.executeCommand("AutoPreview.debug.lock");
            } else {
              vscode.commands.executeCommand("AutoPreview.debug.unlock");
            }
            break;
          case "ERROR":
            vscode.window.showErrorMessage(data);
            break;
          case "SET_BACKGROUND":
            getExtensionConfig().update("background", data);
            break;
          default:
            console.log("[extension] Ignore command:", command);
            break;
        }
      }
    );
    this.refreshPage({ force: true });
  }

  loadConfig() {
    const config = getExtensionConfig();
    this.serverURL = config.get("serverURL");
  }

  setActiveFile(activeFile?: string) {
    if (this.activeFile !== activeFile) {
      this.componentIndex = 0;
    }
    this.activeFile = activeFile;
    this.view?.webview.postMessage({
      command: "SET_COMPONENT_INDEX",
      data: this.componentIndex,
    });
    this.view?.webview.postMessage({
      command: "SET_ACTIVE_FILE",
      data: activeFile,
    });
  }

  async checkServerURL() {
    if (!this.serverURL) {
      return (this.serviceAvailable = false);
    }
    try {
      await new Promise((resolve, reject) => {
        http
          .get(this.serverURL!, (res) => {
            this.serviceAvailable = true;
            resolve(true);
          })
          .on("error", (err) => {
            this.serviceAvailable = false;
            resolve(false);
          });
      });
    } catch (err) {
      console.log(err);
      this.serviceAvailable = false;
    }
  }

  async refreshPage({ force }: { force?: boolean } = {}) {
    if (!this.view) {
      return;
    }
    this.loadConfig();
    if (force) {
      await this.checkServerURL();
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
    return readFileSync(appFilePath, "utf-8");
  }

  dispose() {}
}

const previewer = new PreviewProvider();
export default previewer;
