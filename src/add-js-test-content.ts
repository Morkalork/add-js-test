import * as vscode from "vscode";
import {
  FunctionNameDefinition,
  getFunctionOrClassName,
} from "./ast-parsing/get-function-or-class-name";
import path, { dirname } from "path";
import { generateDefaultUnitTestFileContent } from "./generators/generate-default-unit-test-file-content";
import { SupportedIntegrationTestFramework } from "./workspace-tooling/get-integration-test-framework";
import { TestTypes } from "./types";
import { generateDefaultIntegrationTestFileContent } from "./generators/generate-default-integration-test-file-content";
import { SupportedUnitTestFramework } from "./workspace-tooling/get-unit-test-framework";
import { logger } from "./utils/logger";

export const addJsTestContent = async (
  code: string,
  folder: vscode.Uri,
  unitTestFramework: SupportedUnitTestFramework,
  integrationTestFramework: SupportedIntegrationTestFramework,
  fileExtension = "ts",
  testType: TestTypes
) => {
  let functionOrComponentName: FunctionNameDefinition = {
    name: "",
    isClass: false,
  };
  try {
    functionOrComponentName = getFunctionOrClassName(code);
  } catch (error) {
    if (error instanceof Error) {
      logger().showErrorMessage(error.message);
      return;
    }
  }

  const configuration = vscode.workspace.getConfiguration("addJsTest");
  const workspaceEdit = new vscode.WorkspaceEdit();
  const dirPath = dirname(folder.fsPath);
  const folderPath = vscode.Uri.file(dirPath);
  const fileName = path
    .basename(folder.fsPath)
    .replace(`.${fileExtension}`, "");

  if (functionOrComponentName.isDefault) {
    const changeCase = await import("change-case");
    functionOrComponentName.name = changeCase.camelCase(fileName);
  }

  const testSuffix = configuration.get("testFileSuffix")?.toString() || "test";
  const filePath = vscode.Uri.joinPath(
    folderPath,
    `${fileName}.${testSuffix}.${fileExtension}`
  );

  workspaceEdit.createFile(filePath, { ignoreIfExists: true });

  const useCommonJS = configuration.get("useCommonJS") as boolean;
  const skipImports = configuration.get("skipImports") as boolean;

  const addImports = !skipImports; // This is good, readable coding, but it's not necessary

  let content: string = "";
  switch (testType) {
    case "unit":
      content = generateDefaultUnitTestFileContent(
        unitTestFramework,
        functionOrComponentName,
        fileName,
        useCommonJS,
        addImports
      );
      break;
    case "integration":
      content = await generateDefaultIntegrationTestFileContent(
        integrationTestFramework,
        functionOrComponentName,
        fileName,
        useCommonJS,
        addImports
      );
      break;
  }

  workspaceEdit.insert(filePath, new vscode.Position(0, 0), content);
  await vscode.workspace.applyEdit(workspaceEdit);

  const doc = await vscode.workspace.openTextDocument(filePath);
  vscode.window.showTextDocument(doc);
};
