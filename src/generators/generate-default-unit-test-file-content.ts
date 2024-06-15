import { FunctionNameDefinition } from "../utils/get-function-or-class-name";
import { SupportedUnitTestFramework } from "../get-unit-test-framework";
import { generateUnitTestSupportImports } from "./generate-unit-test-support-imports";

export const generateDefaultUnitTestFileContent = (
  testFramework: SupportedUnitTestFramework,
  functionName: FunctionNameDefinition,
  fileName: string,
  useCommonJS: boolean,
  addImports: boolean
) => {
  const { name, isClass, isDefault } = functionName;
  const functionDeclaration = isClass ? `new ${name}()` : `${name}()`;
  const imports = addImports
    ? generateUnitTestSupportImports(
        name,
        fileName,
        testFramework,
        useCommonJS,
        isDefault
      ) + "\n"
    : "";

  return `${imports}describe("${name}", () => {
    it("should work", () => {
        expect(${functionDeclaration}).not.toBeNull();
    });
});`;
};
