import * as vscode from "vscode";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getExtensionConfig } from "./utils/vscode";

export class PreviewProvider implements vscode.WebviewViewProvider {
  init(_extensionUri: vscode.Uri) {
    this._extensionUri = _extensionUri;
  }

  public static readonly id = "AutoPreview.debug";

  private _extensionUri!: vscode.Uri;
  view?: vscode.WebviewView;
  serverURL?: string;
  activeFile?: string;

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
          case "UPDATE_CONFIG":
            for (const key in data) {
              await getExtensionConfig().update(key, data[key]);
            }
            this.loadConfig();
            this.refreshPage();
            break;
          case "REFRESH":
            this.refreshPage({ force: true });
            break;
          case "LOCK":
            if (data) {
              vscode.commands.executeCommand("AutoPreview.debug.lock");
            } else {
              vscode.commands.executeCommand("AutoPreview.debug.unlock");
            }
            break;
          default:
            console.log("[extension] Ignore command:", command);
            break;
        }
      }
    );
    this.refreshPage();
  }

  loadConfig() {
    const config = getExtensionConfig();
    this.serverURL = config.get("serverURL");
  }

  setActiveFile(activeFile?: string) {
    this.activeFile = activeFile;
    this.view?.webview.postMessage({
      command: "SET_ACTIVE_FILE",
      data: activeFile,
    });
  }

  async refreshPage({ force }: { force?: boolean } = {}) {
    if (!this.view) {
      return;
    }
    this.loadConfig();
    if (force) {
      this.view.webview.html = "";
      setTimeout(() => {
        this.view!.webview.html = this._getHtmlForWebview();
      }, 50);
    } else {
      this.view.webview.html = this._getHtmlForWebview();
    }
  }

  private _getHtmlForWebview() {
    const appFilePath = join(
      this._extensionUri.path,
      "src",
      "app",
      "index.html"
    );

    const appUri = this.view!.webview.asWebviewUri(
      vscode.Uri.file(join(this._extensionUri.path, "out", "app", "index.js"))
    );
    const styles: any = {
      ["__CSS__"]: this.view!.webview.asWebviewUri(
        vscode.Uri.file(
          join(this._extensionUri.path, "src", "app", "style", "index.css")
        )
      ),
      ["__CODICON__"]: this.view!.webview.asWebviewUri(
        vscode.Uri.file(
          join(
            this._extensionUri.path,
            "src",
            "app",
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
          join(this._extensionUri.path, "src", "app", "script", filename)
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
    return html;
  }

  dispose() {}
}

const previewer = new PreviewProvider();
export default previewer;
