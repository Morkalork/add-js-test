import * as vscode from "vscode";
import { addTest } from "./add-test.js";
import { getTestFramework } from "./get-test-framework.js";

export const activate = (context: vscode.ExtensionContext) => {
  let disposable = vscode.commands.registerCommand(
    "add-test.addTest",
    async () => {
      const currentlyOpenFile = vscode.window.activeTextEditor?.document;
      const currentlyOpenFileUri = currentlyOpenFile?.uri;
      if (!currentlyOpenFileUri) {
        vscode.window.showErrorMessage(
          "Could not determine file to add test to."
        );
        return;
      }
      const doc = await vscode.workspace.openTextDocument(currentlyOpenFileUri);
      const text = doc.getText();
      const fileExtension = doc.fileName.split(".").pop();
      const testFramework = await getTestFramework();
      if (testFramework === "unknown") {
        vscode.window.showErrorMessage("Could not determine test framework.");
        return;
      }
      addTest(text, currentlyOpenFileUri, testFramework, fileExtension);
    }
  );

  context.subscriptions.push(disposable);
};

// This method is called when your extension is deactivated
export function deactivate() {}
