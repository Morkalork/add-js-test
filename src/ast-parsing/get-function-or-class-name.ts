import {
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ExportSpecifier,
  FunctionDeclaration,
  Identifier,
  VariableDeclaration,
} from "@babel/types";
import { generateAST } from "./generate-ast";
import { getTypeSafeNode } from "../utils/get-type-safe-node";

export type FunctionNameDefinition = {
  name: string;
  isClass?: boolean;
  isDefault?: boolean;
};

export const getFunctionOrClassName = (
  code: string
): FunctionNameDefinition => {
  const ast = generateAST(code);

  const exportStatements = ast.program.body.filter(
    (bodyPart: { type: string }) =>
      bodyPart.type === "ExportNamedDeclaration" ||
      bodyPart.type === "ExportDefaultDeclaration"
  );

  const tooFewExports = exportStatements.length < 1;
  const tooManyExports = exportStatements.length > 1;
  if (tooFewExports) {
    throw new Error(
      "Nothing exported was found, please locate a file with an export to use this extension."
    );
  }
  if (tooFewExports || tooManyExports) {
    throw new Error(
      "This extension only works with one exported function. Please remove any other function exports."
    );
  }

  const acceptableExportedTypes = [
    "ExportNamedDeclaration",
    "ExportDefaultDeclaration",
  ];
  if (!acceptableExportedTypes.includes(exportStatements[0].type)) {
    // TODO: is this me being anal retentive? Can this never happen?
    throw new Error(
      "This extension only works with named or default exports. Please add a named or default export to the function or class."
    );
  }

  const exportedFunction = getTypeSafeNode<
    ExportNamedDeclaration | ExportDefaultDeclaration
  >(
    exportStatements[0],
    exportStatements[0].type === "ExportNamedDeclaration"
      ? "ExportNamedDeclaration"
      : "ExportDefaultDeclaration"
  );

  if (exportedFunction.type === "ExportNamedDeclaration") {
    if ((exportedFunction as ExportNamedDeclaration).specifiers.length > 1) {
      throw new Error(
        "This extension only works with one exported function. Please remove any other function exports."
      );
    }
  }

  if (!exportedFunction.declaration) {
    const exportSpecifier = getTypeSafeNode<ExportNamedDeclaration>(
      exportedFunction,
      "ExportNamedDeclaration"
    );
    if (!exportSpecifier || !exportSpecifier.specifiers) {
      throw new Error(
        "The exported function must have a declaration. Please add a declaration to the exported function."
      );
    } else {
      const specifier = getTypeSafeNode<ExportSpecifier>(
        exportSpecifier.specifiers[0],
        "ExportSpecifier"
      );
      if (!specifier || !specifier.local) {
        throw new Error(
          "The exported function must have a specified declaration. Please add a declaration to the exported function."
        );
      }

      const identifier = getTypeSafeNode<Identifier>(
        specifier.local,
        "Identifier"
      );
      return {
        name: identifier.name,
        isClass: false,
      };
    }
  }

  const result: FunctionNameDefinition = {
    name: "",
    isClass: false,
  };

  let identifier: Identifier | null = null;
  const declaration = exportedFunction.declaration;
  if (declaration.type === "VariableDeclaration") {
    const variableDeclaration = getTypeSafeNode<VariableDeclaration>(
      declaration,
      "VariableDeclaration"
    );

    const variableDeclarator = variableDeclaration.declarations;

    // A normally declared function
    const tooFewDeclarations = variableDeclarator.length < 1;
    const tooManyDeclarations = variableDeclarator.length > 1;
    if (tooFewDeclarations || tooManyDeclarations) {
      throw new Error(
        "This extension only works with one exported function. Please remove any other function exports."
      );
    }

    const exportedDeclaration = variableDeclarator[0];
    identifier = getTypeSafeNode<Identifier>(
      exportedDeclaration.id,
      "Identifier"
    );

    result.name = identifier.name;
  } else if (declaration.type === "FunctionDeclaration") {
    const functionDeclaration = getTypeSafeNode<FunctionDeclaration>(
      declaration,
      "FunctionDeclaration"
    );
    if (functionDeclaration && functionDeclaration.id) {
      identifier = getTypeSafeNode<Identifier>(
        functionDeclaration.id,
        "Identifier"
      );

      result.name = identifier.name;
    }
  } else if (declaration.type === "ArrowFunctionExpression") {
    const arrowFunction = getTypeSafeNode<FunctionDeclaration>(
      declaration,
      "ArrowFunctionExpression"
    );
    if (arrowFunction && arrowFunction.id) {
      identifier = getTypeSafeNode<Identifier>(arrowFunction.id, "Identifier");

      result.name = identifier.name;
    } else {
      result.isDefault = true;
    }
  } else if (declaration.type === "Identifier") {
    const identifierDeclaration = getTypeSafeNode<Identifier>(
      declaration,
      "Identifier"
    );
    if (identifierDeclaration && identifierDeclaration.name) {
      result.name = identifierDeclaration.name;
    }
  }

  if (declaration.type === "ClassDeclaration") {
    const classDeclaration = getTypeSafeNode<FunctionDeclaration>(
      declaration,
      "ClassDeclaration"
    );
    if (classDeclaration && classDeclaration.id) {
      identifier = getTypeSafeNode<Identifier>(
        classDeclaration.id,
        "Identifier"
      );
    }

    result.name = identifier?.name || "";
    result.isClass = true;
  }

  return result;
};
