const nextJest = require('next/jest')({ dir: './' });
/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'rules',
      testMatch: ['<rootDir>/__tests__/**/*rules.test.ts'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.rules.ts']
    },
    nextJest({
      displayName: 'ui',
      testMatch: [
        '<rootDir>/__tests__/**/*.test.ts?(x)',
        '<rootDir>/tests/**/*.test.ts?(x)'
      ],
      transformIgnorePatterns: ['/node_modules/(?!lucide-react)'],
      setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts']
    })
  ]
};
