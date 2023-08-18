/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  clearMocks: true,
  coverageProvider: "v8",
  // Need for mapping imported .js as .ts. Required due to moduleResolution: "NodeNext" in tsconfig.json.
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
        useESM: true,
      },
    ],
  },
};
