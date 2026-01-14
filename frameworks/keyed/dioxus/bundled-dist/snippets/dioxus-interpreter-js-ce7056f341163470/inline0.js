
            function setAttributeInner(node,field,value,ns){if(ns==="style"){node.style.setProperty(field,value);return}if(ns){node.setAttributeNS(ns,field,value);return}switch(field){case"value":if(node.tagName==="OPTION")setAttributeDefault(node,field,value);else if(node.value!==value)node.value=value;break;case"initial_value":node.defaultValue=value;break;case"checked":node.checked=truthy(value);break;case"initial_checked":node.defaultChecked=truthy(value);break;case"selected":node.selected=truthy(value);break;case"initial_selected":node.defaultSelected=truthy(value);break;case"dangerous_inner_html":node.innerHTML=value;break;case"style":let existingStyles={};for(let i=0;i<node.style.length;i++){let prop=node.style[i];existingStyles[prop]=node.style.getPropertyValue(prop)}node.setAttribute(field,value);for(let prop in existingStyles)if(!node.style.getPropertyValue(prop))node.style.setProperty(prop,existingStyles[prop]);break;case"multiple":if(setAttributeDefault(node,field,value),node.options!==null&&node.options!==void 0){let options=node.options;for(let option of options)option.selected=option.defaultSelected}break;default:setAttributeDefault(node,field,value)}}function setAttributeDefault(node,field,value){if(!truthy(value)&&isBoolAttr(field))node.removeAttribute(field);else node.setAttribute(field,value)}function truthy(val){return val==="true"||val===!0}function isBoolAttr(field){switch(field){case"allowfullscreen":case"allowpaymentrequest":case"async":case"autofocus":case"autoplay":case"checked":case"controls":case"default":case"defer":case"disabled":case"formnovalidate":case"hidden":case"ismap":case"itemscope":case"loop":case"multiple":case"muted":case"nomodule":case"novalidate":case"open":case"playsinline":case"readonly":case"required":case"reversed":case"selected":case"truespeed":case"webkitdirectory":return!0;default:return!1}}class BaseInterpreter{global;local;root;handler;resizeObserver;intersectionObserver;nodes;stack;templates;m;constructor(){}initialize(root,handler=null){this.global={},this.local={},this.root=root,this.nodes=[root],this.stack=[root],this.templates={},this.handler=handler,root.setAttribute("data-dioxus-id","0")}handleResizeEvent(entry){let target=entry.target,event=new CustomEvent("resize",{bubbles:!1,detail:entry});target.dispatchEvent(event)}createResizeObserver(element){if(!this.resizeObserver)this.resizeObserver=new ResizeObserver((entries)=>{for(let entry of entries)this.handleResizeEvent(entry)});this.resizeObserver.observe(element)}removeResizeObserver(element){if(this.resizeObserver)this.resizeObserver.unobserve(element)}handleIntersectionEvent(entry){let target=entry.target,event=new CustomEvent("visible",{bubbles:!1,detail:entry});target.dispatchEvent(event)}createIntersectionObserver(element){if(!this.intersectionObserver)this.intersectionObserver=new IntersectionObserver((entries)=>{for(let entry of entries)this.handleIntersectionEvent(entry)});this.intersectionObserver.observe(element)}removeIntersectionObserver(element){if(this.intersectionObserver)this.intersectionObserver.unobserve(element)}createListener(event_name,element,bubbles){if(event_name=="resize")this.createResizeObserver(element);else if(event_name=="visible")this.createIntersectionObserver(element);if(bubbles)if(this.global[event_name]===void 0)this.global[event_name]={active:1,callback:this.handler},this.root.addEventListener(event_name,this.handler);else this.global[event_name].active++;else{let id=element.getAttribute("data-dioxus-id");if(!this.local[id])this.local[id]={};element.addEventListener(event_name,this.handler)}}removeListener(element,event_name,bubbles){if(event_name=="resize")this.removeResizeObserver(element);else if(event_name=="visible")this.removeIntersectionObserver(element);else if(bubbles)this.removeBubblingListener(event_name);else this.removeNonBubblingListener(element,event_name)}removeBubblingListener(event_name){if(this.global[event_name].active--,this.global[event_name].active===0)this.root.removeEventListener(event_name,this.global[event_name].callback),delete this.global[event_name]}removeNonBubblingListener(element,event_name){let id=element.getAttribute("data-dioxus-id");if(delete this.local[id][event_name],Object.keys(this.local[id]).length===0)delete this.local[id];element.removeEventListener(event_name,this.handler)}removeAllNonBubblingListeners(element){let id=element.getAttribute("data-dioxus-id");delete this.local[id]}getNode(id){return this.nodes[id]}pushRoot(node){this.stack.push(node)}appendChildren(id,many){let root=this.nodes[id],els=this.stack.splice(this.stack.length-many);for(let k=0;k<many;k++)root.appendChild(els[k])}loadChild(ptr,len){let node=this.stack[this.stack.length-1],ptr_end=ptr+len;for(;ptr<ptr_end;ptr++){let end=this.m.getUint8(ptr);for(node=node.firstChild;end>0;end--)node=node.nextSibling}return node}saveTemplate(nodes,tmpl_id){this.templates[tmpl_id]=nodes}hydrate_node(hydrateNode,ids){let split=hydrateNode.getAttribute("data-node-hydration").split(","),id=ids[parseInt(split[0])];if(this.nodes[id]=hydrateNode,split.length>1){hydrateNode.listening=split.length-1,hydrateNode.setAttribute("data-dioxus-id",id.toString());for(let j=1;j<split.length;j++){let split2=split[j].split(":"),event_name=split2[0],bubbles=split2[1]==="1";this.createListener(event_name,hydrateNode,bubbles)}}}hydrate(ids,underNodes){for(let i=0;i<underNodes.length;i++){let under=underNodes[i];if(under instanceof HTMLElement){if(under.getAttribute("data-node-hydration"))this.hydrate_node(under,ids);let hydrateNodes=under.querySelectorAll("[data-node-hydration]");for(let i2=0;i2<hydrateNodes.length;i2++)this.hydrate_node(hydrateNodes[i2],ids)}let treeWalker=document.createTreeWalker(under,NodeFilter.SHOW_COMMENT),nextSibling=under.nextSibling,continueToNextNode=()=>{if(!treeWalker.nextNode())return!1;return treeWalker.currentNode!==nextSibling};while(treeWalker.currentNode){let currentNode=treeWalker.currentNode;if(currentNode.nodeType===Node.COMMENT_NODE){let id=currentNode.textContent,placeholderSplit=id.split("placeholder");if(placeholderSplit.length>1){if(this.nodes[ids[parseInt(placeholderSplit[1])]]=currentNode,!continueToNextNode())break;continue}let textNodeSplit=id.split("node-id");if(textNodeSplit.length>1){let next=currentNode.nextSibling;currentNode.remove();let commentAfterText,textNode;if(next.nodeType===Node.COMMENT_NODE){let newText=next.parentElement.insertBefore(document.createTextNode(""),next);commentAfterText=next,textNode=newText}else textNode=next,commentAfterText=textNode.nextSibling;treeWalker.currentNode=commentAfterText,this.nodes[ids[parseInt(textNodeSplit[1])]]=textNode;let exit=currentNode===under||!continueToNextNode();if(commentAfterText.remove(),exit)break;continue}}if(!continueToNextNode())break}}}setAttributeInner(node,field,value,ns){setAttributeInner(node,field,value,ns)}}export{BaseInterpreter};

            let bubbles,field,id,many,ns;
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
                    this.u16buf=null;this.u16bufp=null;this.u32buf=null;this.u32bufp=null;this.u8buf=null;this.u8bufp=null;this.attr = [];
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
                    };this.evt = [];
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
                    };this.s = "";this.lsp = null;this.sp = null;this.sl = null;this.c = new TextDecoder();
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
                    if ((this.metaflags>>>4)&1){
                this.t = this.m.getUint32(this.d+4*4,true);
                this.u16buf=new Uint16Array(this.m.buffer,this.t,((this.m.buffer.byteLength-this.t)-(this.m.buffer.byteLength-this.t)%2)/2);
            }
            this.u16bufp=0;if ((this.metaflags>>>3)&1){
                this.t = this.m.getUint32(this.d+3*4,true);
                this.u32buf=new Uint32Array(this.m.buffer,this.t,((this.m.buffer.byteLength-this.t)-(this.m.buffer.byteLength-this.t)%4)/4);
            }
            this.u32bufp=0;if ((this.metaflags>>>5)&1){
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
                    let buffer = new Uint8Array(this.m.buffer, this.lsp, this.sl);
                    // If the wasm buffer is a shared array buffer, we need to copy the data out before decoding https://github.com/DioxusLabs/dioxus/issues/2589
                    // Note: We intentionally don't use instanceof here because SharedArrayBuffer can be created even when SharedArrayBuffer is not defined...
                    if (this.m.buffer.constructor.name === "SharedArrayBuffer") {
                        let arrayBuffer = new ArrayBuffer(this.sl);
                        new Uint8Array(arrayBuffer).set(buffer);
                        buffer = arrayBuffer;
                    }
                    this.s = this.c.decode(buffer);
                }
            }
            this.sp=0;
                    for(;;){
                        this.op=this.m.getUint32(this.p,true);
                        this.p+=4;
                        this.z=0;
                        while(this.z++<4){
                            switch(this.op&255){
                                case 0:{this.pushRoot(this.nodes[this.u32buf[this.u32bufp++]]);}break;case 1:{this.appendChildren(this.u32buf[this.u32bufp++], this.u16buf[this.u16bufp++]);}break;case 2:{this.stack.pop();}break;case 3:{const root = this.nodes[this.u32buf[this.u32bufp++]]; let els = this.stack.splice(this.stack.length-this.u16buf[this.u16bufp++]); if (root.listening) { this.removeAllNonBubblingListeners(root); } root.replaceWith(...els);}break;case 4:{let node = this.nodes[this.u32buf[this.u32bufp++]];node.after(...this.stack.splice(this.stack.length-this.u16buf[this.u16bufp++]));}break;case 5:{let node = this.nodes[this.u32buf[this.u32bufp++]];node.before(...this.stack.splice(this.stack.length-this.u16buf[this.u16bufp++]));}break;case 6:{let node = this.nodes[this.u32buf[this.u32bufp++]]; if (node !== undefined) { if (node.listening) { this.removeAllNonBubblingListeners(node); } node.remove(); }}break;case 7:{this.stack.push(document.createTextNode(this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++])));}break;case 8:{let node = document.createTextNode(this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++])); this.nodes[this.u32buf[this.u32bufp++]] = node; this.stack.push(node);}break;case 9:{let node = document.createComment('placeholder'); this.stack.push(node); this.nodes[this.u32buf[this.u32bufp++]] = node;}break;case 10:id=this.u32buf[this.u32bufp++];
            const node = this.nodes[id];
            if(node.listening){node.listening += 1;}else{node.listening = 1;}
            node.setAttribute('data-dioxus-id', `${id}`);
            this.createListener(this.get_evt(), node, this.u8buf[this.u8bufp++]);
        break;case 11:{let node = this.nodes[this.u32buf[this.u32bufp++]]; node.listening -= 1; node.removeAttribute('data-dioxus-id'); this.removeListener(node, this.get_evt(), this.u8buf[this.u8bufp++]);}break;case 12:{this.nodes[this.u32buf[this.u32bufp++]].textContent = this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++]);}break;case 13:{let node = this.nodes[this.u32buf[this.u32bufp++]]; this.setAttributeInner(node, this.get_attr(), this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++]), this.get_ns_cache());}break;case 14:field=this.get_attr();ns=this.get_ns_cache();{
            let node = this.nodes[this.u32buf[this.u32bufp++]];
            if (!ns) {
                switch (field) {
                    case "value":
                        node.value = "";
                        node.removeAttribute("value");
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
        }break;case 15:{this.nodes[this.u32buf[this.u32bufp++]] = this.loadChild(this.u32buf[this.u32bufp++], this.u8buf[this.u8bufp++]);}break;case 16:{let els = this.stack.splice(this.stack.length - this.u16buf[this.u16bufp++]); let node = this.loadChild(this.u32buf[this.u32bufp++], this.u8buf[this.u8bufp++]); node.replaceWith(...els);}break;case 17:{let node = this.templates[this.u16buf[this.u16bufp++]][this.u16buf[this.u16bufp++]].cloneNode(true); this.nodes[this.u32buf[this.u32bufp++]] = node; this.stack.push(node);}break;case 18:many=this.u16buf[this.u16bufp++];{
            let root = this.stack[this.stack.length-many-1];
            let els = this.stack.splice(this.stack.length-many);
            for (let k = 0; k < many; k++) {
                root.appendChild(els[k]);
            }
        }break;case 19:{this.setAttributeInner(this.stack[this.stack.length-1], this.get_attr(), this.s.substring(this.sp,this.sp+=this.u32buf[this.u32bufp++]), this.get_ns_cache());}break;case 20:{let node = document.createComment('placeholder'); this.stack.push(node);}break;case 21:{this.stack.push(document.createElement(this.get_el()))}break;case 22:{this.stack.push(document.createElementNS(this.get_namespace(), this.get_el()))}break;case 23:{this.templates[this.u16buf[this.u16bufp++]] = this.stack.splice(this.stack.length-this.u16buf[this.u16bufp++]);}break;case 24:id=this.u32buf[this.u32bufp++];bubbles=this.u8buf[this.u8bufp++];
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
            this.sendSerializedEvent({
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
    }break;case 25:{this.nodes[this.u32buf[this.u32bufp++]] = this.loadChild((()=>{this.e=this.u8bufp+this.u32buf[this.u32bufp++];const final_array = this.u8buf.slice(this.u8bufp,this.e);this.u8bufp=this.e;return final_array;})());}break;case 26:{let els = this.stack.splice(this.stack.length - this.u16buf[this.u16bufp++]); let node = this.loadChild((()=>{this.e=this.u8bufp+this.u32buf[this.u32bufp++];const final_array = this.u8buf.slice(this.u8bufp,this.e);this.u8bufp=this.e;return final_array;})()); node.replaceWith(...els);}break;case 27:return true;
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