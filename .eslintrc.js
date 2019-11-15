module.exports = {
	extends: [
		"vbase",
	],
	settings: {
		//"import/extensions": [".js", ".jsx", ".ts", ".tsx"],
		"import/resolver": {
			"node": {
				"paths": ["Source"],
				"extensions": [
				  ".js",
				  ".jsx",
				  ".ts",
				  ".tsx",
				]
			 }
		},
	},
	globals: {
		"__DEBUG_CONNECTION__": false,
		"__DEV__": false,
		"chrome": false,
		"window": false,
		"document": false,
		"self": false,
		"describe": false,
		"beforeEach": false,
		"before": false,
		"after": false,
		"it": false,
		"expect": false
	 }
};