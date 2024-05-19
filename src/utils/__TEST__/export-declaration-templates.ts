import { DeclarationTemplate } from "./types";

export const noExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `const makeStatement = () => null`,
  hasNoExport: true,
};
export const fatArrowExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `export const makeStatement = () => null`,
};
export const functionExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `export function makeStatement() {}`,
};
export const classExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: true,
  code: `export class makeStatement {}`,
};
export const defaultExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `const makeStatement = () => null; export default makeStatement`,
};
export const namedExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `const makeStatement = () => null; export { makeStatement }`,
};
export const fatArrowExportWithParameters: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `export const makeStatement = (a: number, b: string) => null`,
};
export const functionExportWithParameters: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `export function makeStatement(a: number, b: string) {}`,
};
export const classExportWithParameters: DeclarationTemplate = {
  name: "makeStatement",
  isClass: true,
  code: `export class makeStatement { constructor(a: number, b: string) {} }`,
};
export const namedExportWithAlias: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `const makeStatement = () => null; export { makeStatement as myStatement }`,
};
export const namedExportWithMultipleAliases: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  hasMultipleExports: true,
  code: `const makeStatement = () => null; export { makeStatement as myStatement, makeStatement as yourStatement }`,
};
export const namedExportWithAliasAndDefault: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  hasMultipleExports: true,
  code: `const makeStatement = () => null; export { makeStatement as myStatement, makeStatement as default }`,
};
export const namedExportWithMultipleAliasesAndDefault: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  hasMultipleExports: true,
  code: `const makeStatement = () => null; export { makeStatement as myStatement, makeStatement as yourStatement, makeStatement as default }`,
};
export const mixedExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  hasMultipleExports: true,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement }`,
};
export const mixedExportWithAlias: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  hasMultipleExports: true,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement }`,
};
export const mixedExportWithMultipleAliases: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  hasMultipleExports: true,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement, makeStatement as yourStatement }`,
};
export const mixedExportWithAliasAndDefault: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  hasMultipleExports: true,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement, makeStatement as default }`,
};
export const mixedExportWithMultipleAliasesAndDefault: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  hasMultipleExports: true,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement, makeStatement as yourStatement, makeStatement as default }`,
};
export const mixedExportWithMultipleAliasesAndDefaultAndNamed: DeclarationTemplate =
  {
    name: "makeStatement",
    isClass: false,
    hasMultipleExports: true,
    code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement, makeStatement as yourStatement, makeStatement as default, makeStatement as named }`,
  };
