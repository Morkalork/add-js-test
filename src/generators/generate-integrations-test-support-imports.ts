import { SupportedIntegrationTestFramework } from "../workspace-tooling/get-integration-test-framework";

export const generateIntegrationTestSupportImports = (
  name: string,
  fileName: string,
  unitTestFramework: SupportedIntegrationTestFramework,
  useCommonJS: boolean,
  isDefault: boolean
) => {
  const componentName = isDefault ? name : `{ ${name} }`;

  const baseImport = useCommonJS
    ? `const ${componentName} = require("./${fileName}");\n`
    : `import ${componentName} from "./${fileName}";\n`;

  switch (unitTestFramework) {
    case "enzyme":
      if (useCommonJS) {
        return `${baseImport}const { shallow } = require("enzyme");\n`;
      } else {
        return `${baseImport}import { shallow } from "enzyme";\n`;
      }
    case "@testing-library/react":
      if (useCommonJS) {
        return `${baseImport}const { render, screen } = require("@testing-library/react");\nrequire("@testing-library/jest-dom");\n\n`;
      } else {
        return `${baseImport}import { render, screen } from "@testing-library/react";\nimport "@testing-library/jest-dom";\n\n`;
      }
    default:
      return "";
  }
};
