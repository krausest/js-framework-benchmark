
(function(window, document, HTMLElement) {
    
      const __flags = {
        isWCSupported: 'customElements' in window &&
        'import' in document.createElement('link') &&
        'content' in document.createElement('template'),
        isIE11: !!window['MSInputMethodContext'] && !!document['documentMode']
      }
    
      const _$ = Symbol('Slim')
    
      class Internals {
        constructor() {
          this.hasCustomTemplate = undefined
          this.boundParent = null
          this.repeater = {}
          this.bindings = {}
          this.reversed = {}
          this.inbounds = {}
          this.eventHandlers = {}
          this.internetExploderClone = null
          this.rootElement = null
          this.createdCallbackInvoked = false
          this.sourceText = null
          this.excluded = false
        }
      }
    
      class SlimError extends Error {
        constructor (message) {
          super(message)
          this.flags = __flags
        }
      }
    
      class Slim extends HTMLElement {
        static dashToCamel (dash) {
          return dash.indexOf('-') < 0 ? dash : dash.replace(/-[a-z]/g, m => {return m[1].toUpperCase()})
        }
        static camelToDash (camel) {
          return camel.replace(/([A-Z])/g, '-$1').toLowerCase();
        }
    
        static get rxInject () { return /\{(.+[^(\((.+)\))])\}/ }
        static get rxProp() { return /(.+[^(\((.+)\))])/ }
        static get rxMethod () { return /(.+)(\((.+)\)){1}/ }
        static lookup (target, expression, maybeRepeated) {
          const chain = expression.split('.')
          let o
          if (maybeRepeated && maybeRepeated[_$].repeater[chain[0]]) {
            o = maybeRepeated[_$].repeater
          } else {
            o = target
          }
          let i = 0
          while (o && i < chain.length) {
            o = o[chain[i++]]
          }
          return o
        }
        static extract (target, expression, maybeRepeated) {
          const rxP = this.rxProp.exec(expression)
          if (rxP) {
            return Slim.lookup(target, rxP[1], maybeRepeated)
          }
          const rxM = this.rxMethod.exec(expression)
          if (rxM) {
            const fn = Slim.lookup(target, rxM[1])
            const args = rxM[3].replace(' ','').split(',').map(arg => Slim.lookup(target, arg, maybeRepeated))
            return fn.apply(target, args)
          }
          return undefined
        }
        // noinspection JSUnresolvedVariable
        static _$ (target) {
          target[_$] = target[_$] || new Internals()
          return target[_$]
        }
        static polyFill (url) {
          if (!__flags.isWCSupported) {
            const existingScript = document.querySelector('script[data-is-slim-polyfill="true"]')
            if (!existingScript) {
              const script = document.createElement('script')
              script.setAttribute('data-is-slim-polyfill', 'true')
              script.src = url
              document.head.appendChild(script)
            }
          }
        }
        static tag(tagName, tplOrClazz, clazz) {
          if (this.tagToClassDict.has(tagName)) {
            throw new SlimError(`Unable to define tag: ${tagName} already defined`)
          }
          if (clazz === undefined) {
            clazz = tplOrClazz
          } else {
            Slim.tagToTemplateDict.set(tagName, tplOrClazz)
          }
          this.tagToClassDict.set(tagName, clazz)
          this.classToTagDict.set(clazz, tagName)
          customElements.define(tagName, clazz)
        }
    
        static tagOf (clazz) {
          return this.classToTagDict.get(clazz)
        }
    
        static classOf (tag) {
          return this.tagToClassDict.get(tag)
        }
    
        static createUniqueIndex () {
          this[_$].uniqueCounter++
          return this[_$].uniqueCounter.toString(16)
        }
    
        static plugin (phase, plugin) {
          if (!this.plugins[phase]) {
            throw new SlimError(`Cannot attach plugin: ${phase} is not a supported phase`)
          }
          this.plugins[phase].push(plugin)
        }
    
        static checkCreationBlocking(element) {
          if (element.attributes) {
            for (let i = 0, n = element.attributes.length; i < n; i++) {
              const attribute = element.attributes[i]
              for (let [test, directive] of Slim[_$].customDirectives) {
                const value = directive.isBlocking && test(attribute)
                if (value) {
                  return true
                }
              }
            }
          }
          return false
        }
    
        static customDirective (directiveStr, fn, isBlocking) {
          if (this[_$].customDirectives.has(directiveStr)) {
            throw new SlimError(`Cannot register custom directive: ${directiveStr} already registered`)
          }
          fn.isBlocking = isBlocking
          this[_$].customDirectives.set(directiveStr, fn)
        }
    
        static executePlugins (phase, target) {
          this.plugins[phase].forEach( fn => {
            fn(target)
          })
        }
    
        static qSelectAll(target, selector) {
          return Array.prototype.slice.call(target.querySelectorAll(selector))
        }
    
        static unbind (source, target) {
          const bindings = source[_$].bindings
          Object.keys(bindings).forEach(key => {
            const chain = bindings[key].chain.filter(binding => {
              if (binding.target === target) {
                binding.destroy()
                return false
              }
              return true
            })
            bindings[key].chain = chain
          })
        }
    
        static selectRecursive(target, force) {
          const collection = []
          const search = function(node, force) {
            collection.push(node)
            const allow = !(node instanceof Slim) || (node instanceof Slim && !node.template) || force
            if (allow) {
              Array.prototype.slice.call(node.children).forEach(childNode => {
                search(childNode, force)
              })
            }
          }
          search(target, force)
          return collection
        }
    
        static removeChild (target) {
          if (typeof target.remove === 'function') {
            target.remove()
          }
          if (target.parentNode) {
            target.parentNode.removeChild(target)
          }
          if (this._$(target).internetExploderClone) {
            this.removeChild(this._$(target).internetExploderClone)
          }
        }
    
        static moveChildrenBefore (source, target) {
          while (source.firstChild) {
            target.parentNode.insertBefore(source.firstChild, target)
          }
        }
    
        static moveChildren (source, target) {
          while (source.firstChild) {
            target.appendChild(source.firstChild)
          }
        }
    
        static wrapGetterSetter (element, expression) {
          const pName = expression.split('.')[0]
          const descriptor = Object.getOwnPropertyDescriptor(element, pName)
          let oSetter = descriptor && descriptor.set
          if (oSetter && oSetter[_$]) return pName
          if (typeof oSetter === 'undefined') {
            oSetter = () => {}
          }
    
          const srcValue = element[pName]
          this._$(element).bindings[pName] = element[_$].bindings[pName] || {
            chain: [],
            value: srcValue
          }
          element[_$].bindings[pName].value = srcValue
          const newSetter = function (v) {
            oSetter(v)
            this[_$].bindings[pName].value = v
            this._executeBindings(pName)
          }
          newSetter[_$] = true
          element.__defineGetter__(pName, () => element[_$].bindings[pName].value)
          element.__defineSetter__(pName, newSetter)
          return pName
        }
    
        static bindOwn(target, expression, executor) {
          Slim.bind(target, target, expression, executor)
        }
    
        static bind (source, target, expression, executor) {
          Slim._$(source)
          Slim._$(target)
          executor.source = source
          executor.target = target
          const pName = this.wrapGetterSetter(source, expression)
          if (!source[_$].reversed[pName]) {
            source[_$].bindings[pName].chain.push(executor)
          }
          target[_$].inbounds[pName] = target[_$].inbounds[pName] || []
          target[_$].inbounds[pName].push(executor)
          return executor
        }
    
        static commit (target, prop) {
          if (prop) {
            (target[_$].inbounds[prop] || []).forEach(x => x())
          } else {
            for (let key in target[_$].inbounds) {
              (target[_$].inbounds[key] || []).forEach(x => x())
            }
          }
        }
    
    
    
    
        /*
          Class instance
         */
    
    
        constructor () {
          super()
          Slim.debug('ctor', this.localName)
          if (Slim.checkCreationBlocking(this)) {
            return
          }
          this.createdCallback()
        }
    
        // Native DOM Api V1
    
        createdCallback () {
          if (this[_$] && this[_$].createdCallbackInvoked) return
          this._initialize()
          this[_$].createdCallbackInvoked = true
          this.onBeforeCreated()
          Slim.executePlugins('create', this)
          this.render()
          this.onCreated()
        }
    
        // Native DOM Api V2
    
        connectedCallback () {
          this.createdCallback()
          this.onAdded()
          Slim.executePlugins('added', this)
        }
    
        disconnectedCallback () {
          this.onRemoved()
          Slim.executePlugins('removed', this)
        }
    
        // Slim internal API
    
        get _isInContext () {
          let node = this
          while (node) {
            node = node.parentNode
            if (!node) {
              return false
            }
            if (node instanceof Document) {
              return true
            }
          }
          return false
        }
    
    
        _executeBindings (prop) {
          Slim.debug('_executeBindings', this.localName)
          let all = this[_$].bindings
          if (prop) {
            all = {[prop]: true}
          }
          for (let pName in all) {
            const o = this[_$].bindings[pName]
            o && o.chain.forEach(binding => {
              binding()
            })
          }
        }
    
        _bindChildren(children) {
          Slim.debug('_bindChildren', this.localName)
          if (!children) {
            children = Slim.qSelectAll(this, '*')
          }
          for (let child of children) {
            Slim._$(child)
            if (child[_$].boundParent === this) continue
            child[_$].boundParent = child[_$].boundParent || this
    
            // todo: child.localName === 'style' && this.useShadow -> processStyleNodeInShadowMode
    
            if (child.attributes) {
              for (let i = 0, n = child.attributes.length; i < n; i++) {
                const source = this
                const attribute = child.attributes[i]
                if (child[_$] && child[_$].excluded) continue
                for (let [check, directive] of Slim[_$].customDirectives) {
                  const match = check(attribute)
                  if (match) {
                    directive(source, child, attribute, match)
                  }
                }
              }
            }
          }
        }
    
        _resetBindings () {
          Slim.debug('_resetBindings', this.localName)
          this[_$].bindings = {}
        }
    
        _render (customTemplate) {
          Slim.debug('_render', this.localName)
          Slim.executePlugins('beforeRender', this)
          this[_$].hasCustomTemplate = customTemplate
          this._resetBindings()
          this[_$].rootElement.innerHTML = ''
          const template = this[_$].hasCustomTemplate || this.template
          if (template && typeof template === 'string') {
            const frag = document.createElement('slim-root-fragment')
            frag.innerHTML = template || ''
            const scopedChildren = Slim.qSelectAll(frag, '*')
            this._bindChildren(scopedChildren)
            Slim.asap( () => {
              Slim.moveChildren(frag, this[_$].rootElement || this)
              this._executeBindings()
              this.onRender()
              Slim.executePlugins('afterRender', this)
            })
          }
        }
    
        _initialize () {
          Slim.debug('_initialize', this.localName)
          Slim._$(this)
          this[_$].uniqueIndex = Slim.createUniqueIndex()
          if (this.useShadow) {
            // this.[_$].rootElement = this.attachShadow({mode:'open'})
            this[_$].rootElement = this.createShadowRoot()
          } else {
            this[_$].rootElement = this
          }
          // this.setAttribute('slim-uq', this[_$].uniqueIndex)
          const observedAttributes = this.constructor.observedAttributes
          if (observedAttributes) {
            observedAttributes.forEach( attr => {
              const pName = Slim.dashToCamel(attr)
              this[pName] = this.getAttribute(attr)
            })
          }
        }
    
        // Slim public / protected API
    
        render (tpl) {
          this._render(tpl)
        }
    
        onRender() {}
        onBeforeCreated () {}
        onCreated() {}
        onAdded() {}
        onRemoved() {}
    
        find (selector) {
          return (this[_$].rootElement).querySelector(selector)
        }
    
        findAll (selector) {
          return Slim.qSelectAll(this[_$].rootElement, selector)
        }
    
        callAttribute (attr, data) {
          const fnName = this.getAttribute(attr)
          if (fnName) {
            this[_$].boundParent[fnName](data)
          }
        }
    
        get useShadow () {
          return false
        }
    
        get template () {
          return Slim.tagToTemplateDict.get( Slim.tagOf(this.constructor) )
        }
      }
      Slim.uniqueIndex = 0
      Slim.tagToClassDict = new Map()
      Slim.classToTagDict = new Map()
      Slim.tagToTemplateDict = new Map()
      Slim.plugins = {
        'create': [],
        'added': [],
        'beforeRender': [],
        'afterRender': [],
        'removed': []
      }
    
      Slim.debug = () => {}
    
      Slim.asap = (window && window.requestAnimationFrame)
        ? cb => window.requestAnimationFrame(cb)
        : typeof setImmediate !== 'undefined'
          ? setImmediate
          : cb => setTimeout(cb, 0)
    
      Slim[_$] = {
        customDirectives: new Map(),
        uniqueCounter: 0,
        supportedNativeEvents: [
          'click', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mousedown', 'mouseup', 'dblclick', 'contextmenu', 'wheel',
          'mouseleave', 'select', 'pointerlockchange', 'pointerlockerror', 'focus', 'blur', 'input', 'error', 'invalid', 'animationstart',
          'animationend', 'animationiteration', 'reset', 'submit', 'resize', 'scroll', 'keydown', 'keypress', 'keyup','change'
        ]
      }
    
    
    
    
    
    
    
    
      Slim.customDirective(attr => /^s:repeat$/.exec(attr.nodeName), (source, templateNode, attribute) => {
        let path = attribute.nodeValue
        let tProp = 'data'
        if (path.indexOf(' as' )) {
          tProp = path.split(' as ')[1] || tProp
          path = path.split(' as ')[0]
        }
        let clones = []
        source[_$].reversed[tProp] = true
        const hook = document.createElementNS('s','repeat-end')
        Slim._$(hook)
        Slim.selectRecursive(templateNode, true).forEach(e => Slim._$(e).excluded = true)
        templateNode.parentElement.insertBefore(hook, templateNode)
        templateNode.remove()
        Slim.unbind(source, templateNode)
        Slim.asap( () => {
          templateNode.removeAttribute('s:repeat')
        })
        Slim.bind(source, hook, path, () => {
          const dataSource = Slim.lookup(source, path) || []
          const guid = Slim.createUniqueIndex()
          templateNode.setAttribute('repeat-unique-id', guid)
          let offset = 0
          let restOfData = []
          if (dataSource.length < clones.length) {
            const disposables = clones.splice(dataSource.length)
            disposables.forEach(c => c.remove())
            clones.forEach((c, i) => {
              [c].concat(Slim.qSelectAll(c, '*')).forEach(t => {
                if (t[_$].repeater[tProp] !== dataSource[i]) {
                  t[_$].repeater[tProp] = dataSource[i]
                  Slim.commit(t, tProp)
                }
              })
            })
          } else if (dataSource.length >= clones.length) {
            // recycle
            clones.forEach((c, i) => {
              [c].concat(Slim.qSelectAll(c, '*')).forEach(t => {
                Slim._$(t).repeater[tProp] = dataSource[i]
                Slim.commit(t, tProp)
              })
            })
            restOfData = dataSource.slice(clones.length)
            offset = clones.length
          }
          // build rest
          let html = ''
          restOfData.forEach(() => {
            html += templateNode.outerHTML
          })
          hook.insertAdjacentHTML('beforeBegin', html)
          let all = []
          source.findAll(`${templateNode.localName}[repeat-unique-id="${guid}"]`).forEach((e, index) => {
            clones.push(e)
            all.push(e)
            Slim._$(e).repeater[tProp] = dataSource[index + offset]
            const subTree = Slim.qSelectAll(e, '*')
            subTree.forEach(t => {
              all.push(t)
              Slim._$(t).repeater[tProp] = dataSource[index + offset]
            })
          })
          source._bindChildren(all)
          all.forEach(t => {
            Slim.commit(t, tProp)
            if (t instanceof Slim) {
              t.createdCallback()
              t[tProp] = t[_$].repeater[tProp]
            }
          })
        })
      }, true)
    
    
    
    
    
    
    
    
    
    
    
      // supported events (i.e. click, mouseover, change...)
      Slim.customDirective((attr) => Slim[_$].supportedNativeEvents.indexOf(attr.nodeName) >= 0,
        (source, target, attribute) => {
          const eventName = attribute.nodeName
          const delegate = attribute.nodeValue
          Slim._$(target).eventHandlers = target[_$].eventHandlers || {}
          const allHandlers = target[_$].eventHandlers
          allHandlers[eventName] = allHandlers[eventName] || []
          let handler = (e) => {
            try {
              source[delegate].call(source, e)
            }
            catch (err) {
              err.message = `Could not respond to event "${eventName}" on ${target.localName} -> "${delegate}" on ${source.localName} ... ${err.message}`
              console.warn(err)
            }
          }
          allHandlers[eventName].push(handler)
          target.addEventListener(eventName, handler)
          handler = null
        })
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
      Slim.customDirective(attr => {
        return /^s:if$/.exec(attr.nodeName)
      }, (source, target, attribute) => {
        let expression = attribute.nodeValue
        let path = expression
        let isNegative = false
        if (path.charAt(0) === '!') {
          path = path.slice(1)
          isNegative = true
        }
        const anchor = document.createComment(`if:${expression}`)
        target.parentNode.insertBefore(anchor, target)
        const fn = () => {
          let value = Slim.lookup(source, expression, target)
          if (isNegative) {
            value = !value
          }
          if (value) {
            anchor.parentNode.insertBefore(target, anchor.nextSibling)
          } else {
            Slim.removeChild(target)
          }
        }
        Slim.bind(source, target, path, fn)
      }, true)
    
      // bind (text nodes)
      Slim.customDirective(attr => /^bind$/.exec(attr.nodeName), (source, target) => {
        Slim._$(target)
        target[_$].sourceText = target.innerText
        let updatedText = ''
        const matches = target.innerText.match(/\{\{([^\}\}]+)+\}\}/g)
        const aggProps = {}
        const textBinds = {}
        if (matches) {
          matches.forEach(expression => {
            const rxM = /\{\{(.+)(\((.+)\)){1}\}\}/.exec(expression)
            if (rxM) {
              const fnName = rxM[1]
              const pNames = rxM[3].replace(' ','').split(',')
              pNames.map(path => path.split('.')[0]).forEach(p => aggProps[p] = true)
              textBinds[expression] = target => {
                try {
                  const args = pNames.map(path => Slim.lookup(source, path, target))
                  const value = source[fnName].apply(source, args)
                  updatedText = updatedText.split(expression).join(value || '')
                }
                catch (err) { /* gracefully ignore */ }
              }
              return
            }
            const rxP = /\{\{(.+[^(\((.+)\))])\}\}/.exec(expression)
            if (rxP) {
              const path = rxP[1]
              aggProps[path] = true
              textBinds[expression] = target => {
                try {
                  const value = Slim.lookup(source, path, target)
                  updatedText = updatedText.split(expression).join(value || '')
                }
                catch (err) { /* gracefully ignore */ }
              }
            }
          })
          const chainExecutor = () => {
            updatedText = target[_$].sourceText
            Object.keys(textBinds).forEach(expression => {
              textBinds[expression](target)
            })
            target.innerText = updatedText
          }
          Object.keys(aggProps).forEach(prop => {
            Slim.bind(source, target, prop, chainExecutor)
          })
        }
      })
    
      Slim.customDirective(attr => /^s:id$/.exec(attr.nodeName), (source, target, attribute) => {
        Slim._$(target).boundParent[attribute.nodeValue] = target
      })
    
      // bind:property
      Slim.customDirective(attr => /^(bind):(\S+)/.exec(attr.nodeName), (source, target, attribute, match) => {
        const tAttr = match[2]
        const tProp = Slim.dashToCamel(tAttr)
        const expression = attribute.nodeValue
        const rxM = Slim.rxMethod.exec(expression)
        if (rxM) {
          const pNames = rxM[3].replace(' ','').split(',')
          pNames.forEach( pName => {
            Slim.bind(source, target, pName, () => {
              const fn = Slim.lookup(source, rxM[1], target)
              const args = pNames.map(prop => Slim.extract(source, prop, target))
              const value = fn.apply(source, args)
              target[tProp] = value
              target.setAttribute(tAttr, value)
            })
          })
          return
        }
        const rxP = Slim.rxProp.exec(expression)
        if (rxP) {
          const prop = rxP[1]
          Slim.bind(source, target, prop, () => {
            const value = Slim.lookup(source, expression, target)
            target.setAttribute(tAttr, value)
            target[tProp] = value
          })
        }
      })
    
      if (window) {
        window['Slim'] = Slim
      }
      if (typeof module !== 'undefined') {
        module.exports.Slim = Slim
      }
    
    })(window, document, HTMLElement)
    