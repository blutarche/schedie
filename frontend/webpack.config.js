module.exports = {
//    context: __dirname + "/app",
    entry: "./js/main.js",
    output: {
        filename: "bundle.js",
	    path: __dirname
	},
	module: {
	  loaders: [
		    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.html/, loader: 'file?name=[name].[ext]' }
     	]
	}
}
