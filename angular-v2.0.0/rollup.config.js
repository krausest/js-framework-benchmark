var rollup = require( 'rollup' );
var nodeResolve = require('rollup-plugin-node-resolve');
var commonJS = require('rollup-plugin-commonjs');
var closure = require('google-closure-compiler-js');
var argv = require('yargs').argv;

//simple closure compiler wrapper for rollup
function closureCompilerPlugin(options = {}){
  return {
    transformBundle(bundle){
      const compilation = Object.assign({}, options, {
        jsCode: options.jsCode ? options.jsCode.concat({ src: bundle }) : [{ src: bundle }]
      });
	  console.log('closure compiler optimizing...');
      const transformed = closure.compile(compilation);
	  console.log('closure compiler optimizing complete');
	  return { code: transformed.compiledCode, map: transformed.sourceMap };
    }
  }
}

var writeIIFE = fileName => bundle => bundle.write({format: 'iife', dest: fileName});

//rollup plugins
var plugins = [
	nodeResolve({ module: true }),
    commonJS(),
]

//only do closure in prod mode (slow!)
if(argv.prod){
  plugins.push(closureCompilerPlugin({ compilationLevel: 'SIMPLE' }));
}

//build the AOT package
var buildAOT = rollup.rollup({
	entry: './lib/main.aot.js',
	plugins: plugins
})
.then(writeIIFE('./dist/main.aot.js'))
.catch(err => console.log(err));

//build the JIT package
var buildJIT = rollup.rollup({
	entry: './lib/main.jit.js',
	plugins: plugins
})
.then(writeIIFE('./dist/main.jit.js'))
.catch(err => console.log(err));

//wait for all to complete
Promise.all([
	buildAOT,
	buildJIT
])
.then(() => console.log('built angular2'));
