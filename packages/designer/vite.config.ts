import path from 'node:path'
import { defineConfig } from 'vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import { createHtmlPlugin } from 'vite-plugin-html'
import { name as simulatorName, version as simulatorVersion } from '../simulator/package.json'
import { name as rendererName, version as rendererVersion } from '../renderer/package.json'
import {
  name as assetsName,
  version as assetsVersion,
} from '../materials/antd/package.json'

const { LC_CDN = 'https://unpkg.com' } = process.env

const getAssetsUrl = (command) =>
  `${
    command === 'build' ? LC_CDN : 'http://127.0.0.1:5555'
  }/lowcode/materials/${assetsName}@${assetsVersion}/assets.json`

const simulatorPath = `${simulatorName}@${simulatorVersion}/simulator.js`
const rendererPath = `${rendererName}@${rendererVersion}/renderer.js`

export default defineConfig(({ command }) => ({
  define: {
    __SIMULATOR_URL__: JSON.stringify(
      command === 'build'
        ? `${LC_CDN}/${simulatorPath}`
        : '/src/simulator.tsx',
    ),
    __RENDERER_URL__: JSON.stringify(
      command === 'build' ? `${LC_CDN}/${rendererPath}` : '/src/renderer.tsx',
    ),
    __ASSETS_URL__: JSON.stringify(getAssetsUrl(command)),
  },
  base: command === 'build' ? LC_CDN : '',
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@lowcode/types', replacement: '@inventorjs/lc-types' },
      { find: '@lowcode/designer', replacement: '@inventorjs/lc-designer' },
      { find: '@lowcode/engine', replacement: '@inventorjs/lc-engine' },
      { find: '@lowcode/renderer', replacement: '@inventorjs/lc-renderer' },
      { find: '@lowcode/simulator', replacement: '@inventorjs/lc-simulator' },
    ],
  },
  build: {
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        renderer: path.resolve(__dirname, 'src/renderer.tsx'),
        simulator: path.resolve(__dirname, 'src/simulator.tsx'),
      },
      output: {
        entryFileNames: ({ name }) => {
          if (name === 'simulator') {
            return simulatorPath
          }
          if (name === 'renderer') {
            return rendererPath
          }
          return 'assets/[name]-[hash].js'
        },
      },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
    },
  },
  plugins: [
    viteExternalsPlugin({
      react: 'React',
      'react-dom': 'ReactDOM',
    }),
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          entry: '/src/main.tsx',
          title: '低代码编辑器',
          filename: 'index.html',
        },
        {
          entry: '/src/renderer.tsx',
          title: '低代码渲染器',
          filename: 'renderer.html',
          template: 'index.html',
        },
        {
          entry: '/src/simulator.tsx',
          title: '低代码模拟器',
          filename: 'simulator.html',
          template: 'index.html',
        },
      ].map(({ entry, template, title, filename }) => ({
        entry,
        filename,
        template: template ?? filename,
        injectOptions: {
          data: {
            title,
            injectScript: `
                <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
                <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script> 
                `,
          },
          tags: [
            {
              injectTo: 'body-prepend',
              tag: 'div',
              attrs: {
                id: 'root',
              },
            },
          ],
        },
      })),
    }),
  ],
}))
