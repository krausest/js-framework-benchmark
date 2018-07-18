
// Synthetic Events

const nativeToSyntheticEvent = (event, name) => {
    const eventKey = `__${name}`
    let dom = event.target
    while(dom !== null) {
        const eventHandler = dom[eventKey]
        if (eventHandler) {
            eventHandler(dom[`__${name}Data`])
            return
        }
        dom = dom.parentNode
    }
}
const CONFIGURED_SYNTHETIC_EVENTS = {}
const setupSyntheticEvent = name => {
    if (CONFIGURED_SYNTHETIC_EVENTS[name]) return
    document.addEventListener(name, event => nativeToSyntheticEvent(event, name))
    CONFIGURED_SYNTHETIC_EVENTS[name] = true
}

// Core

let tagCounter = 0

class TextToken {
    constructor(node) {
        this.node = node
        this.tagId = 'text' + (++tagCounter)
    }
    create() {
        if (this.node.data.indexOf("${") >= 0) {
            this.dynamicPart = {
                getter: this.node.data,
                setter: value => `node.__${this.tagId}.data = ${value};\n`,
            }
            this.content = ''
        } else {
            this.content = this.node.data
        }
        return `const ${this.tagId} = document.createTextNode("${this.content}");\n`
    }
    append(parent) {
        return `${parent}.appendChild(${this.tagId});\n`
    }
    codegen(parent, root = this.tagId) {
        return `\
${this.create()}\
${this.append(parent)}\
${this.dynamicPart ? `${root}.__${this.tagId} = ${this.tagId};\n` : ''}`
    }
    getDynamicParts(parts) {
        parts.push(this.dynamicPart)
    }
}

class NodeToken {
    constructor(node) {
        this.node = node
        this.tagId = node.tagName.toLowerCase() + (++tagCounter)
        this.children = []
        this.dynamicParts = []
    }
    create() {
        return `const ${this.tagId} = document.createElement("${this.node.tagName.toLowerCase()}");\n`
    }
    attributes() {
        if (!this.node.attributes) return ''
        let code = ''
        for(let i = 0; i < this.node.attributes.length; i++) {
            const a = this.node.attributes[i]
            let setter
            let name = a.name
            let value = a.value
            const isReactive = value.indexOf("${") >= 0
            if (name === 'class') {
                setter = value => `${this.tagId}.className = ${value};\n`
            } else if (name.match(/^on/)) {
                const eventType = name.replace(/^on/, '')
                setupSyntheticEvent(eventType)
                if (isReactive) {
                    const reactiveValue = value.replace(/^\${/, '').replace(/}$/, '')
                    const handlerName = reactiveValue.match(/^.*?\(/)[0].replace('(', '')
                    code += `${this.tagId}.__${eventType} = scope.${handlerName};\n`
                    const argument = reactiveValue.match(/\(.*?\)/)[0].replace(/[\(\)]/g, '')
                    setter = value => `${this.tagId}.__${eventType}Data = ${value};\n`
                    value = argument
                } else {
                    setter = value => `${this.tagId}.on${eventType} = ${value};\n`
                }
            } else {
                setter = value => `${this.tagId}.setAttribute("${name}", ${value});\n`
            }
            if (isReactive) {
                this.dynamicParts.push({
                    getter: value,
                    setter: value => `node.__${setter(value)}`,
                })
            } else {
                code += setter(`"${value}"`)
            }
        }
        return code
    }
    append(parent = 'parent') {
        return `${parent}.appendChild(${this.tagId});\n`
    }
    appendChild(child) {
        this.children.push(child)
    }
    codegen(parent, root = this.tagId) {
        return `\
${this.create()}\
${this.attributes()}\
${root !== this.tagId ? this.append(parent) : ''}\
${this.children.map(c => c.codegen(this.tagId, root)).join('')}\
${this.dynamicParts.length > 0 ? `${root}.__${this.tagId} = ${this.tagId};\n` : ''}\
${root === this.tagId ? `return ${this.tagId};\n` : ''}`
    }
    getDynamicParts(parts) {
        parts.push(...this.dynamicParts)
        this.children.map(c => c.getDynamicParts(parts))
    }
}

const tokenize = node => {
    let token
    if (node.nodeType === 3) {
        if (node.data.trim() === '') return
        token = new TextToken(node)
    } else {
        token = new NodeToken(node)
    }
    for(let i = 0; i < node.childNodes.length; i++) {
        let childCode = tokenize(node.childNodes[i])
        if (childCode) token.appendChild(childCode)
    }
    return token
}

function makeid() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";

  text = possible.charAt(makeid.counter++);

  if (makeid.counter === possible.length) makeid.counter = 0
  return text;
}
makeid.counter = 0

const codegenUpdater = parts => {
    makeid.counter = 0
    
    parts.map(p => p.getter = p.getter.replace(/^\${/, '').replace(/}$/, ''))
    const argumentKeys = {}
    parts.map(({getter}) =>
        getter.split(/[(),]/)
        .filter(v => !!v)
        .map(v => v.trim().replace(/\..*$/, ''))
        .map(token => argumentKeys[token] = true))
    
    let code = `\
const vdom = {};\n\
${parts.map(({getter}) => `vdom.${makeid()} = ${getter};\n`).join('')}\n`
    
    makeid.counter = 0
    
    code += `\
${parts.map(({setter}) => {
    const vdomId = makeid()
    return `if (current.${vdomId} !== vdom.${vdomId}) ${setter(`vdom.${vdomId}`)}`
}).join('')}\

return vdom`
    
    return {code, argumentsToken: `{${Object.keys(argumentKeys).join(', ')}}`}
}

class Template {
    constructor(node) {
        const token = tokenize(node)
        const code = token.codegen()
        this.createInstanceFn = Function("scope", code)

        const parts = []
        token.getDynamicParts(parts)
        const dynamicCode = codegenUpdater(parts)
        this.update = Function(dynamicCode.argumentsToken, "node", "current = {}", dynamicCode.code)
    }
    createInstance(scope) {
        return new TemplateInstance(this, this.createInstanceFn(scope), scope)
    }
}

class TemplateInstance {
    constructor(template, node, scope) {
        this.template = template
        this.node = node
        if (scope) this.update(scope)
    }
    update(scope) {
        this.vdom = this.template.update(scope, this.node, this.vdom)
    }
}

const domc = () => {}
domc.compile = node => new Template(node)

export default domc
