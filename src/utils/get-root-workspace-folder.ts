import * as vscode from "vscode";
import { logger } from "./logger";

export const getRootWorkspaceFolder = () => {
  if (!vscode.workspace.workspaceFolders) {
    logger().showErrorMessage("This extension requires an open workspace.");
    return;
  }

  if (vscode.workspace.workspaceFolders.length > 1) {
    logger().showErrorMessage(
      "This extension does not support multi-root workspaces."
    );
    return;
  }

  return vscode.workspace.workspaceFolders[0];
};
