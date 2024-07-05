/* eslint-disable no-param-reassign */
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')
const AliyunossWebpackPlugin = require('aliyunoss-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const UselessFile = require('useless-files-webpack-plugin')

const resolve = (dir) => path.join(__dirname, dir)

const assetsCDN = {
  css: [],
  js: [
    'https://udstatic.imeik.com/pcUploads/1652287860896_vue_2.6.14_vue.min.js',
    'https://udstatic.imeik.com/pcUploads/1652287822044_element-ui_2.15.7_index.min.js',
    'https://udstatic.imeik.com/pcUploads/1652287913437_vue-router_3.5.3_vue-router.min.js',
    'https://udstatic.imeik.com/pcUploads/1652287954845_vuex_3.6.2_vuex.min.js',
    'https://udstatic.imeik.com/pcUploads/1652287611956_axios_0.19.2_axios.min.js'
  ]
}

// webpack build externals 2
const prodExternals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'element-ui': 'ELEMENT'
}

const env = process.env.NODE_ENV
const { name } = require('./package.json')
const version = new Date().getTime()

const argv = process.argv
// 是否使用cdn 使用cdn表示代码部署到了服务器 本地开发不需要cdn
const useCDN = argv.includes('--cdn')

let publicPath = `https://udstatic.imeik.com/fe/static/${name}/${env}/${version}/dist/`
// const publicPath = '/'
if (!useCDN) {
  publicPath = '/'
}

module.exports = {
  // 基本路径
  publicPath: publicPath,
  configureWebpack: (config) => {
    return {
      plugins: [
        // new BundleAnalyzerPlugin()
      ],
      output: {
        // 把子应用打包成 umd 库格式
        library: `${name}-[name]`,
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${name}`
      },
      externals: useCDN ? prodExternals : {}
    }
  },
  // 调整内部的 webpack 配置。
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src')).set('assets', resolve('src/assets')).set('components', resolve('src/components')).set('public', resolve('public'))
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.plugin('compression').use(
      new CompressionWebpackPlugin({
        filename: (info) => {
          return `${info.path}.gz${info.query}`
        },
        algorithm: 'gzip',
        threshold: 10240,
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        minRatio: 0.8,
        deleteOriginalAssets: false
      })
    )
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')

    config.plugin('IgnorePlugin').use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))

    // config.plugin('uselessFile')
    //   .use(
    //     new UselessFile({
    //       root: path.resolve(__dirname, './src'), // 项目目录
    //       out: './fileList.json', // 输出文件列表
    //       clean: false, // 是否删除文件,
    //       exclude: /node_modules/ // 排除文件列表
    //     })
    //   )

    if (useCDN) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true, // 注释css热更新生效
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  // webpack-dev-server 相关配置
  devServer: {
    /* 自动打开浏览器 */
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 20005,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    /* 使用代理 */
    // proxy: {
    //   '/admin': {
    //     /* 目标代理服务器地址 */
    //     target: `${VUE_APP_PROXY_V1_HOST}`,
    //     /* 允许跨域 */
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: {
    //       '^/admin': '/admin'
    //     }
    //   }
    // },
    before: () => {}
  },
  // 第三方插件配置
  pluginOptions: {
    windicss: {
      preflight: false
      // see https://github.com/windicss/vite-plugin-windicss/blob/main/packages/plugin-utils/src/options.ts
    }
  }
}
