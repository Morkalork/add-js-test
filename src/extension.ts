import * as vscode from "vscode";
import { triggerTestCreation } from "./trigger-test-creation.js";

export const activate = (context: vscode.ExtensionContext) => {
  let disposableJSTS = vscode.commands.registerCommand(
    "add-test.addTest",
    async (commandInfo) => {
      triggerTestCreation("unit", commandInfo?.fsPath);
    }
  );

  context.subscriptions.push(disposableJSTS);

  let disposableJSXTSX = vscode.commands.registerCommand(
    "add-test.addReactComponentTest",
    async (commandInfo) => {
      triggerTestCreation("integration", commandInfo?.fsPath);
    }
  );

  context.subscriptions.push(disposableJSXTSX);
};

// This method is called when your extension is deactivated
export function deactivate() {}
