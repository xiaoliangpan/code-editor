import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup'
import clear from 'rollup-plugin-clear';
import alias from '@rollup/plugin-alias';

export default defineConfig([{
  input: './src/index.ts',
  output:
    [
      {
        format: 'umd',
        name: 'bpScriptEditor',
        file: './build/bundle.umd.js',
        globals: {
          react: 'React',          // 告诉 Rollup react 对应的全局变量名
          'react-dom': 'ReactDOM'  // 如果用到 react-dom，也需要指定
        },
        exports: 'named',
      },
      {
        format: 'cjs',
        file: './build/bundle.cjs.js',
        exports: 'named',
      },
      {
        format: "es",
        file: "./build/bundle.es.js"
      },
    ],

  plugins: [
    // alias({
    //   entries: [
    //     { find: '@codemirror/state', replacement: require.resolve('@codemirror/state') },
    //   ],
    // }),
    clear({
      targets: ['build']
    }),
    typescript(),
    resolve(),
    commonjs(),
    terser(),
  ],
  external: ['react', 'react-dom']
},
{
  input: './src/index.ts',
  plugins: [dts()],
  output: {
    format: 'esm',
    file: './build/index.d.ts',
  },
}]);
