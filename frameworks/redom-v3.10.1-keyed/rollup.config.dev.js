import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  plugins: [
    buble(),
    nodeResolve()
  ]
};
