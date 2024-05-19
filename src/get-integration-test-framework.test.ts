import { describe, it, expect, beforeEach } from "@jest/globals";
import { workspace } from "vscode";
import { getIntegrationTestFramework } from "./get-integration-test-framework";

describe("getCurrentlyOpenFileInfo", () => {
  const workspaceSpy = jest.spyOn(workspace, "getConfiguration");
  const configuration = {
    get: jest.fn(),
    has: jest.fn(),
    inspect: jest.fn(),
    update: jest.fn(),
  };
  beforeEach(() => {
    workspaceSpy.mockReturnValue({
      get: () => "",
      has: () => true,
      inspect: jest.fn(),
      update: jest.fn(),
    });
  });

  it.each`
    integrationTestFramework    | expected
    ${"enzyme"}                 | ${"enzyme"}
    ${"@testing-library/react"} | ${"@testing-library/react"}
    ${"unknown"}                | ${"unknown"}
    ${""}                       | ${"unknown"}
  `(
    "should return $expected when the configuration is set to $integrationTestFramework",
    ({ integrationTestFramework, expected }) => {
      expect(
        getIntegrationTestFramework(integrationTestFramework)
      ).resolves.toBe(expected);
    }
  );
});
