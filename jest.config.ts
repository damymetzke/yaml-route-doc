module.exports = {
  preset: "ts-jest",
  clearMocks: true,
  coverageDirectory: "coverage",
  roots: ["test"],
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.ts", "!**/node_modules/**"],
};
