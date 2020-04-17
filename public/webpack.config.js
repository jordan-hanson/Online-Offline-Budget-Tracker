const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: "./server.js",
    output: {
        path: __dirname + "public/dist",
        filename: "bundle.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    },
    plugins: [
        new WebpackPwaManifest({
            name: "Newsy app",
            short_name: "Newsy",
            description: "An application that allows you to view different news articles and save your favorites.",
            background_color: "#01579b",
            theme_color: "#ffffff",
            "theme-color": "#ffffff",
            start_url: "https://localhost:3001/",
            icons: [{
                src: path.resolve("/icons/android-chrome-192x192.png"),
                sizes: [96, 128, 192, 256, 384, 512],
                destination: path.join("icons")
            }]
        })
    ]
};

module.exports = config;
