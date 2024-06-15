import { getPackageJson } from "./get-package-json";
import { describe, expect, it } from "@jest/globals";
import * as configurationDependency from "./get-configuration";
import { getRootWorkspaceFolder } from "./get-root-workspace-folder";
import { Uri, workspace } from "vscode";
import { makeWorkspaceFolder } from "./__TEST__/make-objects";
import { createPackageJson } from "./create-package-json";
import * as loggingTools from "./logger";

jest.mock("./get-configuration");
jest.mock("./get-root-workspace-folder");

const getConfigurationMock =
  configurationDependency.getConfiguration as jest.Mock;
const getRootsWorkspaceFolderMock = getRootWorkspaceFolder as jest.Mock;

describe("getPackageJson", () => {
  const configurationGetter = jest.fn();
  const emptyPackageJson = createPackageJson();

  const loggingToolsMock = jest.spyOn(loggingTools, "logger");

  beforeEach(() => {
    getConfigurationMock.mockReturnValue({
      get: configurationGetter,
    });
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

  it("should return the default value if no root workspace folder can be found", async () => {
    getConfigurationMock.mockReturnValue("");
    getRootsWorkspaceFolderMock.mockReturnValue(undefined);
    const result = await getPackageJson();
    expect(result).toMatchObject(emptyPackageJson);
  });

  it("should return default value if package.json cannot be read", async () => {
    getConfigurationMock.mockReturnValue("");
    getRootsWorkspaceFolderMock.mockReturnValue(makeWorkspaceFolder());
    const result = await getPackageJson();
    expect(result).toMatchObject(emptyPackageJson);
  });

  it("should return default value if package.json is not available", async () => {
    getConfigurationMock.mockReturnValue({
      get: jest.fn(() => ""),
    });
    getRootsWorkspaceFolderMock.mockReturnValue(
      makeWorkspaceFolder(Uri.file("test"))
    );
    const readFileMock = jest.fn(() =>
      Promise.resolve(Buffer.from(JSON.stringify(createPackageJson())))
    );
    jest.spyOn(workspace.fs, "readFile").mockImplementation(readFileMock);

    const result = await getPackageJson();
    expect(readFileMock).toBeCalledWith(
      expect.objectContaining({ path: "/test/package.json" })
    );
    expect(result).toMatchObject(emptyPackageJson);
  });

  it("should return the framework from the package.json if it exists", async () => {
    getConfigurationMock.mockReturnValue({
      get: jest.fn(() => ""),
    });
    getRootsWorkspaceFolderMock.mockReturnValue(
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

    const result = await getPackageJson();
    expect(result.dependencies.jest).toBe("1.0.0");
  });
});
