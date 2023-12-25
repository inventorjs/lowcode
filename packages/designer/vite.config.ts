import path from 'node:path'
import { defineConfig } from 'vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import { createHtmlPlugin } from 'vite-plugin-html'

const CDN_URL = ''
const SIMULATOR_VERSION = '0.0.1'
const simulatorPath = `simulator@${SIMULATOR_VERSION}/simulator.js`

export default defineConfig(({ command }) => ({
  define: {
    SIMULATOR_URL: JSON.stringify(
      command === 'build'
        ? `${CDN_URL}/${simulatorPath}`
        : '/src/simulator.tsx',
    ),
    ASSETS_URL: JSON.stringify(
      'http://127.0.0.1:5555/lowcode/@inventorjs/lc-materials-antd@0.0.1/assets.json',
    ),
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
        preview: path.resolve(__dirname, 'preview.html'),
        simulator: path.resolve(__dirname, 'src/simulator.tsx'),
      },
      output: {
        entryFileNames: ({ name }) =>
          name === 'simulator' ? simulatorPath : 'assets/[name]-[hash].js',
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
          entry: '/src/preview.tsx',
          title: '低代码页面预览',
          filename: 'preview.html',
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
            injectScript:
              entry === '/src/main.tsx'
                ? `
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script> 
              `
                : '',
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
