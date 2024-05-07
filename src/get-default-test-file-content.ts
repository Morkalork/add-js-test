import { FunctionNameDefinition } from "./get-function-name";
import { SupportedTestFramework } from "./get-test-framework";

const getImportStatement = (
  name: string,
  fileName: string,
  testFramework: SupportedTestFramework,
  useCommonJS: boolean
) => {
  const baseImport = useCommonJS
    ? `const { ${name} } = require("./${fileName}");\n`
    : `import { ${name} } from "./${fileName}";\n`;
  switch (testFramework) {
    case "jest":
    case "vitest":
      if (useCommonJS) {
        return `${baseImport}const { describe, expect, it } = require("${testFramework}");`;
      } else {
        return `${baseImport}import { describe, expect, it } from "${testFramework}";`;
      }
    case "mocha":
      if (useCommonJS) {
        return `${baseImport}const { describe, it } = require("${testFramework}");
const expect = require("chai").expect;`;
      } else {
        return `${baseImport}import { describe, it } from "${testFramework}";
import { expect } from "chai";`;
      }
    default:
      if (useCommonJS) {
        return `${baseImport}const { describe, expect, it } = require("unknown");`;
      } else {
        return `${baseImport}import { describe, expect, it } from "unknown";`;
      }
  }
};

export const getDefaultTestFileContent = (
  testFramework: SupportedTestFramework,
  functionName: FunctionNameDefinition,
  fileName: string,
  useCommonJS: boolean,
  addImports: boolean
) => {
  const { name, isClass } = functionName;
  const functionDeclaration = isClass
    ? `new ${functionName.name}()`
    : `${functionName.name}()`;

  return `${
    addImports && getImportStatement(name, fileName, testFramework, useCommonJS)
  }

describe("${name}", () => {
    it("should work", () => {
        expect(${functionDeclaration}).not.toBeNull();
    });
});`;
};
