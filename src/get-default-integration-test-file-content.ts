import { SupportedIntegrationTestFramework } from "./get-integration-test-framework";
import { FunctionNameDefinition } from "./utils/get-function-or-class-name";

export const getDefaultIntegrationTestFileContent = (
  testFramework: SupportedIntegrationTestFramework,
  functionName: FunctionNameDefinition,
  fileName: string,
  useCommonJS: boolean,
  addImports: boolean
) => {
  const { name, isClass } = functionName;
  const baseImport = useCommonJS
    ? `const { ${name} } = require("./${fileName}");\n`
    : `import { ${name} } from "./${fileName}";\n`;

  switch (testFramework) {
    case "@testing-library/react":

    case "enzyme":

    default:
      return baseImport;
  }
};
