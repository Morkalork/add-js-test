import { SupportedUnitTestFramework } from "../workspace-tooling/get-unit-test-framework";

export const generateUnitTestSupportImports = (
  name: string,
  fileName: string,
  unitTestFramework: SupportedUnitTestFramework,
  useCommonJS: boolean,
  isDefault?: boolean
) => {
  const functionNameDeclaration = isDefault ? name : `{ ${name} }`;
  const baseImport = useCommonJS
    ? `const ${functionNameDeclaration} = require("./${fileName}");\n`
    : `import ${functionNameDeclaration} from "./${fileName}";\n`;

  switch (unitTestFramework) {
    case "jest":
      if (useCommonJS) {
        return `${baseImport}const { describe, expect, it } = require("@jest/globals");\n`;
      } else {
        return `${baseImport}import { describe, expect, it } from "@jest/globals";\n`;
      }
    case "vitest":
      if (useCommonJS) {
        return `${baseImport}const { describe, expect, it } = require("${unitTestFramework}");\n`;
      } else {
        return `${baseImport}import { describe, expect, it } from "${unitTestFramework}";\n`;
      }
    case "mocha":
      if (useCommonJS) {
        return `${baseImport}const { describe, it } = require("${unitTestFramework}");
const expect = require("chai").expect;\n`;
      } else {
        return `${baseImport}import { describe, it } from "${unitTestFramework}";
import { expect } from "chai";\n`;
      }
    default:
      if (useCommonJS) {
        return `${baseImport}const { describe, expect, it } = require("unknown");\n`;
      } else {
        return `${baseImport}import { describe, expect, it } from "unknown";\n
        `;
      }
  }
};
