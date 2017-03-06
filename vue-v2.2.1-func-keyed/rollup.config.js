// Rollup-Plugins
import alias from 'rollup-plugin-alias';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import nodeResolve from 'rollup-plugin-node-resolve';
import progress from 'rollup-plugin-progress';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import visualizer from 'rollup-plugin-visualizer';
// import vue from 'rollup-plugin-vue';

// Rollup-Konfiguration
export default {
  dest: 'dist/bundle.min.js',
  entry: 'src/main.js',
  format: 'iife',
  moduleName: 'vueApp',
  plugins: [
    alias({
      'vue': 'node_modules/vue/dist/vue.esm.js'
    }),
    replace({
      'process.env.NODE_ENV': '"production"'
    }),
    babel({
      "babelrc": false,
      "plugins": [
        "external-helpers"
      ],
      "presets": [
        [
          "es2015",
          {
            "modules": false
          }
        ]
      ],
      sourceMaps: true
    }),
    // vue(),
    nodeResolve({
      jsnext: true,
      module: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    uglify({
      comments: false
    }),
    progress({
      clearLine: false
    }),
    filesize(),
    visualizer()
  ],
  sourceMap: true,
  treeshake: true
};
