import packageJson from './package.json' assert { type: 'json' }

const { name, version } = packageJson

export default {
  library: 'LowcodeComponents',
  npmInfo: {
    name,
    version,
  },
  packages: [
    {
      package: 'react',
      version: '18.2.0',
      urls: ['https://unpkg.com/react@18/umd/react.development.js'],
      library: 'React',
    },
    {
      package: 'react-dom',
      version: '18.2.0',
      urls: ['https://unpkg.com/react-dom@18/umd/react-dom.development.js'],
      library: 'ReactDOM',
    },
    {
      package: 'dayjs',
      version: '1.11.10',
      urls: ['https://unpkg.com/dayjs@1.11.10/dayjs.min.js'],
      library: 'dayjs',
    },
    {
      package: 'antd',
      version: '5.12.1',
      urls: ['https://unpkg.com/antd@5.12.1/dist/antd.min.js'],
      library: 'antd',
    },
  ],
  components: [],
  sort: {
    categoryList: [
      { name: '基础组件', components: ['Button', 'Checkbox', 'Input'] },
    ],
  },
}
