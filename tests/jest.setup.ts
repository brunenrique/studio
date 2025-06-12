import '@testing-library/jest-dom';

// Adiciona o polyfill para setImmediate para o ambiente de teste do Jest (jsdom)
// Isso é necessário para o gRPC, uma dependência do Firestore
global.setImmediate = (callback: (...args: any[]) => void, ...args: any[]): NodeJS.Immediate => {
  return setTimeout(callback, 0, ...args) as unknown as NodeJS.Immediate;
};
