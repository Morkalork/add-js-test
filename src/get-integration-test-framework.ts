import { z } from "zod";
import * as vscode from "vscode";
import { getRootWorkspaceFolder } from "./utils/get-root-workspace-folder";

const SupportedIntegrationTestFrameworkSchema = z.union([
  z.literal("unknown"),
  z.literal("enzyme"),
  z.literal("@testing-library/react"),
]);

export type SupportedIntegrationTestFramework = z.infer<
  typeof SupportedIntegrationTestFrameworkSchema
>;

export const getIntegrationTestFramework = async (
  testFrameworkData: string
): Promise<SupportedIntegrationTestFramework> => {
  const configuredTestFramework =
    SupportedIntegrationTestFrameworkSchema.safeParse(testFrameworkData);

  if (configuredTestFramework.success) {
    return configuredTestFramework.data;
  }

  const rootWorkspaceFolder = getRootWorkspaceFolder();
  if (!rootWorkspaceFolder) {
    return "unknown";
  }

  const rootPath = rootWorkspaceFolder.uri;
  const packageJsonPath = vscode.Uri.joinPath(rootPath, "package.json");
  const packageJsonBuffer = await vscode.workspace.fs.readFile(packageJsonPath);
  const packageJsonContent = Buffer.from(packageJsonBuffer).toString("utf8");
  const packageJson = JSON.parse(packageJsonContent);

  if (!packageJson) {
    return "unknown";
  }

  if (packageJson.dependencies?.enzyme || packageJson.devDependencies?.enzyme) {
    return "enzyme";
  }

  if (
    packageJson.dependencies?.["@testing-library/react"] ||
    packageJson.devDependencies?.["@testing-library/react"]
  ) {
    return "@testing-library/react";
  }

  return "unknown";
};
