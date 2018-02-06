import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
//import istanbul from 'rollup-plugin-istanbul';
import typescript from 'rollup-plugin-typescript2';
// import uglify from 'rollup-plugin-uglify';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

let plugins = [
  typescript({
    tsconfig: "./tsconfig.json"
  }),
  babel(babelrc())
];

// if (process.env.BUILD !== 'production') {
//   plugins.push(istanbul({
//     exclude: ['test/**/*', 'node_modules/**/*']
//   }));
// }

export default {
  input: 'src/index.ts',
  plugins: plugins,
  external: external,
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'kudoJS',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ]
};