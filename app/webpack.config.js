const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    worker: './src/worker.js',
    register: './src/register.js',
    notRegistered: './src/notRegistered.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "./src/index.html", to: "index.html" },
      { from: "./src/worker.html", to: "worker.html" },
      { from: "./src/register.html", to: "register.html" },
      { from: "./src/notRegistered.html", to: "notRegistered.html" },
  ]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
