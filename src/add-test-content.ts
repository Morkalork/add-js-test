import * as vscode from "vscode";
import {
  FunctionNameDefinition,
  getFunctionOrClassName,
} from "./utils/get-function-or-class-name";
import path, { dirname } from "path";
import { getDefaultUnitTestFileContent } from "./get-default-unit-test-file-content";
import { SupportedIntegrationTestFramework } from "./get-integration-test-framework";
import { TestTypes } from "./types";
import { getDefaultIntegrationTestFileContent } from "./get-default-integration-test-file-content";
import { SupportedUnitTestFramework } from "./get-unit-test-framework";

const getConfigurationName = (type: TestTypes) => {
  switch (type) {
    case "unit":
      return "addUnitTest";
    case "integration":
      return "addIntegrationTest";
  }
};

export const addTestContent = async (
  code: string,
  folder: vscode.Uri,
  testFramework: SupportedUnitTestFramework | SupportedIntegrationTestFramework,
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
      vscode.window.showErrorMessage(error.message);
      return;
    }
  }

  const configurationName = getConfigurationName(testType);

  const configuration = vscode.workspace.getConfiguration(configurationName);
  const workspaceEdit = new vscode.WorkspaceEdit();
  const dirPath = dirname(folder.fsPath);
  const folderPath = vscode.Uri.file(dirPath);
  const fileName = path
    .basename(folder.fsPath)
    .replace(`.${fileExtension}`, "");
  const testSuffix = configuration.get("testFileSuffix")?.toString() || "test";
  const filePath = vscode.Uri.joinPath(
    folderPath,
    `${fileName}.${testSuffix}.${fileExtension}`
  );

  workspaceEdit.createFile(filePath, { ignoreIfExists: true });

  const useCommonJS = configuration.get("useCommonJS") as boolean;
  const skipImports = configuration.get("skipImports") as boolean;

  let content: string = "";
  switch (testType) {
    case "unit":
      content = getDefaultUnitTestFileContent(
        testFramework as SupportedUnitTestFramework,
        functionOrComponentName,
        fileName,
        useCommonJS,
        skipImports
      );
      break;
    case "integration":
      content = getDefaultIntegrationTestFileContent(
        testFramework as SupportedIntegrationTestFramework,
        functionOrComponentName,
        fileName,
        useCommonJS,
        skipImports
      );
      break;
  }

  workspaceEdit.insert(filePath, new vscode.Position(0, 0), content);
  await vscode.workspace.applyEdit(workspaceEdit);

  const doc = await vscode.workspace.openTextDocument(filePath);
  vscode.window.showTextDocument(doc);
};
