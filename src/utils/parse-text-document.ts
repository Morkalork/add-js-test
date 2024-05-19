import * as vscode from "vscode";

export const parseTextDocument = async (
  doc: vscode.TextDocument | undefined
) => {
  if (!doc) {
    throw new Error("currently open file uri could not be determined.");
  }

  const text = doc.getText();
  const fileExtension = doc.fileName.split(".").pop();

  const currentlyOpenFileUri = doc.uri;

  return { text, fileExtension, currentlyOpenFileUri };
};
