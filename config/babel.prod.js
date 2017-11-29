module.exports = {
    babelrc: false,
    cacheDirectory: false,
    presets: [
        'babel-preset-react',
    ].map(require.resolve),
    plugins: [
        'babel-plugin-syntax-trailing-function-commas',
        'babel-plugin-transform-class-properties',
        'babel-plugin-transform-object-rest-spread',
        'babel-plugin-transform-react-constant-elements'
    ].map(require.resolve).concat([
        [require.resolve('babel-plugin-transform-runtime'), {
            helpers: false,
            polyfill: false,
            regenerator: true
        }]
    ]).concat([
        [require.resolve('babel-plugin-import'), {
            libraryName: 'antd',
            style: 'css'
        }]
    ])
}