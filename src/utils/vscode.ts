import * as vscode from "vscode";

export function getActiveFolder() {
  const workspaceFolders = vscode.workspace.workspaceFolders || [];
  if (workspaceFolders?.length === 0) {
    return undefined;
  }
  if (workspaceFolders?.length === 1) {
    return workspaceFolders[0];
  }
  const activeFileName = vscode.window.activeTextEditor?.document.fileName;
  if (!activeFileName) {
    return workspaceFolders[0];
  }
  const activeFolder = workspaceFolders.find((folder) =>
    activeFileName.startsWith(folder.uri.fsPath)
  );
  return activeFolder;
}

export function getExtensionConfig() {
  return vscode.workspace.getConfiguration("AutoPreview");
}
