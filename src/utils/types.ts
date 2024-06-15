export type TestCaseProps<T> = {
  name: string;
  fileName: string;
  testFramework: T;
  useCommonJS: boolean;
  isDefault: boolean;
  expected1: string;
  expected2: string;
};

export type PackageJson = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};
