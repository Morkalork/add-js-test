import * as vscode from "vscode";
import { triggerTestCreation } from "./trigger-test-creation.js";
import { logger } from "./utils/logger.js";

export const activate = (context: vscode.ExtensionContext) => {
  try {
    let disposableJSTS = vscode.commands.registerCommand(
      "add-js-test.addJsTest",
      async (commandInfo) => {
        logger().log("Add Test command triggered.");
        triggerTestCreation("unit", commandInfo?.fsPath);
      }
    );

    context.subscriptions.push(disposableJSTS);

    let disposableJSXTSX = vscode.commands.registerCommand(
      "add-js-test.addReactComponentTest",
      async (commandInfo) => {
        logger().log("Add React Component Test command triggered.");
        triggerTestCreation("integration", commandInfo?.fsPath);
      }
    );

    context.subscriptions.push(disposableJSXTSX);
  } catch (error) {
    if (error instanceof Error) {
      logger().error(error.message);
    } else {
      logger().error("An unknown error occurred. " + error);
    }
  }
};

// This method is called when your extension is deactivated
export function deactivate() {}
