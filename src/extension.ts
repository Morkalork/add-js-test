import * as vscode from "vscode";
import { createTestFile } from "./create-test-file.js";
import { getTestFramework } from "./get-test-framework.js";

export const activate = (context: vscode.ExtensionContext) => {
  let disposable = vscode.commands.registerCommand(
    "create-test-file.createTestFile",
    async (commandInfo) => {
      const uri = vscode.Uri.parse(commandInfo.path);
      const doc = await vscode.workspace.openTextDocument(uri);
      const text = doc.getText();
      const fileExtension = doc.fileName.split(".").pop();
      const testFramework = await getTestFramework();
      if (testFramework === "unknown") {
        vscode.window.showErrorMessage("Could not determine test framework.");
        return;
      }
      createTestFile(text, uri, testFramework, fileExtension);
    }
  );

  context.subscriptions.push(disposable);
};

// This method is called when your extension is deactivated
export function deactivate() {}
