const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "production",

  target: "node",

  entry: "./ssr/render.jsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js",
    libraryTarget: "commonjs2",
     publicPath: '/'
  },

  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
    react: path.resolve(__dirname, "node_modules/react"),
    "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
  },
    conditionNames: ["node", "import", "require"]
  },

  externalsPresets: { node: true }, 

externals: [
   nodeExternals({
 allowlist: [
  /^react-router-dom/
]
})
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][hash][ext]"
        }
      },
      {
  test: /\.css$/,
  use: "null-loader",
}
      
    ]
  }
};
