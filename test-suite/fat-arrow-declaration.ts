export const fatArrowDeclaration = () => {
  return someNonExportedFunction();
};

const someNonExportedFunction = () => {
  return 666;
};
