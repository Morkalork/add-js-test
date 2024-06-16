import { Node } from "@babel/types";

export const isDeclarationOf = <T extends Node>(
  node: any,
  declarationName: string
): node is T => {
  return node.type === declarationName;
};
