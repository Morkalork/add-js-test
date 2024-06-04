import * as vscode from "vscode";
import fs from "fs";
import { addJsTestContent } from "./add-js-test-content";
import { getIntegrationTestFramework } from "./get-integration-test-framework";
import { getUnitTestFramework } from "./get-unit-test-framework";
import { TestTypes } from "./types";
import { parseTextDocument } from "./utils/parse-text-document";
import { logger } from "./utils/logger";

const defaultUnitTestFramework = "vitest";
const defaultIntegrationTestFramework = "@testing-library/react";

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

    let unitTestFramework = await getUnitTestFramework();
    const isUnknownUnitTestFramework =
      frameworkType === "unit" && unitTestFramework === "unknown";
    if (isUnknownUnitTestFramework) {
      logger().showErrorMessage(
        `Could not determine unit test framework, defaulting to ${defaultUnitTestFramework}, this can be changed in settings.`
      );
      unitTestFramework = defaultUnitTestFramework;
    }

    let integrationTestFramework = await getIntegrationTestFramework();

    const isUnknownIntegrationFramework =
      frameworkType === "integration" && integrationTestFramework === "unknown";
    if (isUnknownIntegrationFramework) {
      logger().showErrorMessage(
        `Could not determine integration test framework, defaulting to ${defaultUnitTestFramework}, this can be changed in settings.`
      );
      integrationTestFramework = defaultIntegrationTestFramework;
    }

    addJsTestContent(
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
