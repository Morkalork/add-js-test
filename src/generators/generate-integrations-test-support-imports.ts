import { SupportedIntegrationTestFramework } from "../workspace-tooling/get-integration-test-framework";
import { getPackageJson } from "../workspace-tooling/get-package-json";

export const generateIntegrationTestSupportImports = async (
  name: string,
  fileName: string,
  unitTestFramework: SupportedIntegrationTestFramework,
  useCommonJS: boolean,
  isDefault: boolean
) => {
  const componentName = isDefault ? name : `{ ${name} }`;

  let baseImport = "";

  const packageJson = await getPackageJson();
  const reactVersion =
    packageJson.dependencies?.react || packageJson.devDependencies?.react;
  const unknownReactVersion = !reactVersion;
  const reactVersionLessThan17 = parseFloat(reactVersion) < 17;
  if (unknownReactVersion || reactVersionLessThan17) {
    // React 16 and below requires a React import
    baseImport += useCommonJS
      ? `const React = require("react");\n`
      : `import React from "react";\n`;
  }

  baseImport += useCommonJS
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
