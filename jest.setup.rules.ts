import { jest } from '@jest/globals';
jest.setTimeout(20000);

// polyfill setImmediate p/ gRPC
(global as any).setImmediate =
  (global as any).setImmediate || ((fn: any, ...args: any[]) => setTimeout(fn, 0, ...args));
