
            function setAttributeInner(node,field,value,ns){if(ns==="style"){node.style.setProperty(field,value);return}if(ns){node.setAttributeNS(ns,field,value);return}switch(field){case"value":if(node.value!==value)node.value=value;break;case"initial_value":node.defaultValue=value;break;case"checked":node.checked=truthy(value);break;case"initial_checked":node.defaultChecked=truthy(value);break;case"selected":node.selected=truthy(value);break;case"initial_selected":node.defaultSelected=truthy(value);break;case"dangerous_inner_html":node.innerHTML=value;break;default:if(!truthy(value)&&isBoolAttr(field))node.removeAttribute(field);else node.setAttribute(field,value)}}var truthy=function(val){return val==="true"||val===!0},isBoolAttr=function(field){switch(field){case"allowfullscreen":case"allowpaymentrequest":case"async":case"autofocus":case"autoplay":case"checked":case"controls":case"default":case"defer":case"disabled":case"formnovalidate":case"hidden":case"ismap":case"itemscope":case"loop":case"multiple":case"muted":case"nomodule":case"novalidate":case"open":case"playsinline":case"readonly":case"required":case"reversed":case"selected":case"truespeed":case"webkitdirectory":return!0;default:return!1}};class BaseInterpreter{global;local;root;handler;nodes;stack;templates;m;constructor(){}initialize(root,handler=null){if(this.global={},this.local={},this.root=root,this.nodes=[root],this.stack=[root],this.templates={},handler)this.handler=handler}createListener(event_name,element,bubbles){if(bubbles)if(this.global[event_name]===void 0)this.global[event_name]={active:1,callback:this.handler},this.root.addEventListener(event_name,this.handler);else this.global[event_name].active++;else{const id=element.getAttribute("data-dioxus-id");if(!this.local[id])this.local[id]={};element.addEventListener(event_name,this.handler)}}removeListener(element,event_name,bubbles){if(bubbles)this.removeBubblingListener(event_name);else this.removeNonBubblingListener(element,event_name)}removeBubblingListener(event_name){if(this.global[event_name].active--,this.global[event_name].active===0)this.root.removeEventListener(event_name,this.global[event_name].callback),delete this.global[event_name]}removeNonBubblingListener(element,event_name){const id=element.getAttribute("data-dioxus-id");if(delete this.local[id][event_name],Object.keys(this.local[id]).length===0)delete this.local[id];element.removeEventListener(event_name,this.handler)}removeAllNonBubblingListeners(element){const id=element.getAttribute("data-dioxus-id");delete this.local[id]}getNode(id){return this.nodes[id]}appendChildren(id,many){const root=this.nodes[id],els=this.stack.splice(this.stack.length-many);for(let k=0;k<many;k++)root.appendChild(els[k])}loadChild(ptr,len){let node=this.stack[this.stack.length-1],ptr_end=ptr+len;for(;ptr<ptr_end;ptr++){let end=this.m.getUint8(ptr);for(node=node.firstChild;end>0;end--)node=node.nextSibling}return node}saveTemplate(nodes,tmpl_id){this.templates[tmpl_id]=nodes}hydrate(ids){const hydrateNodes=document.querySelectorAll("[data-node-hydration]");for(let i=0;i<hydrateNodes.length;i++){const hydrateNode=hydrateNodes[i],split=hydrateNode.getAttribute("data-node-hydration").split(","),id=ids[parseInt(split[0])];if(this.nodes[id]=hydrateNode,split.length>1){hydrateNode.listening=split.length-1,hydrateNode.setAttribute("data-dioxus-id",id.toString());for(let j=1;j<split.length;j++){const split2=split[j].split(":"),event_name=split2[0],bubbles=split2[1]==="1";this.createListener(event_name,hydrateNode,bubbles)}}}const treeWalker=document.createTreeWalker(document.body,NodeFilter.SHOW_COMMENT);let currentNode=treeWalker.nextNode();while(currentNode){const split=currentNode.textContent.split("node-id");if(split.length>1)this.nodes[ids[parseInt(split[1])]]=currentNode.nextSibling;currentNode=treeWalker.nextNode()}}setAttributeInner(node,field,value,ns){setAttributeInner(node,field,value,ns)}}export{BaseInterpreter};

            let field,id,value,ns,many,bubbles;
            export class RawInterpreter extends BaseInterpreter {
                constructor(r) {
                    super();
                    this.d=r;
                    this.m = null;
                    this.p = null;
                    this.ls = null;
                    this.t = null;
                    this.op = null;
                    this.e = null;
                    this.z = null;
                    this.metaflags = null;
                    this.u32buf=null;this.u32bufp=null;this.u16buf=null;this.u16bufp=null;this.evt = [];
                    this.evt_cache_hit = null;
                    this.evt_cache_idx;
                    this.get_evt = function() {
                        this.evt_cache_idx = this.u8buf[this.u8bufp++];
                        if(this.evt_cache_idx & 128){
                            this.evt_cache_hit=this.s.substring(this.sp,this.sp+=this.u8buf[this.u8bufp++]);
                            this.evt[this.evt_cache_idx&4294967167]=this.evt_cache_hit;
                            return this.evt_cache_hit;
                        }
                        else{
                            return this.evt[this.evt_cache_idx&4294967167];
                        }
                    };this.namespace = [];
                    this.namespace_cache_hit = null;
                    this.namespace_cache_idx;
                    this.get_namespace = function() {
                        this.namespace_cache_idx = this.u8buf[this.u8bufp++];
                        if(this.namespace_cache_idx & 128){
                            this.namespace_cache_hit=this.s.substring(this.sp,this.sp+=this.u8buf[this.u8bufp++]);
                            this.namespace[this.namespace_cache_idx&4294967167]=this.namespace_cache_hit;
                            return this.namespace_cache_hit;
                        }
                        else{
                            return this.namespace[this.namespace_cache_idx&4294967167];
                        }
                    };this.el = [];
                    this.el_cache_hit = null;
                    this.el_cache_idx;
                    this.get_el = function() {
                        this.el_cache_idx = this.u8buf[this.u8bufp++];
                        if(this.el_cache_idx & 128){
                            this.el_cache_hit=this.s.substring(this.sp,this.sp+=this.u8buf[this.u8bufp++]);
                            this.el[this.el_cache_idx&4294967167]=this.el_cache_hit;
                            return this.el_cache_hit;
                        }
                        else{
                            return this.el[this.el_cache_idx&4294967167];
                        }
                    };this.attr = [];
                    this.attr_cache_hit = null;
                    this.attr_cache_idx;
                    this.get_attr = function() {
                        this.attr_cache_idx = this.u8buf[this.u8bufp++];
                        if(this.attr_cache_idx & 128){
                            this.attr_cache_hit=this.s.substring(this.sp,this.sp+=this.u8buf[this.u8bufp++]);
                            this.attr[this.attr_cache_idx&4294967167]=this.attr_cache_hit;
                            return this.attr_cache_hit;
                        }
                        else{
                            return this.attr[this.attr_cache_idx&4294967167];
                        }
                    };this.ns_cache = [];
                    this.ns_cache_cache_hit = null;
                    this.ns_cache_cache_idx;
                    this.get_ns_cache = function() {
                        this.ns_cache_cache_idx = this.u8buf[this.u8bufp++];
                        if(this.ns_cache_cache_idx & 128){
                            this.ns_cache_cache_hit=this.s.substring(this.sp,this.sp+=this.u8buf[this.u8bufp++]);
                            this.ns_cache[this.ns_cache_cache_idx&4294967167]=this.ns_cache_cache_hit;
                            return this.ns_cache_cache_hit;
                        }
                        else{
                            return this.ns_cache[this.ns_cache_cache_idx&4294967167];
                        }
                    };this.u8buf=null;this.u8bufp=null;this.s = "";this.lsp = null;this.sp = null;this.sl = null;this.c = new TextDecoder();
                }

                update_memory(b){
                    this.m=new DataView(b.buffer)
                }

                run(){
                    this.metaflags=this.m.getUint32(this.d,true);
                    if((this.metaflags>>>6)&1){
                        this.ls=this.m.getUint32(this.d+6*4,true);
                    }
                    this.p=this.ls;
                    if ((this.metaflags>>>3)&1){
                this.t = this.m.getUint32(this.d+3*4,true);
                this.u32buf=new Uint32Array(this.m.buffer,this.t,((this.m.buffer.byteLength-this.t)-(this.m.buffer.byteLength-this.t)%4)/4);
            }
            this.u32bufp=0;if ((this.metaflags>>>4)&1){
                this.t = this.m.getUint32(this.d+4*4,true);
                this.u16buf=new Uint16Array(this.m.buffer,this.t,((this.m.buffer.byteLength-this.t)-(this.m.buffer.byteLength-this.t)%2)/2);
            }
            this.u16bufp=0;if ((this.metaflags>>>5)&1){
                this.t = this.m.getUint32(this.d+5*4,true);
                this.u8buf=new Uint8Array(this.m.buffer,this.t,((this.m.buffer.byteLength-this.t)-(this.m.buffer.byteLength-this.t)%1)/1);
            }
            this.u8bufp=0;if (this.metaflags&1){
                this.lsp = this.m.getUint32(this.d+1*4,true);
            }
            if ((this.metaflags>>>2)&1) {
                this.sl = this.m.getUint32(this.d+2*4,true);
                if ((this.metaflags>>>1)&1) {
                    this.sp = this.lsp;
                    this.s = "";
                    this.e = this.sp + ((this.sl / 4) | 0) * 4;
                    while (this.sp < this.e) {
                        this.t = this.m.getUint32(this.sp, true);
                        this.s += String.fromCharCode(
                            this.t & 255,
                            (this.t & 65280) >> 8,
                            (this.t & 16711680) >> 16,
                            this.t >> 24
                        );
                        this.sp += 4;
                    }
                    while (this.sp < this.lsp + this.sl) {
                        this.s += String.fromCharCode(this.m.getUint8(this.sp++));
                    }
                } else {
                    this.s = this.c.decode(new DataView(this.m.buffer, this.lsp, this.sl));
                }
            }
            this.sp=0;
                    for(;;){
                        this.op=this.m.getUint32(this.p,true);
                        this.p+=4;
                        this.z=0;
                        while(this.z++<4){
                            switch(this.op&255){
                                case 0:{this.appendChildren(this.root, this.stack.length-1);}break;case 1:{this.stack.push(this.nodes[this.u32buf[this.u32bufp++]]);}break;case 2:{this.appendChildren(this.u32buf[this.u32bufp++], this.u16buf[this.u16bufp++]);}break;case 3:{this.stack.pop();}break;case 4:{const root = this.nodes[this.u32buf[this.u32bufp++]]; let els = this.stack.splice(this.stack.length-this.u16buf[this.u16bufp++]); if (root.listening) { this.removeAllNonBubblingListeners(root); } root.replaceWith(...els);}break;case 5:{this.nodes[this.u32buf[this.u32bufp++]].after(...this.stack.splice(this.stack.length-this.u16buf[this.u16bufp++]));}break;case 6:{this.nodes[this.u32buf[this.u32bufp++]].before(...this.stack.splice(this.stack.length-this.u16buf[this.u16bufp++]));}break;case 7:{let node = this.nodes[this.u32buf[this.u32bufp++]]; if (node !== undefined) { if (node.listening) { this.removeAllNonBubblingListeners(node); } node.remove(); }}break;case 8:{this.stack.push(document.createTextNode(this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++])));}break;case 9:{let node = document.createTextNode(this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++])); this.nodes[this.u32buf[this.u32bufp++]] = node; this.stack.push(node);}break;case 10:{let node = document.createElement('pre'); node.hidden = true; this.stack.push(node); this.nodes[this.u32buf[this.u32bufp++]] = node;}break;case 11:id=this.u32buf[this.u32bufp++];
            let node = this.nodes[id];
            if(node.listening){node.listening += 1;}else{node.listening = 1;}
            node.setAttribute('data-dioxus-id', `${id}`);
            this.createListener(this.get_evt(), node, this.u8buf[this.u8bufp++]);
        break;case 12:{let node = this.nodes[this.u32buf[this.u32bufp++]]; node.listening -= 1; node.removeAttribute('data-dioxus-id'); this.removeListener(node, this.get_evt(), this.u8buf[this.u8bufp++]);}break;case 13:{this.nodes[this.u32buf[this.u32bufp++]].textContent = this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++]);}break;case 14:{let node = this.nodes[this.u32buf[this.u32bufp++]]; this.setAttributeInner(node, this.get_attr(), this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++]), this.get_ns_cache());}break;case 15:field=this.get_attr();ns=this.get_ns_cache();{
            let node = this.nodes[this.u32buf[this.u32bufp++]];
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
                node.style.removeProperty(field);
            } else {
                node.removeAttributeNS(ns, field);
            }
        }break;case 16:{this.nodes[this.u32buf[this.u32bufp++]] = this.loadChild(this.u32buf[this.u32bufp++], this.u8buf[this.u8bufp++]);}break;case 17:value=this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++]);{
            let node = this.loadChild(this.u32buf[this.u32bufp++], this.u8buf[this.u8bufp++]);
            if (node.nodeType == node.TEXT_NODE) {
                node.textContent = value;
            } else {
                let text = document.createTextNode(value);
                node.replaceWith(text);
                node = text;
            }
            this.nodes[this.u32buf[this.u32bufp++]] = node;
        }break;case 18:{let els = this.stack.splice(this.stack.length - this.u16buf[this.u16bufp++]); let node = this.loadChild(this.u32buf[this.u32bufp++], this.u8buf[this.u8bufp++]); node.replaceWith(...els);}break;case 19:{let node = this.templates[this.u16buf[this.u16bufp++]][this.u16buf[this.u16bufp++]].cloneNode(true); this.nodes[this.u32buf[this.u32bufp++]] = node; this.stack.push(node);}break;case 20:many=this.u16buf[this.u16bufp++];{
        let root = this.stack[this.stack.length-many-1];
        let els = this.stack.splice(this.stack.length-many);
        for (let k = 0; k < many; k++) {
            root.appendChild(els[k]);
        }
        }break;case 21:{this.setAttributeInner(this.stack[this.stack.length-1], this.get_attr(), this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++]), this.get_ns_cache());}break;case 22:{let node = document.createElement('pre'); node.hidden = true; this.stack.push(node);}break;case 23:{this.stack.push(document.createElement(this.get_el()))}break;case 24:{this.stack.push(document.createElementNS(this.get_namespace(), this.get_el()))}break;case 25:{this.templates[this.u16buf[this.u16bufp++]] = this.stack.splice(this.stack.length-this.u16buf[this.u16bufp++]);}break;case 26:id=this.u32buf[this.u32bufp++];bubbles=this.u8buf[this.u8bufp++];
    bubbles = bubbles == 1;
    let this_node = this.nodes[id];
    if(this_node.listening){
        this_node.listening += 1;
    } else {
        this_node.listening = 1;
    }
    this_node.setAttribute('data-dioxus-id', `${id}`);
    const event_name = this.get_evt();

    // if this is a mounted listener, we send the event immediately
    if (event_name === "mounted") {
        window.ipc.postMessage(
            this.serializeIpcMessage("user_event", {
                name: event_name,
                element: id,
                data: null,
                bubbles,
            })
        );
    } else {
        this.createListener(event_name, this_node, bubbles, (event) => {
            this.handler(event, event_name, bubbles);
        });
    }break;case 27:{this.nodes[this.u32buf[this.u32bufp++]] = this.loadChild((()=>{this.e=this.u8bufp+this.u32buf[this.u32bufp++];const final_array = this.u8buf.slice(this.u8bufp,this.e);this.u8bufp=this.e;return final_array;})());}break;case 28:value=this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++]);{
        let node = this.loadChild((()=>{this.e=this.u8bufp+this.u32buf[this.u32bufp++];const final_array = this.u8buf.slice(this.u8bufp,this.e);this.u8bufp=this.e;return final_array;})());
        if (node.nodeType == node.TEXT_NODE) {
            node.textContent = value;
        } else {
            let text = document.createTextNode(value);
            node.replaceWith(text);
            node = text;
        }
        this.nodes[this.u32buf[this.u32bufp++]] = node;
    }break;case 29:{let els = this.stack.splice(this.stack.length - this.u16buf[this.u16bufp++]); let node = this.loadChild((()=>{this.e=this.u8bufp+this.u32buf[this.u32bufp++];const final_array = this.u8buf.slice(this.u8bufp,this.e);this.u8bufp=this.e;return final_array;})()); node.replaceWith(...els);}break;case 30:return true;
                            }
                            this.op>>>=8;
                        }
                    }
                }

                run_from_bytes(bytes){
                    this.d = 0;
                    this.update_memory(new Uint8Array(bytes))
                    this.run()
                }
            }