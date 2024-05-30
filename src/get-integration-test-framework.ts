import { z } from "zod";
import { getTestFramework } from "./utils/get-test-framework";

const integrationTestFrameworks = ["unknown", "enzyme", "@testing-library/react"] as const;

const SupportedIntegrationTestFrameworkSchema = z.enum(integrationTestFrameworks);

export type SupportedIntegrationTestFramework = z.infer<
  typeof SupportedIntegrationTestFrameworkSchema
>;

export const getIntegrationTestFramework = async (
): Promise<SupportedIntegrationTestFramework> => {
  return getTestFramework(
    "integration",
    SupportedIntegrationTestFrameworkSchema.safeParse,
    integrationTestFrameworks,
    "unknown"
  ) as Promise<SupportedIntegrationTestFramework>;
};
