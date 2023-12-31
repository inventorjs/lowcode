import path from 'node:path'
import fs from 'node:fs/promises'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { build, preview } from 'vite'
import createExternal from 'vite-plugin-external'
import buildLowcode from '../build.lowcode.js'

const { packages, npmInfo, sort } = buildLowcode
const { NODE_ENV = 'production', LC_CDN = 'https://unpkg.com' } = process.env

const LC_MATERIALS = 'AntdMaterials'
const LC_MATERIALS_META = `${LC_MATERIALS}Meta`

function ifRelease(production, development) {
  return NODE_ENV === 'production' ? production : development
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const externalPackages = packages.filter((pkg) => !!pkg.library)

const filePath = `lowcode/materials/${npmInfo.name}@${npmInfo.version}`
const previewPort = 5555
const fileHost = ifRelease(LC_CDN, `http://127.0.0.1:${previewPort}`)

const outDir = 'dist'

const imports = [
  {
    name: LC_MATERIALS,
    entry: path.resolve(__dirname, '../src/index.ts'),
    fileName: () => `${filePath}/components.js`,
    rollupOptions: {
      external: externalPackages.map((pkg) => pkg.package),
      output: {
        globals: externalPackages.reduce(
          (result, pkg) => ({
            ...result,
            [pkg.package]: pkg.library,
          }),
          {},
        ),
      },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
    },
  },
  {
    name: LC_MATERIALS_META,
    entry: path.resolve(__dirname, '../lowcode/index.ts'),
    fileName: () => `${filePath}/meta.js`,
  },
]

function buildMaterials() {
  return Promise.all(
    imports.map(async (impt) =>
      build({
        resolve: {
          alias: [
            { find: '@', replacement: path.resolve(__dirname, '../src') },
          ],
        },
        define: {
          'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        },
        build: {
          outDir: 'dist',
          watch: ifRelease(false, true),
          emptyOutDir: false,
          minify: ifRelease(true, false),
          lib: {
            formats: ['umd'],
            ...impt,
          },
          rollupOptions: impt.rollupOptions,
        },
        plugins: [
          createExternal({
            externals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              dayjs: 'dayjs',
              antd: 'antd',
            },
          }),
        ],
      }),
    ),
  )
}

async function buildAssets() {
  const assetsJson = {
    packages: [
      ...packages,
      {
        package: npmInfo.name,
        version: npmInfo.version,
        library: LC_MATERIALS,
        urls: [`${fileHost}/${filePath}/components.js`],
      },
    ],
    components: [
      {
        npm: {
          package: npmInfo.name,
          version: npmInfo.version,
        },
        exportName: LC_MATERIALS_META,
        url: `${fileHost}/${filePath}/meta.js`,
      },
    ],
    sort,
  }
  const dirPath = path.resolve(__dirname, `../${outDir}/${filePath}`)
  await fs.mkdir(dirPath, { recursive: true })
  await fs.writeFile(
    path.resolve(dirPath, 'assets.json'),
    JSON.stringify(assetsJson, null, 2),
  )
}

async function run() {
  await buildAssets()
  await buildMaterials()
  if (NODE_ENV !== 'production') {
    await setTimeout(1000)
    await preview({
      preview: {
        port: previewPort,
      },
    })
    console.log(
      `mateials preview server start at http://127.0.0.1:${previewPort}`,
    )
  }
}

run()
