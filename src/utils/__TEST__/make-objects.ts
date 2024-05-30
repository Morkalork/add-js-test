import * as vscode from "vscode";

export const makeWorkspaceFolder = (
  uri?: vscode.Uri
): vscode.WorkspaceFolder => ({
  uri: uri || vscode.Uri.file("/"),
  name: "test",
  index: 0,
});
