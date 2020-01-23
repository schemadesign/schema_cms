import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';
import json from 'rollup-plugin-json';

export default {
  input: './components/index.js',
  moduleName: 'ReactRectanglePopupMenu',
  sourcemap: true,

  output: {
    file: './dist/index.js',
    format: 'umd',
    name: 'schemaUI',
    sourcemap: true,
  },

  targets: [
    {
      dest: './dist/index.js',
      format: 'umd',
    },
    {
      dest: 'dist/dist.module.js',
      format: 'es',
    },
  ],

  plugins: [
    json(),
    postcss({
      modules: true,
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ['@babel/plugin-proposal-export-default-from'],
      runtimeHelpers: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    resolve(),
    commonjs(),
    svgr(),
    url({
      include: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.otf'],
      limit: Infinity,
    }),
  ],

  external: ['react', 'react-dom'],

  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
