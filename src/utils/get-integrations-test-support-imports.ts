import { SupportedIntegrationTestFramework } from "../get-integration-test-framework";

export const getIntegrationTestSupportImports = (
  name: string,
  fileName: string,
  unitTestFramework: SupportedIntegrationTestFramework,
  useCommonJS: boolean
) => {
  const baseImport = useCommonJS
    ? `const { ${name} } = require("./${fileName}");\n`
    : `import { ${name} } from "./${fileName}";\n`;

  switch (unitTestFramework) {
    case "enzyme":
      if (useCommonJS) {
        return `const { shallow } = require("enzyme");\n`;
      } else {
        return `import { shallow } from 'enzyme';\n`;
      }
    case "@testing-library/react":
      if (useCommonJS) {
        return `${baseImport}const { render, screen } = require("@testing-library/react");\n`;
      } else {
        return `${baseImport}import { render, screen } from "@testing-library/react";\nimport "@testing-library/jest-dom";\n\n`;
      }
    default:
      return "";
  }
};
