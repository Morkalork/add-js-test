import { FunctionNameDefinition } from "./utils/get-function-or-class-name";
import { SupportedUnitTestFramework } from "./get-unit-test-framework";

const getImportStatement = (
  name: string,
  fileName: string,
  testFramework: SupportedUnitTestFramework,
  useCommonJS: boolean
) => {
  const baseImport = useCommonJS
    ? `const { ${name} } = require("./${fileName}");\n`
    : `import { ${name} } from "./${fileName}";\n`;
  switch (testFramework) {
    case "jest":
      if (useCommonJS) {
        return `${baseImport}const { describe, expect, it } = require("@jest/globals");`;
      } else {
        return `${baseImport}import { describe, expect, it } from "@jest/globals";`;
      }
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

export const getDefaultUnitTestFileContent = (
  testFramework: SupportedUnitTestFramework,
  functionName: FunctionNameDefinition,
  fileName: string,
  useCommonJS: boolean,
  skipImports: boolean
) => {
  const { name, isClass } = functionName;
  const functionDeclaration = isClass ? `new ${name}()` : `${name}()`;

  const addImports = !skipImports; // This is good, readable coding, but it's not necessary

  return `${
    addImports && getImportStatement(name, fileName, testFramework, useCommonJS)
  }

describe("${name}", () => {
    it("should work", () => {
        expect(${functionDeclaration}).not.toBeNull();
    });
});`;
};
