module.exports = {
	// root: true,
	// env: { browser: true, es2020: true },
	// extends: [
	// 	"eslint:recommended",
	// 	"plugin:@typescript-eslint/recommended",
	// 	"plugin:react-hooks/recommended",
	// ],
	// ignorePatterns: ["dist", ".eslintrc.cjs"],
	// parser: "@typescript-eslint/parser",
	// plugins: ["react-refresh"],
	// rules: {
	// 	"react-refresh/only-export-components": [
	// 		"warn",
	// 		{ allowConstantExport: true },
	// 	],
	// },
	// parserOptions: {
	// 	ecmascript: "latest",
	// 	sourceType: "module",
	// 	project: "./tsconfig.json",
	// },
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["plugin:react/recommended", "standard-with-typescript"],
	overrides: [],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: "./tsconfig.json",
	},
	plugins: ["react"],
	rultes: {},
};
