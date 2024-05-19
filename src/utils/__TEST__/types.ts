export type DeclarationTemplate = {
  name: string;
  isClass: boolean;
  code: string;
  hasMultipleExports?: boolean;
  hasNoExport?: boolean;
};
