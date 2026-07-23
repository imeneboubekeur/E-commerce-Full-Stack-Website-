const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  mode: 'production',

  entry: './furniture-react/src/client/index.jsx',

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  }, 

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
    react: path.resolve(__dirname, "node_modules/react"),
    "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
  }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }, {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][hash][ext]"
        }
      },
      {
  test: /\.css$/,
  use: ["style-loader", "css-loader"],
}

    ]
  },
    plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL)
    })
  ]
};

