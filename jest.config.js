const createJestConfig = require('next/jest')({ dir: './' });

const uiConfig = {
  displayName: 'ui',
  testMatch: ['<rootDir>/tests/**/*.test.ts?(x)', '<rootDir>/__tests__/**/*.test.ts?(x)'],
  moduleNameMapper: {
    '^lucide-react$': 'lucide-react/dist/cjs/lucide-react.js'
  },
  transformIgnorePatterns: ['/node_modules/(?!(lucide-react)/)']
};

module.exports = async () => {
  const ui = await createJestConfig(uiConfig)();
  return {
    projects: [
      {
        displayName: 'rules',
        testMatch: ['<rootDir>/__tests__/**/*rules.test.ts'],
        testEnvironment: 'node',
        setupFilesAfterEnv: ['<rootDir>/jest.setup.rules.ts']
      },
      ui
    ]
  };
};
