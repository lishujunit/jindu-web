const path = require('path');

function resolve(dir) {
	return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: false,
    chainWebpack: (config) => {
    	config.entry.app=["babel-polyfill","./src/main.js"],
		config.resolve.alias
			.set('@', resolve('src'))
	},

    devServer:{
		port:'9090'
	},

    baseUrl: './'
}