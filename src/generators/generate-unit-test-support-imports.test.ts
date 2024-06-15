import { describe, expect, it } from "@jest/globals";
import { TestCaseProps } from "../utils/types";
import { SupportedUnitTestFramework } from "../get-unit-test-framework";
import { generateUnitTestSupportImports } from "./generate-unit-test-support-imports";

describe("generateUnitTestSupportImports", () => {
  it.each<TestCaseProps<SupportedUnitTestFramework>>`
    name      | fileName      | testFramework | useCommonJS | isDefault | expected1                                 | expected2
    ${"name"} | ${"fileName"} | ${"jest"}     | ${false}    | ${false}  | ${'import { name } from "./fileName";'}   | ${'from "@jest/globals";'}
    ${"name"} | ${"fileName"} | ${"jest"}     | ${true}     | ${false}  | ${'const { name } = require("./fileName'} | ${'require("@jest/globals");'}
    ${"name"} | ${"fileName"} | ${"jest"}     | ${false}    | ${true}   | ${'import name from "./fileName";'}       | ${'from "@jest/globals";'}
    ${"name"} | ${"fileName"} | ${"jest"}     | ${true}     | ${true}   | ${'const name = require("./fileName'}     | ${'require("@jest/globals");'}
    ${"name"} | ${"fileName"} | ${"vitest"}   | ${false}    | ${true}   | ${'import name from "./fileName";'}       | ${'from "vitest";'}
    ${"name"} | ${"fileName"} | ${"vitest"}   | ${true}     | ${true}   | ${'const name = require("./fileName'}     | ${'require("vitest");'}
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
      const result = generateUnitTestSupportImports(
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
