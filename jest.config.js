module.exports = async () => {
  return {
    verbose: true,
	collectCoverageFrom: ["commands/**/*.js", "!**/node_modules/**"],
	coverageReporters: ["html", "text", "text-summary", "cobertura"],
	testMatch: ["**/*.test.js"]
  };
};