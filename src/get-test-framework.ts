import * as vscode from "vscode";
import { z } from "zod";

const SupportedTestFrameworkSchema = z.union([
  z.literal("unknown"),
  z.literal("jest"),
  z.literal("vitest"),
  z.literal("mocha"),
]);

export type SupportedTestFramework = z.infer<
  typeof SupportedTestFrameworkSchema
>;

export const getTestFramework = async (): Promise<SupportedTestFramework> => {
  const configuration = vscode.workspace.getConfiguration("createTestFile");
  const testFrameworkData = configuration.get("testFramework");

  const configuredTestFramework =
    SupportedTestFrameworkSchema.safeParse(testFrameworkData);
  if (configuredTestFramework.success) {
    return configuredTestFramework.data;
  }

  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage(
      "This extension requires an open workspace."
    );
    return "unknown";
  }

  if (vscode.workspace.workspaceFolders.length > 1) {
    vscode.window.showErrorMessage(
      "This extension does not support multi-root workspaces."
    );
    return "unknown";
  }

  const rootPath = vscode.workspace.workspaceFolders[0].uri;
  const packageJsonPath = vscode.Uri.joinPath(rootPath, "package.json");
  const packageJsonBuffer = await vscode.workspace.fs.readFile(packageJsonPath);
  const packageJsonContent = Buffer.from(packageJsonBuffer).toString("utf8");
  const packageJson = JSON.parse(packageJsonContent);

  if (!packageJson) {
    return "vitest";
  }

  if (packageJson.dependencies?.jest || packageJson.devDependencies?.jest) {
    return "jest";
  }

  if (packageJson.dependencies?.vitest || packageJson.devDependencies?.vitest) {
    return "vitest";
  }

  if (packageJson.dependencies?.mocha || packageJson.devDependencies?.mocha) {
    return "mocha";
  }

  return "unknown";
};
