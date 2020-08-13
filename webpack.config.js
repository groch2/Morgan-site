const path = require('path');
module.exports = ({ mode }) => {
    const pathToIndexHtml = require.resolve("./index.html");

    return {
        mode,
        entry: [
            pathToIndexHtml
        ],
        module: {
            rules: [{
                    test: pathToIndexHtml,
                    use: [{
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]"
                            }
                        },
                        "extract-loader",
                        "html-loader",
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        "file-loader",
                        "extract-loader",
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.jpg$/,
                    use: "file-loader"
                }
            ]
        }
    };
}