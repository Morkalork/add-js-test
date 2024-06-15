import { PackageJson } from "./types";

export const createPackageJson = (
  dependencies: Record<string, string> = {},
  devDependencies: Record<string, string> = {}
): PackageJson => ({
  dependencies: { ...dependencies },
  devDependencies: { ...devDependencies },
});
