import { getRootWorkspaceFolder } from "./get-root-workspace-folder";
import { describe, expect, it, beforeEach } from "@jest/globals";
import * as vscode from "vscode";
import { logger } from "./logger";
import { addGetterToReadonlyProps } from "./__TEST__/add-getter-to-readonly-prop";

jest.mock("vscode", () => ({
  workspace: {
    workspaceFolders: jest.fn(),
  },
}));
jest.mock("./logger", () => ({
  logger: jest.fn().mockReturnValue({
    showErrorMessage: jest.fn(),
  }),
}));

describe("getRootWorkspaceFolder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show an error message if workspace folders is undefined", () => {
    addGetterToReadonlyProps(vscode.workspace, "workspaceFolders", {
      value: undefined,
    });
    getRootWorkspaceFolder();

    expect(logger().showErrorMessage).toHaveBeenCalledWith(
      "This extension requires an open workspace."
    );
  });

  it("should show an error message if there are more workspace folders than one", () => {
    addGetterToReadonlyProps(vscode.workspace, "workspaceFolders", {
      value: [{}, {}],
    });
    getRootWorkspaceFolder();

    expect(logger().showErrorMessage).toHaveBeenCalledWith(
      "This extension does not support multi-root workspaces."
    );
  });

  it("should return the workspace folder if only one is found", () => {
    addGetterToReadonlyProps(vscode.workspace, "workspaceFolders", {
      value: [{ verified: true }],
    });
    const results = getRootWorkspaceFolder();

    expect(results).toEqual({ verified: true });
  });
});
