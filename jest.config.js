module.exports = {
  preset: 'ts-jest',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  collectCoverage: true,
  coverageDirectory: './tests/coverage',
  testEnvironment: 'node',
  automock: true,
  unmockedModulePathPatterns: [],
  moduleDirectories: ['node_modules', './'],
};
