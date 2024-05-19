import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  TextDocument,
} from "vscode";
import { parseTextDocument } from "./parse-text-document";
import { mock, mockClear } from "jest-mock-extended";
import { addGetterToReadonlyProps } from "./__TEST__/add-getter-to-readonly-prop";

describe("parseTextDocument", () => {
  const textDocumentMock = mock<TextDocument>();

  beforeEach(() => {
    mockClear(textDocumentMock);
  });

  it("should throw an error if the document is (somehow) undefined.", () => {
    expect(() => parseTextDocument(undefined)).rejects.toThrow(
      "currently open file uri could not be determined."
    );
  });

  it("should return text, file extension and currently open file uri if a valid document is available", async () => {
    textDocumentMock.getText.mockReturnValue("1234");
    addGetterToReadonlyProps(textDocumentMock, "fileName", {
      value: "test.ts",
    });
    addGetterToReadonlyProps(textDocumentMock, "uri", {
      value: "test.ts",
    });

    const { text, fileExtension, currentlyOpenFileUri } =
      await parseTextDocument(textDocumentMock);
    expect(text).toBe("1234");
    expect(fileExtension).toBe("ts");
    expect(currentlyOpenFileUri).toBe("test.ts");
  });
});
