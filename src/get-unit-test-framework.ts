import * as vscode from "vscode";
import { z } from "zod";
import { getRootWorkspaceFolder } from "./utils/get-root-workspace-folder";

const SupportedUnitTestFrameworkSchema = z.union([
  z.literal("unknown"),
  z.literal("jest"),
  z.literal("vitest"),
  z.literal("mocha"),
]);

export type SupportedUnitTestFramework = z.infer<
  typeof SupportedUnitTestFrameworkSchema
>;

export const getUnitTestFramework = async (
  testFrameworkData: string
): Promise<SupportedUnitTestFramework> => {
  const configuredTestFramework =
    SupportedUnitTestFrameworkSchema.safeParse(testFrameworkData);
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
