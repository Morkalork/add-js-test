import * as vscode from "vscode";
import fs from "fs";
import { addTestContent } from "./add-test-content";
import { getIntegrationTestFramework } from "./get-integration-test-framework";
import { getUnitTestFramework } from "./get-unit-test-framework";
import { TestTypes } from "./types";
import { parseTextDocument } from "./utils/parse-text-document";
import { logger } from "./utils/logger";

export const triggerTestCreation = async (
  frameworkType: TestTypes,
  filePath: string
) => {
  try {
    let text = "";
    let fileExtension = "";
    let currentlyOpenFileUri = vscode.Uri.file("");

    logger().log(`Creating a ${frameworkType} test for ${filePath}`);

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
      logger().showErrorMessage("Could not determine test framework.");
      return;
    }

    const integrationTestFrameworkData =
      configuration.get<string>("integration") || "";
    const integrationTestFramework = await getIntegrationTestFramework(
      integrationTestFrameworkData
    );

    const unknownIntegrationFramework =
      integrationTestFramework === "unknown" && frameworkType === "integration";
    if (unknownIntegrationFramework) {
      logger().showErrorMessage(
        "Could not determine test framework, aborting..."
      );
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

    logger().log(
      `Successfully created an ${frameworkType} test using ${
        frameworkType === "unit" ? unitTestFramework : integrationTestFramework
      } framework.`
    );
  } catch (e) {
    if (e instanceof Error) {
      logger().showErrorMessage(
        `Failed to add a test due to "${e.message.toLocaleLowerCase()}".`
      );
    }
  }
};
