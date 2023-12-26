import path from 'node:path'
import { defineConfig } from 'vite'
import createExternal from 'vite-plugin-external'
import { createHtmlPlugin } from 'vite-plugin-html'

const CDN_URL = ''
const ASSETS_URL =
  'http://127.0.0.1:5555/lowcode/@inventorjs/lc-materials-antd@0.0.1/assets.json'
const SIMULATOR_VERSION = '0.0.1'
const simulatorPath = `simulator@${SIMULATOR_VERSION}/simulator.js`
const rendererPath = `renderer@${SIMULATOR_VERSION}/renderer.js`

export default defineConfig(({ command }) => ({
  define: {
    __SIMULATOR_URL__: JSON.stringify(
      command === 'build'
        ? `${CDN_URL}/${simulatorPath}`
        : '/src/simulator.tsx',
    ),
    __RENDERER_URL__: JSON.stringify(
      command === 'build' ? `${CDN_URL}/${rendererPath}` : '/src/renderer.tsx',
    ),
    __ASSETS_URL__: JSON.stringify(ASSETS_URL),
  },
  base: command === 'build' ? CDN_URL : '',
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
    createExternal({
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
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
          title: '模拟渲染器',
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
