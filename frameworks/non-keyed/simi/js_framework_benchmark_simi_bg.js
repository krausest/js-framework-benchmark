import * as wasm_bindgen_simi_app from './js_framework_benchmark_simi.js';
            import * as import_b from './js_framework_benchmark_simi.js';

            
            export const booted = 
                    fetch('js_framework_benchmark_simi_bg.wasm')
                        .then(res => res.arrayBuffer())
                        .then(bytes => 
            WebAssembly.instantiate(bytes,{ './js_framework_benchmark_simi': import_b,  })
                .then(obj => {
                    const wasm = obj.instance;
                    memory = wasm.exports.memory;
__wbg_apphandle_free = wasm.exports.__wbg_apphandle_free;
apphandle_new = wasm.exports.apphandle_new;
__wbindgen_malloc = wasm.exports.__wbindgen_malloc;
__wbg_function_table = wasm.exports.__wbg_function_table;

                })
            )
                    ;
            export let memory;
export let __wbg_apphandle_free;
export let apphandle_new;
export let __wbindgen_malloc;
export let __wbg_function_table;

            
function run_simi_app() {
    window.simi_app = new wasm_bindgen_simi_app.AppHandle();
}
booted.then(run_simi_app, reason => console.log('Error loading wasm file:', reason));