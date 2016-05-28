module.exports = {
//    context: __dirname + "/app",
    entry: "./assets/js/main",
    output: {
        // filename: "[name]-[hash].js",
        filename: "bundle.js",
	    path: __dirname + '/assets/bundles/'
	},
	module: {
	  loaders: [
		    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.html/, loader: 'file?name=[name].[ext]' }
     	]
	}
}
