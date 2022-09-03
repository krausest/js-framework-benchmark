
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_22(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h85fe9cf0ca511781(arg0, arg1, addHeapObject(arg2));
}

/**
*/
export function start() {
    wasm.start();
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getObject(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_createTextNode_2ab1e3ebc34e2641 = function(arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = getObject(arg0).createTextNode(v0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createTextNode_7d3205af12708bed = function(arg0, arg1) {
        const ret = getObject(arg0).createTextNode(arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_insertBefore_26dfd5eb687a3438 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).insertBefore(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_parentNode_3b6e136ccacf1d02 = function(arg0) {
        const ret = getObject(arg0).parentNode;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_is_43eb2f9708e964a9 = function(arg0, arg1) {
        const ret = Object.is(getObject(arg0), getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_replaceChild_d614efce0d76d959 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).replaceChild(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_settextContent_8db6b500abb6e3ae = function(arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        getObject(arg0).textContent = v0;
    };
    imports.wbg.__wbg_appendChild_d21bac021b5bbfde = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_nextSibling_42ec4dd7469413eb = function(arg0) {
        const ret = getObject(arg0).nextSibling;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_nodeId_e5cbb6da61e776ac = function(arg0, arg1) {
        const ret = getObject(arg1).$$$nodeId;
        getInt32Memory0()[arg0 / 4 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbg_setnodeId_e99b9a96b99e5718 = function(arg0, arg1) {
        getObject(arg0).$$$nodeId = arg1 >>> 0;
    };
    imports.wbg.__wbg_removeChild_94b0c126b878241b = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).removeChild(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_createElement_28fc3740fb11defb = function() { return handleError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = getObject(arg0).createElement(v0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setAttribute_8cfc462c0dedd03b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        var v1 = getCachedStringFromWasm0(arg3, arg4);
        getObject(arg0).setAttribute(v0, v1);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_b2c53f6c8c23bac8 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        getObject(arg0).addEventListener(v0, getObject(arg3));
    }, arguments) };
    imports.wbg.__wbg_instanceof_Window_42f092928baaee84 = function(arg0) {
        const ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_document_15b2e504fb1556d6 = function(arg0) {
        const ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_querySelector_73feab41810011dc = function() { return handleError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = getObject(arg0).querySelector(v0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_createComment_f95f265ec268f7ec = function(arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = getObject(arg0).createComment(v0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_fd00a1ef86d1b2ed = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_6f6e346d8bbd61d7 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_3348936ac49df00a = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_67175caf56f55ca9 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_971e9a5abe185139 = function(arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
        const ret = new Function(v0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_33d7bcddbbfa394a = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_process_e56fd54cf6319b6c = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_versions_77e21455908dad33 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_0dd25d832e4785d5 = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_static_accessor_NODE_MODULE_26b231378c1be7dd = function() {
        const ret = module;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_0db1598d9ccecb30 = function() { return handleError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        const ret = getObject(arg0).require(v0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_crypto_b95d7173266618a9 = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_msCrypto_5a86d77a66230f81 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_66e5530e7079ea1b = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_91e2b39becca6147 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_subarray_270ff8dd5582c1ac = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_b14734aa289bc356 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_length_51f19f73d6d9eff3 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_34f5ec9f8a838ba0 = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_cda198d9dbc6d7ea = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_1a930cfcda1a8067 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_setclassName_9de5374b300f822d = function() { return handleError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        getObject(arg0).className = v0;
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper58 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 3, __wbg_adapter_22);
        return addHeapObject(ret);
    };

    return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = new Int32Array();
    cachedUint8Memory0 = new Uint8Array();

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(bytes) {
    const imports = getImports();

    initMemory(imports);

    const module = new WebAssembly.Module(bytes);
    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('js-framework-benchmark-sycamore_bg.wasm', import.meta.url);
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
