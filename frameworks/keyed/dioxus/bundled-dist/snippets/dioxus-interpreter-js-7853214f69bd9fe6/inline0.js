let m,p,ls,d,t,op,i,e,z,metaflags;
            
    class ListenerMap {
        constructor(root) {
            // bubbling events can listen at the root element
            this.global = {};
            // non bubbling events listen at the element the listener was created at
            this.local = {};
            this.root = null;
            this.handler = null;
        }

        create(event_name, element, bubbles) {
            if (bubbles) {
                if (this.global[event_name] === undefined) {
                    this.global[event_name] = {};
                    this.global[event_name].active = 1;
                    this.root.addEventListener(event_name, this.handler);
                } else {
                    this.global[event_name].active++;
                }
            }
            else {
                const id = element.getAttribute("data-dioxus-id");
                if (!this.local[id]) {
                    this.local[id] = {};
                }
                element.addEventListener(event_name, this.handler);
            }
        }

        remove(element, event_name, bubbles) {
            if (bubbles) {
                this.global[event_name].active--;
                if (this.global[event_name].active === 0) {
                    this.root.removeEventListener(event_name, this.global[event_name].callback);
                    delete this.global[event_name];
                }
            }
            else {
                const id = element.getAttribute("data-dioxus-id");
                delete this.local[id][event_name];
                if (this.local[id].length === 0) {
                    delete this.local[id];
                }
                element.removeEventListener(event_name, this.handler);
            }
        }

        removeAllNonBubbling(element) {
            const id = element.getAttribute("data-dioxus-id");
            delete this.local[id];
        }
    }
    function SetAttributeInner(node, field, value, ns) {
        const name = field;
        if (ns === "style") {
            // ????? why do we need to do this
            if (node.style === undefined) {
                node.style = {};
            }
            node.style[name] = value;
        } else if (ns !== null && ns !== undefined && ns !== "") {
            node.setAttributeNS(ns, name, value);
        } else {
            switch (name) {
                case "value":
                    if (value !== node.value) {
                        node.value = value;
                    }
                    break;
                case "initial_value":
                    node.defaultValue = value;
                    break;
                case "checked":
                    node.checked = truthy(value);
                    break;
                case "selected":
                    node.selected = truthy(value);
                    break;
                case "dangerous_inner_html":
                    node.innerHTML = value;
                    break;
                default:
                    // https://github.com/facebook/react/blob/8b88ac2592c5f555f315f9440cbb665dd1e7457a/packages/react-dom/src/shared/DOMProperty.js#L352-L364
                    if (!truthy(value) && bool_attrs.hasOwnProperty(name)) {
                        node.removeAttribute(name);
                    } else {
                        node.setAttribute(name, value);
                    }
            }
        }
    }
    function LoadChild(ptr, len) {
        // iterate through each number and get that child
        node = stack[stack.length - 1];
        ptr_end = ptr + len;
        for (; ptr < ptr_end; ptr++) {
            end = m.getUint8(ptr);
            for (node = node.firstChild; end > 0; end--) {
                node = node.nextSibling;
            }
        }
        return node;
    }
    const listeners = new ListenerMap();
    let nodes = [];
    let stack = [];
    let root;
    const templates = {};
    let node, els, end, ptr_end, k;
    export function save_template(nodes, tmpl_id) {
        templates[tmpl_id] = nodes;
    }
    export function set_node(id, node) {
        nodes[id] = node;
    }
    export function get_node(id) {
        return nodes[id];
    }
    export function initilize(root, handler) {
        listeners.handler = handler;
        nodes = [root];
        stack = [root];
        listeners.root = root;
    }
    function AppendChildren(id, many){
        root = nodes[id];
        els = stack.splice(stack.length-many);
        for (k = 0; k < many; k++) {
            root.appendChild(els[k]);
        }
    }
    const bool_attrs = {
        allowfullscreen: true,
        allowpaymentrequest: true,
        async: true,
        autofocus: true,
        autoplay: true,
        checked: true,
        controls: true,
        default: true,
        defer: true,
        disabled: true,
        formnovalidate: true,
        hidden: true,
        ismap: true,
        itemscope: true,
        loop: true,
        multiple: true,
        muted: true,
        nomodule: true,
        novalidate: true,
        open: true,
        playsinline: true,
        readonly: true,
        required: true,
        reversed: true,
        selected: true,
        truespeed: true,
        webkitdirectory: true,
      };
      function truthy(val) {
        return val === "true" || val === true;
      }
    const ns_cache = [];
                    let ns_cache_tmp1, ns_cache_tmp2;
                    function get_ns_cache() {
                        ns_cache_tmp2 = u8buf[u8bufp++];
                        if(ns_cache_tmp2 & 128){
                            ns_cache_tmp1=s.substring(sp,sp+=u8buf[u8bufp++]);
                            ns_cache[ns_cache_tmp2&4294967167]=ns_cache_tmp1;
                            return ns_cache_tmp1;
                        }
                        else{
                            return ns_cache[ns_cache_tmp2&4294967167];
                        }
                    }let u32buf,u32bufp;let s = "";let lsp,sp,sl; let c = new TextDecoder();const evt = [];
                    let evt_tmp1, evt_tmp2;
                    function get_evt() {
                        evt_tmp2 = u8buf[u8bufp++];
                        if(evt_tmp2 & 128){
                            evt_tmp1=s.substring(sp,sp+=u8buf[u8bufp++]);
                            evt[evt_tmp2&4294967167]=evt_tmp1;
                            return evt_tmp1;
                        }
                        else{
                            return evt[evt_tmp2&4294967167];
                        }
                    }const attr = [];
                    let attr_tmp1, attr_tmp2;
                    function get_attr() {
                        attr_tmp2 = u8buf[u8bufp++];
                        if(attr_tmp2 & 128){
                            attr_tmp1=s.substring(sp,sp+=u8buf[u8bufp++]);
                            attr[attr_tmp2&4294967167]=attr_tmp1;
                            return attr_tmp1;
                        }
                        else{
                            return attr[attr_tmp2&4294967167];
                        }
                    }let u8buf,u8bufp;
            let id,bubbles,event_name,ptr,value,ns,field,len;
            export function create(r){
                d=r;
            }
            export function update_memory(b){
                m=new DataView(b.buffer)
            }
            export function run(){
                metaflags=m.getUint32(d,true);
                if((metaflags>>>12)&1){
                    ls=m.getUint32(d+12*4,true);
                }
                p=ls;
                if ((metaflags>>>3)&1){
                u32buf=new Uint32Array(m.buffer,m.getUint32(d+3*4,true))
            }
            u32bufp=0;if (metaflags&1){
                lsp = m.getUint32(d+1*4,true);
            }
            if ((metaflags>>>2)&1) {
                sl = m.getUint32(d+2*4,true);
                if ((metaflags>>>1)&1) {
                    sp = lsp;
                    s = "";
                    e = sp + ((sl / 4) | 0) * 4;
                    while (sp < e) {
                        t = m.getUint32(sp, true);
                        s += String.fromCharCode(
                            t & 255,
                            (t & 65280) >> 8,
                            (t & 16711680) >> 16,
                            t >> 24
                        );
                        sp += 4;
                    }
                    while (sp < lsp + sl) {
                        s += String.fromCharCode(m.getUint8(sp++));
                    }
                } else {
                    s = c.decode(new DataView(m.buffer, lsp, sl));
                }
            }
            sp=0;if ((metaflags>>>5)&1){
                u8buf=new Uint8Array(m.buffer,m.getUint32(d+5*4,true))
            }
            u8bufp=0;
                for(;;){
                    op=m.getUint32(p,true);
                    p+=4;
                    z=0;
                    while(z++<4){
                        switch(op&255){
                            case 0:{AppendChildren(root, stack.length-1);}break;case 1:{stack.push(nodes[u32buf[u32bufp++]]);}break;case 2:{AppendChildren(u32buf[u32bufp++], u32buf[u32bufp++]);}break;case 3:{stack.pop();}break;case 4:{root = nodes[u32buf[u32bufp++]]; els = stack.splice(stack.length-u32buf[u32bufp++]); if (root.listening) { listeners.removeAllNonBubbling(root); } root.replaceWith(...els);}break;case 5:{nodes[u32buf[u32bufp++]].after(...stack.splice(stack.length-u32buf[u32bufp++]));}break;case 6:{nodes[u32buf[u32bufp++]].before(...stack.splice(stack.length-u32buf[u32bufp++]));}break;case 7:{node = nodes[u32buf[u32bufp++]]; if (node !== undefined) { if (node.listening) { listeners.removeAllNonBubbling(node); } node.remove(); }}break;case 8:{stack.push(document.createTextNode(s.substring(sp,sp+=u32buf[u32bufp++])));}break;case 9:{node = document.createTextNode(s.substring(sp,sp+=u32buf[u32bufp++])); nodes[u32buf[u32bufp++]] = node; stack.push(node);}break;case 10:{node = document.createElement('pre'); node.hidden = true; stack.push(node); nodes[u32buf[u32bufp++]] = node;}break;case 11:event_name=get_evt();id=u32buf[u32bufp++];bubbles=u8buf[u8bufp++];node = nodes[id]; if(node.listening){node.listening += 1;}else{node.listening = 1;} node.setAttribute('data-dioxus-id', `${id}`); listeners.create(event_name, node, bubbles);break;case 12:{node = nodes[u32buf[u32bufp++]]; node.listening -= 1; node.removeAttribute('data-dioxus-id'); listeners.remove(node, get_evt(), u8buf[u8bufp++]);}break;case 13:{nodes[u32buf[u32bufp++]].textContent = s.substring(sp,sp+=u32buf[u32bufp++]);}break;case 14:{node = nodes[u32buf[u32bufp++]]; SetAttributeInner(node, get_attr(), s.substring(sp,sp+=u32buf[u32bufp++]), get_ns_cache());}break;case 15:id=u32buf[u32bufp++];field=get_attr();ns=get_ns_cache();{
            node = nodes[id];
            if (!ns) {
                switch (field) {
                    case "value":
                        node.value = "";
                        break;
                    case "checked":
                        node.checked = false;
                        break;
                    case "selected":
                        node.selected = false;
                        break;
                    case "dangerous_inner_html":
                        node.innerHTML = "";
                        break;
                    default:
                        node.removeAttribute(field);
                        break;
                }
            } else if (ns == "style") {
                node.style.removeProperty(name);
            } else {
                node.removeAttributeNS(ns, field);
            }
        }break;case 16:{nodes[u32buf[u32bufp++]] = LoadChild(u32buf[u32bufp++], u8buf[u8bufp++]);}break;case 17:ptr=u32buf[u32bufp++];len=u8buf[u8bufp++];value=s.substring(sp,sp+=u32buf[u32bufp++]);id=u32buf[u32bufp++];{
            node = LoadChild(ptr, len);
            if (node.nodeType == Node.TEXT_NODE) {
                node.textContent = value;
            } else {
                let text = document.createTextNode(value);
                node.replaceWith(text);
                node = text;
            }
            nodes[id] = node;
        }break;case 18:{els = stack.splice(stack.length - u32buf[u32bufp++]); node = LoadChild(u32buf[u32bufp++], u8buf[u8bufp++]); node.replaceWith(...els);}break;case 19:{node = templates[u32buf[u32bufp++]][u32buf[u32bufp++]].cloneNode(true); nodes[u32buf[u32bufp++]] = node; stack.push(node);}break;case 20:return true;
                        }
                        op>>>=8;
                    }
                }
            }