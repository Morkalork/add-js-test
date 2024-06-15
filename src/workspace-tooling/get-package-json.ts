import * as vscode from "vscode";
import { getRootWorkspaceFolder } from "./get-root-workspace-folder";
import { PackageJson } from "../utils/types";
import { logger } from "../utils/logger";
import { createPackageJson } from "../utils/create-package-json";
import { getConfiguration } from "./get-configuration";

export const getPackageJson = async (): Promise<PackageJson> => {
  const rootWorkspaceFolder = getRootWorkspaceFolder();
  if (!rootWorkspaceFolder) {
    return createPackageJson();
  }

  try {
    const rootPath = rootWorkspaceFolder.uri;
    const subPath = getConfiguration().get<string>("subPathToPackageJson") || "";
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
      return createPackageJson();
    }

    return packageJson;
  } catch (e) {
    logger().showErrorMessage(
      "Could not read package.json file, please set the explicit path to your package.json in settings, or explicitly set your test framework."
    );
    return createPackageJson();
  }
};
