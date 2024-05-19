import { SupportedIntegrationTestFramework } from "./get-integration-test-framework";
import { SupportedUnitTestFramework } from "./get-unit-test-framework";
import { FunctionNameDefinition } from "./utils/get-function-or-class-name";
import { getSupportImports } from "./utils/get-support-imports";

const getAdditionalImports = (
  unitTestFramework: SupportedUnitTestFramework,
  integrationTestFramework: SupportedIntegrationTestFramework,
  name: string,
  fileName: string,
  useCommonJS: boolean
) => {
  const baseImport = getSupportImports(
    name,
    fileName,
    unitTestFramework,
    useCommonJS
  );

  switch (integrationTestFramework) {
    case "@testing-library/react":
      return `${baseImport}\nimport { render, screen } from "@testing-library/react";\n
import "@testing-library/jest-dom";
      `;
    case "enzyme":
      return `${baseImport}\nimport { shallow } from "enzyme";\nimport { describe, expect } from 'chai';\n
      `;
    default:
      return baseImport;
  }
};

export const getDefaultIntegrationTestFileContent = (
  integrationTestFramework: SupportedIntegrationTestFramework,
  unitTestFramework: SupportedUnitTestFramework,
  functionName: FunctionNameDefinition,
  fileName: string,
  useCommonJS: boolean,
  addImports: boolean
) => {
  const { name } = functionName;

  const imports = addImports
    ? getAdditionalImports(
        unitTestFramework,
        integrationTestFramework,
        name,
        fileName,
        useCommonJS
      )
    : "";

  switch (integrationTestFramework) {
    case "@testing-library/react":
      return `${imports}

describe("should render", async () => {
  it("should render", () => {
    render(<${name} />);
    screen.debug();
  });
});
      `;
    case "enzyme":
      return `${imports}

describe("${name}", () => {
  it("should render", () => {
    const wrapper = shallow(<${name} />);
    expect(wrapper.exists()).to.be.true;
  });
});
      `;
    default:
      return imports;
  }
};
