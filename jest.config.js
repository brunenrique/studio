const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Fornece o caminho para o seu aplicativo Next.js para carregar next.config.js e .env em seu ambiente de teste
  dir: './',
});

// Adiciona qualquer configuração personalizada a ser passada para o Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  // Aumenta o tempo limite de 5s para 15s para os testes do emulador
  testTimeout: 15000,
  // Mapeia os aliases de caminho do tsconfig.json para o Jest
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Corrige o erro de sintaxe de módulos ESM como o lucide-react
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react)/',
  ],
};

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração do Next.js que é assíncrona
module.exports = createJestConfig(customJestConfig);
