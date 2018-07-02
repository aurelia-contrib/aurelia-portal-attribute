import typescript from 'rollup-plugin-typescript2';

function configRollup(isProduction) {
  return [{
    input: 'src/index.ts',
    output: {
      file: 'dist/es2015/index.js',
      format: 'es'
    },
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            target: 'es2015',
            declarationDir: 'dist/types'
          }
        },
        cacheRoot: '.rollupcache'
      })
    ]
  }].concat(!isProduction
    ? []
    : [{
      input: 'src/index.ts',
      output: [
        { file: 'dist/commonjs/index.js', format: 'cjs' },
        { file: 'dist/amd/index.js', format: 'amd', amd: { id: `aurelia-portal-attribute` } },
        { file: 'dist/native-modules/index.js', format: 'es' }
      ],
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              declaration: false,
              declarationDir: null
            }
          },
          cacheRoot: '.rollupcache',
        })
      ]
    }]
  );
}

export default configRollup(process.env.NODE_ENV === 'production');
