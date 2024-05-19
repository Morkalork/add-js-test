import * as vscode from "vscode";
import path from "path";

export const parseTextDocument = async (
  doc: vscode.TextDocument | undefined
) => {
  if (!doc) {
    throw new Error("currently open file uri could not be determined.");
  }

  if (doc.fileName.includes(".test.")) {
    const fileName = path.basename(doc.fileName);
    throw new Error(`The file "${fileName}" is already a test file.`);
  }

  const text = doc.getText();
  const fileExtension = doc.fileName.split(".").pop();

  const currentlyOpenFileUri = doc.uri;

  return { text, fileExtension, currentlyOpenFileUri };
};
