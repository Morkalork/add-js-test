import { File } from "@babel/types";
import { parse } from "recast";

export const generateAST = (code: string): File => {
  return parse(code, {
    parser: require("recast/parsers/babel-ts"),
  }) as File;
};
