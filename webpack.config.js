const path = require('path');

module.exports = {
	mode: "production",
	entry: "./public/js/script.js",
	output: {
		path: path.resolve(__dirname, "public/js"),
		publicPath: "",
		library: "script",
		filename: 'script.min.js'
	}
};
