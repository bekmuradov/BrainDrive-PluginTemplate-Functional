const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

// TEMPLATE: Customize these values for your plugin
const PLUGIN_NAME = "PluginTemplateFunctional"; // TODO: Change this to your plugin name
const PLUGIN_MODULE_NAME = "PluginTemplateFunctionalModule"; // TODO: Change this to your module name (must match lifecycle_manager.py)
const PLUGIN_PORT = 3004; // TODO: Change this to an available port

module.exports = {
  mode: "development",
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "auto",
    clean: true,
    library: {
      type: 'var',
      name: PLUGIN_NAME
    }
  },

  // CRITICAL: Use externals instead of ModuleFederation shared config
  // This prevents bundling React and uses window.React from the host
  // This is ESSENTIAL for hooks to work correctly
  externals: {
    'react': 'React',  // Uses window.React from BrainDrive host
    // Note: Do NOT add 'react-dom': 'ReactDOM' - host doesn't expose it globally
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: PLUGIN_NAME,
      library: { type: "var", name: PLUGIN_NAME },
      filename: "remoteEntry.js",
      exposes: {
        // TEMPLATE: Must match module name from lifecycle_manager.py (not plugin name)
        [`./` + PLUGIN_MODULE_NAME]: "./src/index",
        "./SettingsExample": "./src/components/SettingsExample",
      },
      // IMPORTANT: No 'shared' config here!
      // Using externals above instead to prevent React duplication
      // This is the key difference from the class-based template
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],

  devServer: {
    port: PLUGIN_PORT,
    static: {
      directory: path.join(__dirname, "public"),
    },
    hot: true,
  },
};
