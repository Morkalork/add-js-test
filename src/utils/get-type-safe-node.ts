import { Node } from "@babel/types";

export const getTypeSafeNode = <T extends Node>(
  node: Node,
  specificTypeName: string // TODO: if this can in anyway be inferred from T, that would be great
): T => {
  if (!node) {
    throw new Error("Node is undefined");
  }

  if (node.type !== specificTypeName) {
    throw new Error(`Expected ${specificTypeName} but got ${node.type}`);
  }

  return node as T;
};
