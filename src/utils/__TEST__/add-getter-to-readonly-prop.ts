export const addGetterToReadonlyProps = (
  obj: any,
  propertyName: string,
  options?: any
) => {
  Object.defineProperty(obj, propertyName, options || {
    get: () => {
      return true;
    },
  });
};
