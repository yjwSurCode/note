// [
//   {
//     preset: "ts-jest",
//     transform: { "^.+\\.ts?$": "ts-jest" },
//     moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
//   },
// ];

module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

// import type {Config} from '@jest/types';

// const config: Config.InitialOptions = {
//     preset: 'ts-jest'
// };

// export default config;
  