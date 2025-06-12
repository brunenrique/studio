// 1) aumentar timeout global p/ evitar falhas de bootstrap
jest.setTimeout(20000);

// 2) polyfill setImmediate caso rode em algum runner que não tenha
(global as any).setImmediate =
  (global as any).setImmediate || ((fn: any, ...args: any[]) => setTimeout(fn, 0, ...args));
