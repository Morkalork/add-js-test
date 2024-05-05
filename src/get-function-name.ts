import { parse } from "recast";

export type FunctionNameDefinition = {
  name: string;
  isClass?: boolean;
};

export const getFunctionName = (code: string): FunctionNameDefinition => {
  const ast = parse(code, {
    parser: require("recast/parsers/typescript"),
  });

  const exportedFunctions = ast.program.body.filter(
    (bodyPart: { type: string }) => bodyPart.type === "ExportNamedDeclaration"
  );

  const tooFewExports = exportedFunctions.length < 1;
  const tooManyExports = exportedFunctions.length > 1;
  if (tooFewExports || tooManyExports) {
    throw new Error(
      "This plugin only works with one exported function. Please remove any other function exports."
    );
  }

  const exportedFunction = exportedFunctions[0];
  const declarations = exportedFunction.declaration.declarations;
  const type = exportedFunction.declaration.type;
  const id = exportedFunction.declaration.id;

  if (type === "VariableDeclaration" || type === "FunctionDeclaration") {
    if (declarations) {
      // A normally declared function
      const tooFewDeclarations = declarations.length < 1;
      const tooManyDeclarations = declarations.length > 1;
      if (tooFewDeclarations || tooManyDeclarations) {
        throw new Error(
          "This plugin only works with one exported function. Please remove any other function exports."
        );
      }

      return {
        name: declarations[0].id.name,
      };
    }

    return {
      name: id.name,
    };
  }

  if (exportedFunction.declaration.type === "ClassDeclaration") {
    const className = exportedFunction.declaration.id.name;
    return {
      name: className,
      isClass: true,
    };
  }

  const namedFunction = exportedFunction.declaration.id.name;
  if (namedFunction) {
    return namedFunction;
  }

  return {
    name: "unknown",
  };
};
