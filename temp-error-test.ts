
// This should cause a TypeScript error in strict mode
let implicitAny;
implicitAny = "this should fail";
implicitAny.nonExistentMethod();

export const badFunction = (param) => {
  return param.undefinedProperty;
};
