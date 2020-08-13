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
                    use: [
                        "file-loader",
                        "extract-loader",
                        {
                            loader: "html-loader",
                            options: {
                                attributes: {
                                    list: [{
                                            tag: 'img',
                                            attribute: 'src',
                                            type: 'src',
                                        },
                                        {
                                            tag: 'link',
                                            attribute: 'href',
                                            type: 'src',
                                        }
                                    ],
                                }
                            }
                        }
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