import * as vscode from "vscode";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getExtensionConfig } from "./utils/vscode";
import axios from "axios";
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
          case "APP_LOADED":
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
    const appFilePath = join(this._extensionUri.fsPath, "public", "index.html");

    const appUri = this.view!.webview.asWebviewUri(
      vscode.Uri.file(join(this._extensionUri.fsPath, "out", "app", "index.js"))
    );
    const styles: any = {
      ["__CSS__"]: this.view!.webview.asWebviewUri(
        vscode.Uri.file(
          join(this._extensionUri.fsPath, "public", "style", "index.css")
        )
      ),
      ["__CODICON__"]: this.view!.webview.asWebviewUri(
        vscode.Uri.file(
          join(
            this._extensionUri.fsPath,
            "public",
            "style",
            "codicon",
            "codicon.css"
          )
        )
      ),
    };
    const getScript = (filename: string) =>
      this.view!.webview.asWebviewUri(
        vscode.Uri.file(
          join(this._extensionUri.fsPath, "public", "script", filename)
        )
      );
    const scripts: any = {
      ["__SCRIPT_REACT__"]: getScript("react.development@17.0.2.js"),
      ["__SCRIPT_REACT_DOM__"]: getScript("react-dom.development@17.js"),
      ["__SCRIPT_BABEL__"]: getScript("babel.min@6.26.0.js"),
      ["__SCRIPT_MOBX__"]: getScript("mobx.umd.development@6.3.13.js"),
      ["__SCRIPT_MOBX_REACT__"]: getScript(
        "mobxreactlite.umd.development@3.2.3.js"
      ),
      ["__SCRIPT_TAILWIND__"]: getScript("tailwind@3.0.14.js"),
    };
    let html = readFileSync(appFilePath, "utf-8");
    html = html.replace("__SERVER_URL__", this.serverURL || "");
    html = html.replace(
      "__SERVER_URL_AVAILABLE__",
      this.serviceAvailable ? "true" : "false"
    );
    html = html.replace("__VS_CONFIG__", JSON.stringify(getExtensionConfig()));
    Object.keys(styles).forEach((key) => {
      html = html.replace(key, styles[key].toString());
    });
    Object.keys(scripts).forEach((key) => {
      html = html.replace(key, scripts[key]);
    });
    html = html.replaceAll(
      "__APP_ROOT__",
      `${appUri.toString().replace("/index.js", "")}`
    );
    html = html.replace("__ACTIVE_FILE__", this.activeFile || "");
    html = html.replace("__COMPONENT_INDEX__", this.componentIndex.toString());
    return html;
  }

  dispose() {}
}

const previewer = new PreviewProvider();
export default previewer;
