import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import * as vscode from "vscode";
import previewer, { PreviewProvider } from "./PreviewProvider";
import { getActiveFolder, getExtensionConfig } from "./utils/vscode";
import { copySync } from "fs-extra";

export function activate(context: vscode.ExtensionContext) {
  previewer.init(context.extensionUri);

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
    if (!activeFilePath) {
      return;
    }
    previewer.setActiveFile(updateNodeModule(activeFilePath, context));
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
    if (!activeFilePath) {
      return;
    }
    if (getExtensionConfig().get("locked")) {
      return;
    }
    previewer.setActiveFile(updateNodeModule(activeFilePath, context));

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
  onActiveTextEditorChange();

  vscode.workspace.onDidSaveTextDocument(async (e) => {
    // TODO:
    // vue 的AutoPreview_函数组件的更新不会出发页面渲染，这里手动重新渲染
    if (e.languageId === "vue" && previewer.activeFile) {
      previewer.setActiveFile(updateNodeModule(previewer.activeFile, context));
    }
  });
}

export function deactivate() {}

function installNodeModule(context: vscode.ExtensionContext) {
  if (!getActiveFolder()) {
    return;
  }
  // 如果没有package.json，则不注入autopreview包
  const packagePath = join(getActiveFolder()!.uri.fsPath, "package.json");
  if (!existsSync(packagePath)) {
    return;
  }
  const src = join(context.extensionUri.fsPath, ".autopreview");
  const dst = join(
    getActiveFolder()!.uri.fsPath,
    "node_modules",
    "autopreview"
  );
  copySync(src, dst);
}

function updateNodeModule(
  activeFilePath: string,
  context: vscode.ExtensionContext
) {
  activeFilePath = activeFilePath.replaceAll("\\", "\\\\"); // Windows
  const src = join(context.extensionUri.fsPath, ".autopreview");
  const node_module = join(
    getActiveFolder()!.uri.fsPath,
    "node_modules",
    "autopreview"
  );
  const activeFileContent = readFileSync(activeFilePath, "utf-8");
  let indexJsContent = readFileSync(join(src, "index.template.js"), "utf-8");
  // 监控指定后缀文件的窗口变换
  if (!/(js|jsx|ts|tsx|vue)$/.test(activeFilePath)) {
    activeFilePath = "";
    indexJsContent = indexJsContent.replace(/.*import.*/g, activeFilePath);
  }
  if (/(node_modules)/.test(activeFilePath)) {
    activeFilePath = "";
    indexJsContent = indexJsContent.replace(/.*import.*/g, activeFilePath);
  }
  // 当前窗口是否使用AutoPreview, vue文件除外
  if (
    // !/(vue)$/.test(activeFilePath) &&
    activeFileContent.indexOf("AutoPreview_") === -1
  ) {
    activeFilePath = "";
    indexJsContent = indexJsContent.replace(/.*import.*/g, activeFilePath);
  }
  indexJsContent = indexJsContent.replaceAll("__active_file__", activeFilePath);
  const dst = join(node_module, "index.js");
  if (!existsSync(dst)) {
    installNodeModule(context);
  }
  writeFileSync(dst, indexJsContent);
  return activeFilePath;
}
