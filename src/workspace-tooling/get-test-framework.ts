import { TestTypes } from "../types";
import { SafeParseReturnType } from "zod";
import { getPackageJson } from "./get-package-json";
import { getConfiguration } from "./get-configuration";

export const getTestFramework = async <T>(
  typeOfTest: TestTypes,
  testTypeParser: (testData: unknown) => SafeParseReturnType<unknown, T>,
  supportedTestFrameworks: readonly T[],
  defaultValue: T
): Promise<T> => {
  const configuration = getConfiguration();
  const testFrameworkData = configuration.get<string>(typeOfTest) || "";

  const configuredTestFramework = testTypeParser(testFrameworkData);

  if (configuredTestFramework.success) {
    return configuredTestFramework.data;
  }

  const packageJson = await getPackageJson();

  for (const framework of supportedTestFrameworks) {
    if (
      packageJson.dependencies?.[framework as string] ||
      packageJson.devDependencies?.[framework as string]
    ) {
      return framework as T;
    }
  }

  return defaultValue;
};
