import * as vscode from "vscode";
import { FunctionNameDefinition, getFunctionName } from "./get-function-name";
import path, { dirname } from "path";
import { SupportedTestFramework } from "./get-test-framework";
import { getDefaultTestFileContent } from "./get-default-test-file-content";

export const addTest = async (
  code: string,
  folder: vscode.Uri,
  testFramework: SupportedTestFramework,
  fileExtension = "ts"
) => {
  let functionName: FunctionNameDefinition = { name: "" };
  try {
    functionName = getFunctionName(code);
  } catch (error) {
    if (error instanceof Error) {
      vscode.window.showErrorMessage(error.message);
      return;
    }
  }

  const configuration = vscode.workspace.getConfiguration("addTest");
  const workspaceEdit = new vscode.WorkspaceEdit();
  const dirPath = dirname(folder.fsPath);
  const folderPath = vscode.Uri.file(dirPath);
  const fileName = path
    .basename(folder.fsPath)
    .replace(`.${fileExtension}`, "");
  const testSuffix = configuration
    .get("testFileSuffix")
    ?.toString()
    .replace(".", "");
  const filePath = vscode.Uri.joinPath(
    folderPath,
    `${fileName}.${testSuffix}.${fileExtension}`
  );

  workspaceEdit.createFile(filePath, { ignoreIfExists: true });

  const useCommonJS = configuration.get("useCommonJS") as boolean;
  const addImports = configuration.get("addImports") as boolean;
  const content = getDefaultTestFileContent(
    testFramework,
    functionName,
    fileName,
    useCommonJS,
    addImports
  );

  workspaceEdit.insert(filePath, new vscode.Position(0, 0), content);
  await vscode.workspace.applyEdit(workspaceEdit);

  const doc = await vscode.workspace.openTextDocument(filePath);
  vscode.window.showTextDocument(doc);
};
