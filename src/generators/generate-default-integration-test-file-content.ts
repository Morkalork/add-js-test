import { SupportedIntegrationTestFramework } from "../get-integration-test-framework";
import { FunctionNameDefinition } from "../utils/get-function-or-class-name";
import { generateIntegrationTestSupportImports } from "./generate-integrations-test-support-imports";

export const generateDefaultIntegrationTestFileContent = (
  integrationTestFramework: SupportedIntegrationTestFramework,
  functionName: FunctionNameDefinition,
  fileName: string,
  useCommonJS: boolean,
  addImports: boolean
) => {
  const { name, isDefault } = functionName;

  const imports = addImports
    ? generateIntegrationTestSupportImports(
        name,
        fileName,
        integrationTestFramework,
        useCommonJS,
        !!isDefault
      )
    : "";

  switch (integrationTestFramework) {
    case "@testing-library/react":
      return `${imports}describe("should render", async () => {
  it("should render", () => {
    render(<${name} />);
    screen.debug();
  });
});
      `;
    case "enzyme":
      return `${imports}describe("${name}", () => {
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