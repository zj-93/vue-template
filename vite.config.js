import {
  createVuePlugin
} from 'vite-plugin-vue2'
import path from "path"
const defaultSettings = require('./src/settings.js')

const name = defaultSettings.title || 'vue Admin Template' // page title

export default {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      "@": path.resolve(__dirname, "src")
    },
  },
  css: {
    postcss: {
      plugins: [{
        postcssPlugin: 'internal:charset-removal',
        AtRule: {
          charset: (atRule) => {
            if (atRule.name === 'charset') {
              atRule.remove();
            }
          }
        }
      }],
    },
  },
  assetsDir: './',
  open: false,
  https: false,
  server: {
    port: 8006, // 本地服务端口
    proxy: {
      '/admin': {
        target: 'http://192.168.101.194:3001',
        changeOrigin: true,
        pathRewrite: {
          '^/admin': ''
        }
      }
    }
  },
  plugins: [createVuePlugin()],
}