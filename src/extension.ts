import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import * as vscode from "vscode";
import previewer, { PreviewProvider } from "./PreviewProvider";
import { getActiveFolder, getExtensionConfig } from "./utils/vscode";
import { copySync } from "fs-extra";
import DebugConfigProvider from "./DebugConfigProvider";
import getPort from "get-port";
import WSStore from "./WSStore";

export async function activate(context: vscode.ExtensionContext) {
  const wsPort = await getPort();
  const wsStore = new WSStore(wsPort);
  previewer.init({ extensionUri: context.extensionUri, wsStore });

  vscode.commands.registerCommand("AutoPreview.debug.refresh", () => {
    initWorkspace();
    previewer.refreshPage({ force: true });
  });
  vscode.commands.registerCommand("AutoPreview.debug.lock", async () => {
    getExtensionConfig().update("locked", true);
  });
  vscode.commands.registerCommand("AutoPreview.debug.unlock", async () => {
    getExtensionConfig().update("locked", false);
    const activeFilePath = vscode.window.activeTextEditor?.document.uri.fsPath;
    updateActiveFile(activeFilePath!, context);
  });

  const disposable = vscode.window.registerWebviewViewProvider(
    PreviewProvider.id,
    previewer
  );
  context.subscriptions.push(disposable);

  async function initWorkspace() {
    if (!getActiveFolder()) {
      return;
    }
    installNodeModule(context);
    previewer.loadConfig();
  }
  initWorkspace();
  vscode.workspace.onDidChangeWorkspaceFolders((e) => initWorkspace());

  // 活动窗口变化
  async function onActiveTextEditorChange() {
    const activeFilePath = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (getExtensionConfig().get("locked")) {
      return;
    }

    updateActiveFile(activeFilePath!, context);

    const modulePath = join(
      getActiveFolder()!.uri.fsPath,
      "node_modules",
      "autopreview"
    );
    if (!existsSync(modulePath)) {
      installNodeModule(context);
    }
  }
  vscode.window.onDidChangeActiveTextEditor(onActiveTextEditorChange);
  if (getActiveFolder()) {
    onActiveTextEditorChange();
  }

  vscode.workspace.onDidSaveTextDocument(async (e) => {
    // TODO:
    // vue 的AutoPreview_函数组件的更新不会出发页面渲染，这里手动重新渲染
    if (e.languageId === "vue" && wsStore.activeFile) {
      updateActiveFile(wsStore.activeFile, context);
    }
  });

  vscode.debug.registerDebugConfigurationProvider('AutoPreview', DebugConfigProvider);


}

export function deactivate() {
}


function installNodeModule(context: vscode.ExtensionContext) {
  if (!getActiveFolder()) {
    return;
  }
  // 如果没有package.json，则不注入autopreview包
  const packagePath = join(getActiveFolder()!.uri.fsPath, "package.json");
  if (!existsSync(packagePath)) {
    return;
  }
  const src = join(context.extensionUri.fsPath, "package");
  const dst = join(
    getActiveFolder()!.uri.fsPath,
    "node_modules",
    "autopreview"
  );
  copySync(src, dst);
}

function updateActiveFile(
  activeFile: string,
  context: vscode.ExtensionContext
) {
  if (!activeFile || activeFile.split(/(\\|\/)/).length <= 1) {
    return;
  }
  activeFile = activeFile.replaceAll("\\", "\\\\"); // Windows
  const src = join(context.extensionUri.fsPath, "package");
  const node_module = join(
    getActiveFolder()!.uri.fsPath,
    "node_modules",
    "autopreview"
  );
  const activeFileContent = readFileSync(activeFile, "utf-8");
  let indexJsContent = readFileSync(join(src, "index.template.js"), "utf-8");
  // 监控指定后缀文件的窗口变换
  if (!/(js|jsx|ts|tsx|vue)$/.test(activeFile)) {
    activeFile = "";
    indexJsContent = indexJsContent.replace(/.*import.*/g, activeFile);
  }
  if (/(node_modules)/.test(activeFile)) {
    activeFile = "";
    indexJsContent = indexJsContent.replace(/.*import.*/g, activeFile);
  }
  // 当前窗口是否使用AutoPreview, vue文件除外
  if (
    // !/(vue)$/.test(activeFile) &&
    activeFileContent.indexOf("AutoPreview_") === -1
  ) {
    activeFile = "";
    indexJsContent = indexJsContent.replace(/.*import.*/g, activeFile);
  }
  indexJsContent = indexJsContent.replaceAll("__active_file__", activeFile);
  const dst = join(node_module, "index.js");
  if (!existsSync(dst)) {
    installNodeModule(context);
  }

  if (activeFile && previewer.wsStore.activeFile !== activeFile) {
    previewer.wsStore._update({
      componentIndex: 0,
      activeFile,
      appMounted: false,
      componentMounted: false,
      components: [],
    });
    // previewer.wsStore._wss.clients.forEach(client => client.close());
    // previewer.refreshPage({ force: true });
    writeFileSync(dst, indexJsContent);
  }

}


