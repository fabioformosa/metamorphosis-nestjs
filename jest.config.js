module.exports = {
  preset: 'ts-jest',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    "interfaces",
    "jestGlobalMocks.ts",
    ".module.ts",
    "<rootDir>/src/index.ts",
    ".mock.ts"
  ],
  collectCoverage: true,
  coverageDirectory: './tests/coverage',
  testEnvironment: 'node',
  automock: true,
  unmockedModulePathPatterns: [],
  moduleDirectories: ['node_modules'],
};
