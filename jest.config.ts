export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
};
