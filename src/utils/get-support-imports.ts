import { SupportedUnitTestFramework } from "../get-unit-test-framework";

export const getSupportImports = (
  name: string,
  fileName: string,
  unitTestFramework: SupportedUnitTestFramework,
  useCommonJS: boolean
) => {
  const baseImport = useCommonJS
    ? `const { ${name} } = require("./${fileName}");\n`
    : `import { ${name} } from "./${fileName}";\n`;

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
