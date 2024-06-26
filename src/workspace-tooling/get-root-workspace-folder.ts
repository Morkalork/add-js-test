import * as vscode from "vscode";
import { logger } from "../utils/logger";

export const getRootWorkspaceFolder = () => {
  if (!vscode.workspace.workspaceFolders) {
    logger().showErrorMessage("This extension requires an open workspace.");
    return;
  }

  if (vscode.workspace.workspaceFolders.length > 1) {
    // TODO: should we support this? How would we even handle it?
    logger().showErrorMessage(
      "This extension does not support multi-root workspaces."
    );
    return;
  }

  return vscode.workspace.workspaceFolders[0];
};
