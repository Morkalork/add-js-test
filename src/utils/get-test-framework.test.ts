import { getTestFramework } from "./get-test-framework";
import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import * as rootWorkspaceFolderFuncs from "./get-root-workspace-folder";
import { workspace, Uri } from "vscode";
import { makeWorkspaceFolder } from "./__TEST__/make-objects";
import {
  SafeParseError,
  SafeParseReturnType,
  SafeParseSuccess,
  ZodError,
} from "zod";
import * as loggingTools from "./logger";

describe("getTestFramework", () => {
  const getRootWorkspaceFolderMock = jest.spyOn(
    rootWorkspaceFolderFuncs,
    "getRootWorkspaceFolder"
  );
  const configurationSpy = jest.spyOn(workspace, "getConfiguration");
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
  const configuration = {
    get: jest.fn(),
    has: jest.fn(),
    inspect: jest.fn(),
    update: jest.fn(),
  };
  beforeEach(() => {
    const loggingToolsMock = jest.spyOn(loggingTools, "logger");
    loggingToolsMock.mockReturnValue({
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
    });
    configurationSpy.mockReturnValue({
      get: jest.fn(),
      has: () => true,
      inspect: () => ({ key: "" }),
      update: () => Promise.resolve(),
    });
    testParser.mockReset();
    getRootWorkspaceFolderMock.mockReset();
  });

  it("should return the configured value if available", async () => {
    configuration.get.mockReturnValue("jest");
    testParser.mockReturnValueOnce(successfulParseSuccess);

    const result = await getTestFramework(
      "unit",
      testParser,
      ["vitest", "jest", "mocha"],
      "vitest"
    );
    expect(result).toBe("jest");
  });

  it("should return the default value if no root workspace folder can be found", async () => {
    configuration.get.mockReturnValue("");
    testParser.mockReturnValueOnce(failedParseSuccess);
    getRootWorkspaceFolderMock.mockReturnValue(undefined);
    const result = await getTestFramework(
      "unit",
      testParser,
      ["vitest", "jest", "mocha"],
      "vitestDefault"
    );
    expect(result).toBe("vitestDefault");
  });

  it("should return default value if package.json cannot be read", async () => {
    configuration.get.mockReturnValue("");
    testParser.mockReturnValueOnce(failedParseSuccess);
    getRootWorkspaceFolderMock.mockReturnValue(makeWorkspaceFolder());
    jest.spyOn(workspace.fs, "readFile").mockImplementation(() => {
      throw new Error();
    });

    const result = await getTestFramework(
      "unit",
      testParser,
      ["vitest", "jest", "mocha"],
      "vitestDefault"
    );
    expect(result).toBe("vitestDefault");
  });

  it("should return default value if package.json is not available", async () => {
    configuration.get.mockReturnValue("");
    testParser.mockReturnValueOnce(failedParseSuccess);
    getRootWorkspaceFolderMock.mockReturnValue(
      makeWorkspaceFolder(Uri.file("test"))
    );
    const readFileMock = jest.fn(() =>
      Promise.resolve(Buffer.from(JSON.stringify({ dependencies: {} })))
    );
    jest.spyOn(workspace.fs, "readFile").mockImplementation(readFileMock);

    const result = await getTestFramework(
      "unit",
      testParser,
      ["vitest", "jest", "mocha"],
      "vitestDefault"
    );
    expect(readFileMock).toBeCalledWith(
      expect.objectContaining({ path: "/test/package.json" })
    );
    expect(result).toBe("vitestDefault");
  });

  it("should return the framework from the package.json if it exists", async () => {
    configuration.get.mockReturnValue("");
    testParser.mockReturnValueOnce(failedParseSuccess);
    getRootWorkspaceFolderMock.mockReturnValue(
      makeWorkspaceFolder(Uri.file("test"))
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
