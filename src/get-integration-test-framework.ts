import { z } from "zod";

const SupportedIntegrationTestFrameworkSchema = z.union([
  z.literal("unknown"),
  z.literal("enzyme"),
  z.literal("@testing-library/react"),
]);

export type SupportedIntegrationTestFramework = z.infer<
  typeof SupportedIntegrationTestFrameworkSchema
>;

export const getIntegrationTestFramework = async (
  testFrameworkData: string
): Promise<SupportedIntegrationTestFramework> => {
  const configuredTestFramework =
    SupportedIntegrationTestFrameworkSchema.safeParse(testFrameworkData);

  if (configuredTestFramework.success) {
    return configuredTestFramework.data;
  }

  return "unknown";
};
