module.exports = {
  preset: 'ts-jest',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  automock: true,
  unmockedModulePathPatterns: [],
  moduleDirectories: ['node_modules', './'],
};
