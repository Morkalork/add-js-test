import * as vscode from "vscode";
import fs from "fs";
import { addTestContent } from "./add-test-content";
import { getIntegrationTestFramework } from "./get-integration-test-framework";
import { getUnitTestFramework } from "./get-unit-test-framework";
import { TestTypes } from "./types";
import { parseTextDocument } from "./utils/parse-text-document";

export const triggerTestCreation = async (
  frameworkType: TestTypes,
  filePath: string
) => {
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
