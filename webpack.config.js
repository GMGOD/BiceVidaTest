const path = require('path')
const slsw = require('serverless-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cp = require('child_process')

const contains = (target, pattern) => { var value = 0; pattern.forEach(function(word){ value = value + target.includes(word); }); return (value === 1)}

if(process.argv[4] === undefined)
  throw "Stage not defined"

if(!contains(process.argv[4],['dev','prod']))
  throw "Stage not defined"

try {

  cp.execSync(`npm run build:${process.argv[4]}`, {
    cwd: path.join(__dirname, ''),
    stdio: [0, 1, 2],
  })

} finally {
  module.exports = {
    entry: slsw.lib.entries,
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    // devtool: 'source-map',
    optimization: {
      // si se minimiza serverless-mysql no funciona, OJO
      minimize: false
    },
    output: {
      libraryTarget: 'commonjs',
      path: path.join(__dirname, 'build')
    },
    module: {
      rules: [
        {
          test: /\.js(x)?$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          test: /\.ts(x)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.mjs?$/,
          loader: 'javascript/auto',
          exclude: /node_modules/,
        }
      ],
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    target: "node",
    resolve: {
      extensions: ['*', '.mjs', '.js', '.ts', '.json', '.gql', '.graphql']
    }
  }
}

