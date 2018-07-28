import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import {uglify} from 'rollup-plugin-uglify';

export default {
  plugins: [
    buble(),
    nodeResolve(),
    uglify()
  ]
};
