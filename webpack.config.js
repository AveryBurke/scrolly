import path from "path";
import { fileURLToPath } from "url";
import "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";

// const devMode = process.env.NODE_ENV !== "production";
const devMode = false;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
	entry: "./src/index.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{ test: /\.(sa|sc|c)ss$/i, use: [(devMode ? "style-loader" : MiniCssExtractPlugin.loader), "css-loader", "postcss-loader"] },
		],
	},
	resolve: {
		extensions: [".ts", ".js", ".css"],
	},
	devtool: "source-map",
	devServer: {
		hot: true,
		open: true,
		historyApiFallback: true,
		static: {
			directory: path.join(__dirname, "./"),
			serveIndex: true,
		},
		compress: true,
		port: 3000,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "simple d3 scorlly",
			template: "src/index.html",
		}),
	].concat(devMode ? [] : [new MiniCssExtractPlugin({ filename: "bundle.css" })]),
	optimization: {
		minimizer: [new CssMinimizerPlugin(), new TerserWebpackPlugin()],
	},
};

export default config;
