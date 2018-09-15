module.exports = {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: ['url-loader']
        }
    ],
    exprContextRegExp: /$^/,
    exprContextCritical: false
};
