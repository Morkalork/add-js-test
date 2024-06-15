import * as vscode from "vscode";

export const getConfiguration = () =>
  vscode.workspace.getConfiguration("addJsTest");
