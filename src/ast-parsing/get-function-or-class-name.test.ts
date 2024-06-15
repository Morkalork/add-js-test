import { describe, expect, it } from "@jest/globals";
import { getFunctionOrClassName } from "./get-function-or-class-name";
import * as testCases from "../utils/__TEST__/export-declaration-templates";

describe("getFunctionOrClassName", () => {
  type CodeTestProps = {
    name: string;
    isClass: boolean;
    code: string;
  };

  it.each<CodeTestProps>`
    name           | isClass  | code
    ${"test"}      | ${false} | ${"export const test = () => {};"}
    ${"test"}      | ${false} | ${"export function test() {};"}
    ${"test"}      | ${false} | ${"export const test = function() {};"}
    ${"test"}      | ${false} | ${"export const test = function test() {};"}
    ${"test"}      | ${false} | ${"export const test = () => {};"}
    ${"test"}      | ${false} | ${"export const test = class {};"}
    ${"TestClass"} | ${false} | ${"export const TestClass = class {}; // This is a class expression, not a class declaration"}
    ${"TestClass"} | ${true}  | ${"export class TestClass {};"}
  `(
    "should return name $name and isClass $isClass for $code",
    ({ name, isClass, code }) => {
      const result = getFunctionOrClassName(code);
      expect(result.name).toBe(name);
      expect(result.isClass).toBe(isClass);
    }
  );

  it("should handle all described cases", () => {
    Object.entries(testCases).forEach(
      ([key, { name, isClass, hasMultipleExports, hasNoExport, code }]) => {
        if (hasMultipleExports || hasNoExport) {
          expect(() => getFunctionOrClassName(code)).toThrowError();
        } else {
          const result = getFunctionOrClassName(code);
          expect(result.name).toBe(name);
          expect(result.isClass).toBe(isClass);
        }
      }
    );
  });
});
