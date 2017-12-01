module.exports = {
    babelrc: false,
    cacheDirectory: true,
    presets: [
		'babel-preset-env',
        'babel-preset-react',
        'babel-preset-react-hmre'
    ].map(require.resolve),
    plugins: [
        'babel-plugin-syntax-trailing-function-commas',
        'babel-plugin-transform-class-properties',
        'babel-plugin-transform-object-rest-spread'
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