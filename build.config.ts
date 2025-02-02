import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    { builder: 'copy', input: './src/locales', outDir: './dist/locales' },
  ],
  declaration: true,
  failOnWarn: false,
})
