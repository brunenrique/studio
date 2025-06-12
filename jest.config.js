/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'rules',
      testMatch: ['<rootDir>/__tests__/**/*rules.test.ts'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.rules.ts'],
      moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' }
    },
    {
      displayName: 'ui',
      testMatch: ['<rootDir>/__tests__/**/*.(test|spec).tsx', '<rootDir>/tests/**/*.(test|spec).tsx'],
      preset: "next/jest",
      testEnvironment: 'jsdom',
      transformIgnorePatterns: [
        '/node_modules/(?!(lucide-react)/)'
      ],
      moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' }
    }
  ]
};
