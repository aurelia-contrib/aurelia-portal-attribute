import typescript from 'rollup-plugin-typescript2';

function configRollup(isProduction) {
  return [{
    input: 'src/index.ts',
    output: {
      file: 'dist/es2015/index.js',
      format: 'es'
    },
    external: ['aurelia-templating', 'aurelia-pal', 'aurelia-binding'],
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            target: 'es2015',
            declaration: true,
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
      external: ['aurelia-templating', 'aurelia-pal', 'aurelia-binding'],
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              target: 'es5'
            }
          },
          cacheRoot: '.rollupcache',
        })
      ]
    }]
  );
}

export default configRollup(process.env.NODE_ENV === 'production');
