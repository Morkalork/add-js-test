import * as vscode from "vscode";

export const getRootWorkspaceFolder = () => {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage(
      "This extension requires an open workspace."
    );
    return;
  }

  if (vscode.workspace.workspaceFolders.length > 1) {
    vscode.window.showErrorMessage(
      "This extension does not support multi-root workspaces."
    );
    return;
  }

  return vscode.workspace.workspaceFolders[0];
};
