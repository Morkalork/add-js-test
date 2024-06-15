import { describe, expect, it } from "@jest/globals";
import { generateIntegrationTestSupportImports } from "./generate-integrations-test-support-imports";
import { TestCaseProps } from "../utils/types";
import { SupportedIntegrationTestFramework } from "../get-integration-test-framework";

describe("generateIntegrationTestSupportImports", () => {
  it.each<TestCaseProps<SupportedIntegrationTestFramework>>`
    name      | fileName      | testFramework               | useCommonJS | isDefault | expected1                                 | expected2
    ${"name"} | ${"fileName"} | ${"@testing-library/react"} | ${false}    | ${false}  | ${'import { name } from "./fileName";'}   | ${'from "@testing-library/react";'}
    ${"name"} | ${"fileName"} | ${"@testing-library/react"} | ${true}     | ${false}  | ${'const { name } = require("./fileName'} | ${'require("@testing-library/react");'}
    ${"name"} | ${"fileName"} | ${"@testing-library/react"} | ${false}    | ${true}   | ${'import name from "./fileName";'}       | ${'from "@testing-library/react";'}
    ${"name"} | ${"fileName"} | ${"@testing-library/react"} | ${true}     | ${true}   | ${'const name = require("./fileName'}     | ${'require("@testing-library/react");'}
    ${"name"} | ${"fileName"} | ${"enzyme"}                 | ${false}    | ${true}   | ${'import name from "./fileName";'}       | ${'from "enzyme";'}
    ${"name"} | ${"fileName"} | ${"enzyme"}                 | ${true}     | ${true}   | ${'const name = require("./fileName'}     | ${'require("enzyme");'}
  `(
    "should return the correct value for the given input",
    ({
      name,
      fileName,
      testFramework,
      useCommonJS,
      isDefault,
      expected1,
      expected2,
    }) => {
      const result = generateIntegrationTestSupportImports(
        name,
        fileName,
        testFramework,
        useCommonJS,
        isDefault
      );

      expect(result).toContain(expected1);
      expect(result).toContain(expected2);
    }
  );
});
