const child_process = require('child_process');
const fs = require('fs');

console.log("Start build .....");

let flag_str = "";

var options = (function(argv){

    const arr = {};
    let count = 0;

    argv.forEach(function(val, index) {

        if(++count > 2){

            index = val.split('=');
            val = index[1];
            index = index[0].toUpperCase();

            if(val === "false") val = false;
            arr[index] = val;
        }
    });

    console.log('RELEASE: ' + (arr['RELEASE'] || 'custom'));

    return arr;

})(process.argv);

const parameter = (function(opt){

    let parameter = '';

    for(let index in opt){

        if(opt.hasOwnProperty(index)){

            parameter += ' --' + index + '=' + opt[index];
        }
    }

    return parameter;
})({

    compilation_level: "ADVANCED_OPTIMIZATIONS", //"WHITESPACE"
    use_types_for_optimization: true,
    generate_exports: true,
    export_local_property_definitions: true,
    language_in: "ECMASCRIPT6_STRICT",
    language_out: "ECMASCRIPT6_STRICT",
    process_closure_primitives: true,
    summary_detail_level: 3,
    warning_level: "VERBOSE",
    emit_use_strict: true,
    strict_mode_input: true,
    assume_function_wrapper: true,

    process_common_js_modules: true,
    module_resolution: "BROWSER",
    entry_point: "./src/main.js",
    dependency_mode: "PRUNE",
    rewrite_polyfills: false,

    isolation_mode: "IIFE"
    //formatting: "PRETTY_PRINT"
});

let src = String(fs.readFileSync("node_modules/mikado/src/config.js"));

for(let opt in options){

    src = src.replace(new RegExp('(export const ' + opt + ' = )(")?[^";]+(")?;'), "$1$2" + options[opt] + "$3;");
}

fs.writeFileSync("node_modules/mikado/src/config.js", src);

const executable = process.platform === "win32" ?  "\"node_modules/google-closure-compiler-windows/compiler.exe\"" :
                   process.platform === "darwin" ? "\"node_modules/google-closure-compiler-osx/compiler\"" :
                                                   "java -jar node_modules/google-closure-compiler-java/compiler.jar"

exec(executable + parameter + " --js='src/*.js' --js='src/template/*.js' --js='node_modules/mikado/src/*.js' --js='!node_modules/mikado/src/*bundle.js' --js_output_file='dist/main.js' && exit 0", function(){

    console.log("Build Complete.");
});

function exec(prompt, callback){

    const child = child_process.exec(prompt, function(err, stdout, stderr){

        if(err){

            console.error(err);
        }
        else{

            if(callback){

                callback();
            }
        }
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
}
