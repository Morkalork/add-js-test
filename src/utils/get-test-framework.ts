import * as vscode from "vscode";
import { TestTypes } from "../types";
import { getRootWorkspaceFolder } from "./get-root-workspace-folder";
import { logger } from "./logger";
import { SafeParseReturnType } from "zod";

type PackageJson = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

export const getTestFramework = async <T>(
  typeOfTest: TestTypes,
  testTypeParser: (testData: unknown) => SafeParseReturnType<unknown, T>,
  supportedTestFrameworks: readonly T[],
  defaultValue: T
): Promise<T> => {
  const configuration = vscode.workspace.getConfiguration("addJsTest");
  const testFrameworkData = configuration.get<string>(typeOfTest) || "";

  const configuredTestFramework = testTypeParser(testFrameworkData);

  if (configuredTestFramework.success) {
    return configuredTestFramework.data;
  }

  const rootWorkspaceFolder = getRootWorkspaceFolder();
  if (!rootWorkspaceFolder) {
    return defaultValue;
  }

  try {
    const rootPath = rootWorkspaceFolder.uri;
    const subPath = configuration.get<string>("subPathToPackageJson") || "";
    const packageJsonPath = vscode.Uri.joinPath(
      rootPath,
      subPath,
      "package.json"
    );
    const packageJsonBuffer = await vscode.workspace.fs.readFile(
      packageJsonPath
    );
    const packageJsonContent = Buffer.from(packageJsonBuffer).toString("utf8");
    const packageJson: PackageJson | undefined = JSON.parse(packageJsonContent);
    if (!packageJson) {
      return defaultValue;
    }

    for (const framework of supportedTestFrameworks) {
      if (
        packageJson.dependencies?.[framework as string] ||
        packageJson.devDependencies?.[framework as string]
      ) {
        return framework as T;
      }
    }
  } catch (e) {
    logger().showErrorMessage(
      "Could not read package.json file, please set the explicit path to your package.json in settings, or explicitly set your test framework."
    );
  }

  return defaultValue;
};
