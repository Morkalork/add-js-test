import { getTestFramework } from "./get-test-framework";
import {
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { workspace } from "vscode";
import {
  SafeParseError,
  SafeParseReturnType,
  SafeParseSuccess,
  ZodError,
} from "zod";
import * as loggingTools from "../utils/logger";
import * as configurationDependency from "./get-configuration";
import { getPackageJson } from "./get-package-json";
import { createPackageJson } from "../utils/create-package-json";

jest.mock("./get-configuration");
jest.mock("./get-package-json");

const getConfigurationMock =
  configurationDependency.getConfiguration as jest.Mock;
const getPackageJsonMock = getPackageJson as jest.Mock;

describe("getTestFramework", () => {
  const configurationGetter = jest.fn();

  const successfulParseSuccess: SafeParseSuccess<string> = {
    success: true,
    data: "jest",
  };
  const failedParseSuccess: SafeParseError<string> = {
    success: false,
    error: new ZodError([]),
  };

  const testParser =
    jest.fn<(testData: unknown) => SafeParseReturnType<unknown, string>>();

  beforeEach(() => {
    getConfigurationMock.mockReturnValue({
      get: configurationGetter,
    });
    const loggingToolsMock = jest.spyOn(loggingTools, "logger");
    loggingToolsMock.mockReturnValue({
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return the configured value if available", async () => {
    configurationGetter.mockReturnValue("jest");

    testParser.mockReturnValueOnce(successfulParseSuccess);

    const result = await getTestFramework(
      "unit",
      testParser,
      ["vitest", "jest", "mocha"],
      "vitest"
    );
    expect(result).toBe("jest");
  });

  it("should return default value if package.json cannot be read", async () => {
    configurationGetter.mockReturnValue("");
    testParser.mockReturnValueOnce(failedParseSuccess);
    getPackageJsonMock.mockImplementation(async () => createPackageJson());

    const result = await getTestFramework(
      "unit",
      testParser,
      ["vitest", "jest", "mocha"],
      "vitestDefault"
    );
    expect(result).toBe("vitestDefault");
  });

  it("should return the framework from the package.json if it exists", async () => {
    configurationGetter.mockReturnValue("");
    testParser.mockReturnValueOnce(failedParseSuccess);
    getPackageJsonMock.mockImplementation(async () =>
      createPackageJson({ jest: "1.0.0" })
    );

    const readFileMock = jest.fn(() =>
      Promise.resolve(
        Buffer.from(
          JSON.stringify({
            dependencies: {
              jest: "1.0.0",
            },
          })
        )
      )
    );
    jest.spyOn(workspace.fs, "readFile").mockImplementation(readFileMock);

    const result = await getTestFramework(
      "unit",
      testParser,
      ["vitest", "jest", "mocha"],
      "vitestDefault"
    );
    expect(result).toBe("jest");
  });
});
