import { z } from "zod";
import { getTestFramework } from "./utils/get-test-framework";

const unitTestFrameworks = ["unknown", "jest", "mocha", "vitest"] as const;

const SupportedUnitTestFrameworkSchema = z.enum(unitTestFrameworks);

export type SupportedUnitTestFramework = z.infer<
  typeof SupportedUnitTestFrameworkSchema
>;

export const getUnitTestFramework =
  async (): Promise<SupportedUnitTestFramework> => {
    return getTestFramework(
      "unit",
      SupportedUnitTestFrameworkSchema.safeParse,
      unitTestFrameworks,
      "unknown"
    ) as Promise<SupportedUnitTestFramework>;
  };
