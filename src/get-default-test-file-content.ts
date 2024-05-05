import { FunctionNameDefinition } from "./get-function-name";
import { SupportedTestFramework } from "./get-test-framework";

export const getDefaultTestFileContent = (
  testFramework: SupportedTestFramework,
  functionName: FunctionNameDefinition,
  fileName: string
) => {
  const { name, isClass } = functionName;
  const functionDeclaration = isClass
    ? `new ${functionName.name}()`
    : `${functionName.name}()`;

  return `import { ${name} } from "./${fileName}";
import { describe, expect, it } from "${testFramework}";

describe("${name}", () => {
    it("should work", () => {
        expect(${functionDeclaration}).not.toBeNull();
    });
});`;
};
