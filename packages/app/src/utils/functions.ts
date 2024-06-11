export const wrapToArray = <T>(val: T | T[]) =>
  Array.isArray(val) ? val : [val];
