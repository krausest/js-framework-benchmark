import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default {
  plugins: [
    buble(),
    nodeResolve(),
    terser()
  ]
};
