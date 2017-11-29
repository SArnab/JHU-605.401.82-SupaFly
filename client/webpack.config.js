const path = require("path");
const webpack = require("webpack");

module.exports = function(env) {
    let config = {
        "cache": true,
        "entry": {
            "client.min": ["babel-polyfill", path.resolve(__dirname, "src/index.tsx")]
        },
        "devtool": "source-map",
        "output": {
            "path": path.resolve(__dirname, "./"),
            "filename": "[name].js",
            "library": "ClueLessClient"
        },
        "module": {
            "rules": [
                {
                    "test": /\.tsx?$/,
                    "exclude": ["/node_modules/", path.resolve(__dirname, "node_modules")],
                    "use": [
                        {
                            "loader": "awesome-typescript-loader",
                            "options": {
                                "useBabel": true,
                                "useCache": true
                            }
                        }
                    ]
                }
            ]
        },
        "resolve": {
            "extensions": [".ts", ".tsx", ".js", ".jsx"]
        },
        "watchOptions": {
            "aggregateTimeout": 2500,
            "ignored": [ "node_modules", ".awcache" ],
            "poll": 1000
        }
    };

    return config;
}