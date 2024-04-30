import { SupportedTestFramework } from "./get-test-framework";

export const getDefaultTestFileContent = (
  testFramework: SupportedTestFramework,
  functionName: string,
  fileName: string
) => `import { ${functionName} } from "./${fileName}";
import { describe, expect, it } from "${testFramework}";

describe("${functionName}", () => {
    it("should work", () => {
        expect(${functionName}()).not.toBeNull();
    });
});`;
