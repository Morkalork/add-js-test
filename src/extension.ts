import * as vscode from "vscode";
import { getUnitTestFramework } from "./get-unit-test-framework.js";
import { parseTextDocument } from "./utils/parse-text-document.js";
import { addTestContent } from "./add-test-content.js";
import { TestTypes } from "./types.js";
import { getIntegrationTestFramework } from "./get-integration-test-framework.js";
import fs from "fs";

const triggerTest = async (frameworkType: TestTypes, filePath: string) => {
  try {
    let text = "";
    let fileExtension = "";
    let currentlyOpenFileUri = vscode.Uri.file("");

    if (filePath) {
      text = fs.readFileSync(filePath, "utf8");
      fileExtension = filePath.split(".").pop() || "";
      currentlyOpenFileUri = vscode.Uri.file(filePath);
    } else {
      const document = vscode.window.activeTextEditor?.document;
      const documentInfo = await parseTextDocument(document);
      text = documentInfo.text;
      fileExtension = documentInfo.fileExtension || "";
      currentlyOpenFileUri = documentInfo.currentlyOpenFileUri;
    }

    if (!fileExtension) {
      fileExtension = "js";
    }

    const configuration = vscode.workspace.getConfiguration("addTest");
    const unitTestFrameworkData = configuration.get<string>("unit") || "";

    const unitTestFramework = await getUnitTestFramework(unitTestFrameworkData);
    if (unitTestFramework === "unknown") {
      vscode.window.showErrorMessage("Could not determine test framework.");
      return;
    }

    const integrationTestFrameworkData =
      configuration.get<string>("integration") || "";
    const integrationTestFramework = await getIntegrationTestFramework(
      integrationTestFrameworkData
    );

    if (
      integrationTestFramework === "unknown" &&
      frameworkType === "integration"
    ) {
      return;
    }

    addTestContent(
      text,
      currentlyOpenFileUri,
      unitTestFramework,
      integrationTestFramework,
      fileExtension,
      frameworkType
    );
  } catch (e) {
    if (e instanceof Error) {
      vscode.window.showErrorMessage(
        `Failed to add a test due to "${e.message.toLocaleLowerCase()}".`
      );
    }
  }
};

type CommandInfoType = {};

export const activate = (context: vscode.ExtensionContext) => {
  let disposableJSTS = vscode.commands.registerCommand(
    "add-test.addTest",
    async (commandInfo) => {
      triggerTest("unit", commandInfo?.fsPath);
    }
  );

  context.subscriptions.push(disposableJSTS);

  let disposableJSXTSX = vscode.commands.registerCommand(
    "add-test.addReactComponentTest",
    async (commandInfo) => {
      triggerTest("integration", commandInfo?.fsPath);
    }
  );

  context.subscriptions.push(disposableJSXTSX);
};

// This method is called when your extension is deactivated
export function deactivate() {}
