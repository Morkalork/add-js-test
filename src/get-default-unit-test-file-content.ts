import { FunctionNameDefinition } from "./utils/get-function-or-class-name";
import { SupportedUnitTestFramework } from "./get-unit-test-framework";
import { getSupportImports } from "./utils/get-support-imports";

export const getDefaultUnitTestFileContent = (
  testFramework: SupportedUnitTestFramework,
  functionName: FunctionNameDefinition,
  fileName: string,
  useCommonJS: boolean,
  addImports: boolean
) => {
  const { name, isClass } = functionName;
  const functionDeclaration = isClass ? `new ${name}()` : `${name}()`;
  const imports = addImports
    ? getSupportImports(name, fileName, testFramework, useCommonJS) + "\n"
    : "";

  return `${imports}describe("${name}", () => {
    it("should work", () => {
        expect(${functionDeclaration}).not.toBeNull();
    });
});`;
};
