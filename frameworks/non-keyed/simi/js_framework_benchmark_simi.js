/* tslint:disable */
import * as wasm from './js_framework_benchmark_simi_bg.js';

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

const __widl_f_error_1__target = console.error;

export function __widl_f_error_1_(arg0) {
    __widl_f_error_1__target(getObject(arg0));
}

let cachedTextDecoder = new TextDecoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

const __widl_f_add_1_DOMTokenList_target = typeof DOMTokenList === 'undefined' ? null : DOMTokenList.prototype.add || function() {
    throw new Error(`wasm-bindgen: DOMTokenList.add does not exist`);
};

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

export function __widl_f_add_1_DOMTokenList(arg0, arg1, arg2, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {
        __widl_f_add_1_DOMTokenList_target.call(getObject(arg0), varg1);
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_remove_1_DOMTokenList_target = typeof DOMTokenList === 'undefined' ? null : DOMTokenList.prototype.remove || function() {
    throw new Error(`wasm-bindgen: DOMTokenList.remove does not exist`);
};

export function __widl_f_remove_1_DOMTokenList(arg0, arg1, arg2, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {
        __widl_f_remove_1_DOMTokenList_target.call(getObject(arg0), varg1);
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_create_element_Document_target = typeof Document === 'undefined' ? null : Document.prototype.createElement || function() {
    throw new Error(`wasm-bindgen: Document.createElement does not exist`);
};

export function __widl_f_create_element_Document(arg0, arg1, arg2, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {
        return addHeapObject(__widl_f_create_element_Document_target.call(getObject(arg0), varg1));
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_create_text_node_Document_target = typeof Document === 'undefined' ? null : Document.prototype.createTextNode || function() {
    throw new Error(`wasm-bindgen: Document.createTextNode does not exist`);
};

export function __widl_f_create_text_node_Document(arg0, arg1, arg2) {
    let varg1 = getStringFromWasm(arg1, arg2);
    return addHeapObject(__widl_f_create_text_node_Document_target.call(getObject(arg0), varg1));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const __widl_f_get_element_by_id_Document_target = typeof Document === 'undefined' ? null : Document.prototype.getElementById || function() {
    throw new Error(`wasm-bindgen: Document.getElementById does not exist`);
};

export function __widl_f_get_element_by_id_Document(arg0, arg1, arg2) {
    let varg1 = getStringFromWasm(arg1, arg2);

    const val = __widl_f_get_element_by_id_Document_target.call(getObject(arg0), varg1);
    return isLikeNone(val) ? 0 : addHeapObject(val);

}

export function __widl_instanceof_Element(idx) {
    return getObject(idx) instanceof Element ? 1 : 0;
}

const __widl_f_closest_Element_target = typeof Element === 'undefined' ? null : Element.prototype.closest || function() {
    throw new Error(`wasm-bindgen: Element.closest does not exist`);
};

export function __widl_f_closest_Element(arg0, arg1, arg2, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {

        const val = __widl_f_closest_Element_target.call(getObject(arg0), varg1);
        return isLikeNone(val) ? 0 : addHeapObject(val);

    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_matches_Element_target = typeof Element === 'undefined' ? null : Element.prototype.matches || function() {
    throw new Error(`wasm-bindgen: Element.matches does not exist`);
};

export function __widl_f_matches_Element(arg0, arg1, arg2, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {
        return __widl_f_matches_Element_target.call(getObject(arg0), varg1);
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_query_selector_Element_target = typeof Element === 'undefined' ? null : Element.prototype.querySelector || function() {
    throw new Error(`wasm-bindgen: Element.querySelector does not exist`);
};

export function __widl_f_query_selector_Element(arg0, arg1, arg2, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {

        const val = __widl_f_query_selector_Element_target.call(getObject(arg0), varg1);
        return isLikeNone(val) ? 0 : addHeapObject(val);

    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_set_attribute_Element_target = typeof Element === 'undefined' ? null : Element.prototype.setAttribute || function() {
    throw new Error(`wasm-bindgen: Element.setAttribute does not exist`);
};

export function __widl_f_set_attribute_Element(arg0, arg1, arg2, arg3, arg4, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    let varg3 = getStringFromWasm(arg3, arg4);
    try {
        __widl_f_set_attribute_Element_target.call(getObject(arg0), varg1, varg3);
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

function GetOwnOrInheritedPropertyDescriptor(obj, id) {
    while (obj) {
        let desc = Object.getOwnPropertyDescriptor(obj, id);
        if (desc) return desc;
        obj = Object.getPrototypeOf(obj);
    }
return {}
}

const __widl_f_class_list_Element_target = GetOwnOrInheritedPropertyDescriptor(typeof Element === 'undefined' ? null : Element.prototype, 'classList').get || function() {
    throw new Error(`wasm-bindgen: Element.classList does not exist`);
};

export function __widl_f_class_list_Element(arg0) {
    return addHeapObject(__widl_f_class_list_Element_target.call(getObject(arg0)));
}

const __widl_f_set_inner_html_Element_target = GetOwnOrInheritedPropertyDescriptor(typeof Element === 'undefined' ? null : Element.prototype, 'innerHTML').set || function() {
    throw new Error(`wasm-bindgen: Element.innerHTML does not exist`);
};

export function __widl_f_set_inner_html_Element(arg0, arg1, arg2) {
    let varg1 = getStringFromWasm(arg1, arg2);
    __widl_f_set_inner_html_Element_target.call(getObject(arg0), varg1);
}

const __widl_f_target_Event_target = GetOwnOrInheritedPropertyDescriptor(typeof Event === 'undefined' ? null : Event.prototype, 'target').get || function() {
    throw new Error(`wasm-bindgen: Event.target does not exist`);
};

export function __widl_f_target_Event(arg0) {

    const val = __widl_f_target_Event_target.call(getObject(arg0));
    return isLikeNone(val) ? 0 : addHeapObject(val);

}

const __widl_f_add_event_listener_with_callback_EventTarget_target = typeof EventTarget === 'undefined' ? null : EventTarget.prototype.addEventListener || function() {
    throw new Error(`wasm-bindgen: EventTarget.addEventListener does not exist`);
};

export function __widl_f_add_event_listener_with_callback_EventTarget(arg0, arg1, arg2, arg3, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {
        __widl_f_add_event_listener_with_callback_EventTarget_target.call(getObject(arg0), varg1, getObject(arg3));
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_remove_event_listener_with_callback_EventTarget_target = typeof EventTarget === 'undefined' ? null : EventTarget.prototype.removeEventListener || function() {
    throw new Error(`wasm-bindgen: EventTarget.removeEventListener does not exist`);
};

export function __widl_f_remove_event_listener_with_callback_EventTarget(arg0, arg1, arg2, arg3, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {
        __widl_f_remove_event_listener_with_callback_EventTarget_target.call(getObject(arg0), varg1, getObject(arg3));
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_append_child_Node_target = typeof Node === 'undefined' ? null : Node.prototype.appendChild || function() {
    throw new Error(`wasm-bindgen: Node.appendChild does not exist`);
};

export function __widl_f_append_child_Node(arg0, arg1, exnptr) {
    try {
        return addHeapObject(__widl_f_append_child_Node_target.call(getObject(arg0), getObject(arg1)));
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_clone_node_with_deep_Node_target = typeof Node === 'undefined' ? null : Node.prototype.cloneNode || function() {
    throw new Error(`wasm-bindgen: Node.cloneNode does not exist`);
};

export function __widl_f_clone_node_with_deep_Node(arg0, arg1, exnptr) {
    try {
        return addHeapObject(__widl_f_clone_node_with_deep_Node_target.call(getObject(arg0), arg1 !== 0));
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_insert_before_Node_target = typeof Node === 'undefined' ? null : Node.prototype.insertBefore || function() {
    throw new Error(`wasm-bindgen: Node.insertBefore does not exist`);
};

export function __widl_f_insert_before_Node(arg0, arg1, arg2, exnptr) {
    try {
        return addHeapObject(__widl_f_insert_before_Node_target.call(getObject(arg0), getObject(arg1), getObject(arg2)));
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

const __widl_f_remove_child_Node_target = typeof Node === 'undefined' ? null : Node.prototype.removeChild || function() {
    throw new Error(`wasm-bindgen: Node.removeChild does not exist`);
};

export function __widl_f_remove_child_Node(arg0, arg1, exnptr) {
    try {
        return addHeapObject(__widl_f_remove_child_Node_target.call(getObject(arg0), getObject(arg1)));
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

let cachedTextEncoder = new TextEncoder('utf-8');

let WASM_VECTOR_LEN = 0;

function passStringToWasm(arg) {

    const buf = cachedTextEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
}

const __widl_f_text_content_Node_target = GetOwnOrInheritedPropertyDescriptor(typeof Node === 'undefined' ? null : Node.prototype, 'textContent').get || function() {
    throw new Error(`wasm-bindgen: Node.textContent does not exist`);
};

export function __widl_f_text_content_Node(ret, arg0) {
    const val = __widl_f_text_content_Node_target.call(getObject(arg0));
    const retptr = isLikeNone(val) ? [0, 0] : passStringToWasm(val);
    const retlen = WASM_VECTOR_LEN;
    const mem = getUint32Memory();
    mem[ret / 4] = retptr;
    mem[ret / 4 + 1] = retlen;

}

const __widl_f_set_text_content_Node_target = GetOwnOrInheritedPropertyDescriptor(typeof Node === 'undefined' ? null : Node.prototype, 'textContent').set || function() {
    throw new Error(`wasm-bindgen: Node.textContent does not exist`);
};

export function __widl_f_set_text_content_Node(arg0, arg1, arg2) {
    let varg1 = arg1 == 0 ? undefined : getStringFromWasm(arg1, arg2);
    __widl_f_set_text_content_Node_target.call(getObject(arg0), varg1);
}

export function __widl_instanceof_Window(idx) {
    return getObject(idx) instanceof Window ? 1 : 0;
}

export function __widl_f_document_Window(arg0) {

    const val = getObject(arg0).document;
    return isLikeNone(val) ? 0 : addHeapObject(val);

}

export function __wbg_newnoargs_6a80f84471205fc8(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    return addHeapObject(new Function(varg0));
}

export function __wbg_call_582b20dfcad7fee4(arg0, arg1, exnptr) {
    try {
        return addHeapObject(getObject(arg0).call(getObject(arg1)));
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
}

export function __wbg_new_baf10398b0d0c64d(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    return addHeapObject(new Function(varg0));
}

export function __wbg_call_173f04c850a68d5f(arg0, arg1) {
    return addHeapObject(getObject(arg0).call(getObject(arg1)));
}

export function __wbg_self_58232ab37cbe6608(arg0) {
    return addHeapObject(getObject(arg0).self);
}

export function __wbg_crypto_329b714d7e7d321d(arg0) {
    return addHeapObject(getObject(arg0).crypto);
}

export function __wbg_getRandomValues_2f960218fce3a102(arg0) {
    return addHeapObject(getObject(arg0).getRandomValues);
}

function getArrayU8FromWasm(ptr, len) {
    return getUint8Memory().subarray(ptr / 1, ptr / 1 + len);
}

export function __wbg_getRandomValues_5581e85fc6616df6(arg0, arg1, arg2) {
    let varg1 = getArrayU8FromWasm(arg1, arg2);
    getObject(arg0).getRandomValues(varg1);
}

export function __wbg_require_4a70cbfd3adc73a8(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    return addHeapObject(require(varg0));
}

export function __wbg_randomFillSync_355c3fcfa754fa4e(arg0, arg1, arg2) {
    let varg1 = getArrayU8FromWasm(arg1, arg2);
    getObject(arg0).randomFillSync(varg1);
}

function freeAppHandle(ptr) {

    wasm.__wbg_apphandle_free(ptr);
}
/**
*/
export class AppHandle {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeAppHandle(ptr);
    }

    /**
    * @returns {}
    */
    constructor() {
        this.ptr = wasm.apphandle_new();
    }
}

export function __wbindgen_object_clone_ref(idx) {
    return addHeapObject(getObject(idx));
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

export function __wbindgen_object_drop_ref(i) { dropObject(i); }

export function __wbindgen_string_new(p, l) {
    return addHeapObject(getStringFromWasm(p, l));
}

export function __wbindgen_number_get(n, invalid) {
    let obj = getObject(n);
    if (typeof(obj) === 'number') return obj;
    getUint8Memory()[invalid] = 1;
    return 0;
}

export function __wbindgen_is_null(idx) {
    return getObject(idx) === null ? 1 : 0;
}

export function __wbindgen_is_undefined(idx) {
    return getObject(idx) === undefined ? 1 : 0;
}

export function __wbindgen_boolean_get(i) {
    let v = getObject(i);
    if (typeof(v) === 'boolean') {
        return v ? 1 : 0;
    } else {
        return 2;
    }
}

export function __wbindgen_is_symbol(i) {
    return typeof(getObject(i)) === 'symbol' ? 1 : 0;
}

export function __wbindgen_string_get(i, len_ptr) {
    let obj = getObject(i);
    if (typeof(obj) !== 'string') return 0;
    const ptr = passStringToWasm(obj);
    getUint32Memory()[len_ptr / 4] = WASM_VECTOR_LEN;
    return ptr;
}

export function __wbindgen_cb_drop(i) {
    const obj = getObject(i).original;
    dropObject(i);
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return 1;
    }
    return 0;
}

export function __wbindgen_jsval_eq(a, b) {
    return getObject(a) === getObject(b) ? 1 : 0;
}

export function __wbindgen_closure_wrapper402(a, b, _ignored) {
    const f = wasm.__wbg_function_table.get(34);
    const d = wasm.__wbg_function_table.get(35);
    const cb = function(arg0) {
        this.cnt++;
        try {
            return f(this.a, b, addHeapObject(arg0));

        } finally {
            if (this.cnt-- == 1) d(this.a, b);

        }

    };
    cb.a = a;
    cb.cnt = 1;
    let real = cb.bind(cb);
    real.original = cb;
    return addHeapObject(real);
}

export function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

