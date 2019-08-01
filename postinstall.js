"use strict";

var replace = require("replace");

var basePath = process.env.npm_config_basePath;
console.log('update base path ==== ', basePath);

if (basePath) {
	replace({
		regex: /(\/ui\/ecom\/)/g,
		replacement: basePath,
		paths: ['./'],
		recursive: true,
		silent: true
	});
}