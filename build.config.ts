import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    { builder: 'copy', input: './src/static', outDir: './dist/static' },
  ],
  declaration: true,
  failOnWarn: false,
})
