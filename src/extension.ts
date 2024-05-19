import * as vscode from "vscode";
import { getUnitTestFramework } from "./get-unit-test-framework.js";
import { parseTextDocument } from "./utils/parse-text-document.js";
import { getIntegrationTestFramework } from "./get-integration-test-framework.js";
import { addTestContent } from "./add-test-content.js";

export const activate = (context: vscode.ExtensionContext) => {
  let disposableJSTS = vscode.commands.registerCommand(
    "add-test.addTest",
    async () => {
      const doc = vscode.window.activeTextEditor?.document;
      const { text, fileExtension, currentlyOpenFileUri } =
        await parseTextDocument(doc);

      const configuration = vscode.workspace.getConfiguration("addTest");
      const testFrameworkData =
        configuration.get<string>("unitTestFramework") || "";

      const unitTestFramework = await getUnitTestFramework(testFrameworkData);
      if (unitTestFramework === "unknown") {
        vscode.window.showErrorMessage("Could not determine test framework.");
        return;
      }
      addTestContent(
        text,
        currentlyOpenFileUri,
        unitTestFramework,
        fileExtension,
        "unit"
      );
    }
  );

  context.subscriptions.push(disposableJSTS);

  let disposableJSXTSX = vscode.commands.registerCommand(
    "add-test.addReactComponentTest",
    async () => {
      const doc = vscode.window.activeTextEditor?.document;
      const { text, fileExtension, currentlyOpenFileUri } =
        await parseTextDocument(doc);
      const configuration = vscode.workspace.getConfiguration("addTest");
      const testFrameworkData =
        configuration.get<string>("integrationTestFramework") || "";
      const integrationTestFramework = await getIntegrationTestFramework(
        testFrameworkData
      );

      if (integrationTestFramework === "unknown") {
        vscode.window.showErrorMessage("Could not determine test framework.");
        return;
      }

      addTestContent(
        text,
        currentlyOpenFileUri,
        integrationTestFramework,
        fileExtension,
        "integration"
      );
    }
  );

  context.subscriptions.push(disposableJSXTSX);
};

// This method is called when your extension is deactivated
export function deactivate() {}
