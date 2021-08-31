const withAntdLess = require('next-plugin-antd-less')
const antdCustom = require('./assets/antd-custom.json')

module.exports = withAntdLess({
    modifyVars: antdCustom,
    cssLoaderOptions: {},
    env: {
        API_ENV: process.env.API_ENV
    },
    webpack: (config) => {
        return config
    }
})