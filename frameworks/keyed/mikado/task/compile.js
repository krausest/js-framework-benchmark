#!/usr/bin/env node

const { html2json } = require("html2json");
const { readFileSync, writeFileSync } = require("fs");

const src_name = process.argv[2];
let dest_name = process.argv[3];

if(!src_name){

    return;
}

const template = readFileSync(__dirname + '/../' + src_name, 'utf8').replace(/<!--[\s\S]*?-->/g, "");

if(dest_name){

    if(dest_name.lastIndexOf(".") !== -1){

        dest_name = dest_name.substring(0, dest_name.lastIndexOf("."));
    }
}
else if(src_name.lastIndexOf(".") !== -1){

    dest_name = src_name.substring(0, src_name.lastIndexOf("."));
}

let template_name = dest_name;

if(template_name.lastIndexOf("/") !== -1){

    template_name = template_name.substring(template_name.lastIndexOf("/") + 1);
}

function remove_non_elemen_nodes(nodes) {

    if(nodes.child) {

        if(!nodes.child.length){

            delete nodes.child;
        }
        else{

            for(let i = 0; i < nodes.child.length; i++){

                if(nodes.child[i].node === "text"){

                    const text = nodes.child[i].text.trim();

                    if(text){

                        if(text.indexOf("{{#") !== -1){

                            nodes.html = text.replace(/{{#/g, "{{");
                        }
                        else{

                            nodes.text = text;
                        }
                    }
                }

                if(nodes.child[i].tag === "div"){

                    delete nodes.child[i].tag;
                }

                if(nodes.child[i].attr){

                    if(nodes.child[i].attr.class){

                        nodes.child[i].class = nodes.child[i].attr.class;

                        delete nodes.child[i].attr.class;

                        if(typeof nodes.child[i].class === "object"){

                            nodes.child[i].class = nodes.child[i].class.join(" ")
                        }
                    }

                    if(nodes.child[i].attr.style){

                        /*
                        const styles = {};
                        for(let a = 0; a < nodes.child[i].attr.style.length; a+=2){
                            styles[nodes.child[i].attr.style[a].replace(":", "")] = nodes.child[i].attr.style[a + 1].replace(";", "");
                        }
                        */

                        nodes.child[i].style = nodes.child[i].attr.style.join("");
                        delete nodes.child[i].attr.style;
                    }

                    const keys = Object.keys(nodes.child[i].attr);

                    if(keys.length === 0){

                        delete nodes.child[i].attr;
                    }
                    else{

                        for(let x = 0; x < keys.length; x++){

                            if(typeof nodes.child[i].attr[keys[x]] === "object"){

                                nodes.child[i].attr[keys[x]] = nodes.child[i].attr[keys[x]].join(" ");
                            }
                        }
                    }
                }

                if(nodes.child[i].node !== "element") {

                    nodes.child.splice(i, 1);
                    i--;
                }
                else{

                    delete nodes.child[i].node;

                    remove_non_elemen_nodes(nodes.child[i]);
                }
            }

            if(nodes.child.length === 0){

                delete nodes.child;
            }
            else if(nodes.child.length === 1){

                nodes.child = nodes.child[0];
            }
        }
    }

    return nodes;
}

let json = remove_non_elemen_nodes(html2json(template));

function create_schema(root){

    if(root.constructor === Array){

        for(let i = 0; i < root.length; i++){

            create_schema(root[i]);
        }
    }
    else if(root.constructor === Object){

        for(let key in root){

            if(root.hasOwnProperty(key)){

                const value = root[key];

                if(typeof value === "string"){

                    if(value.indexOf("{{") !== -1 && value.indexOf("}}") !== -1){

                        const tmp = value.replace(/"{{/g, "")
                                         .replace(/}}"/g, "")
                                         .replace(/{{/g, "' + ")
                                         .replace(/}}/g, " + '");

                        root[key] = [("'" + tmp + "'").replace(/'' \+ /g, "")
                                                      .replace(/ \+ ''/g, "")];
                    }
                }
                else{

                    create_schema(value);
                }
            }
        }
    }
}

if(json) create_schema(json);
if(json) json = json.child.length ? json.child[0] : json.child;
if(json) json.name = template_name;
if(json) json = JSON.stringify(json, null, 2);

json = json.replace(/"name":/g, "\"n\":")
           .replace(/"tag":/g, "\"t\":")
           .replace(/"attr":/g, "\"a\":")
           .replace(/"class":/g, "\"c\":")
           .replace(/"text":/g, "\"x\":")
           .replace(/"html":/g, "\"h\":")
           .replace(/"style":/g, "\"s\":")
           .replace(/"css":/g, "\"p\":")
           .replace(/"child":/g, "\"i\":");

writeFileSync(__dirname + '/../' + (dest_name || src_name) + '.json', json, 'utf8');

/*
json = json.replace(/"tag":/g, "tag:")
           .replace(/"attr":/g, "attr:")
           .replace(/"class":/g, "class:")
           .replace(/"text":/g, "text:")
           .replace(/"html":/g, "html:")
           .replace(/"style":/g, "style:")
           .replace(/"css":/g, "css:")
           .replace(/"child":/g, "child:");
           .replace(/"{{/g, "")
           .replace(/}}"/g, "")
           .replace(/{{/g, "\" + ")
           .replace(/}}/g, " + \"");
*/

const es5 = "Mikado.register(" + json + ");";

//writeFileSync(__dirname + '/../' + (dest_name || src_name) + '.js', es5, 'utf8');

const es6 = "export default " + json + ";";

writeFileSync(__dirname + '/../' + (dest_name || src_name) + '.es6.js', es6, 'utf8');