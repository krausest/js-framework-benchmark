(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.maquette = {})));
}(this, (function (exports) { 'use strict';

/* tslint:disable no-http-string */
var NAMESPACE_W3 = 'http://www.w3.org/';
/* tslint:enable no-http-string */
var NAMESPACE_SVG = NAMESPACE_W3 + "2000/svg";
var NAMESPACE_XLINK = NAMESPACE_W3 + "1999/xlink";
var emptyArray = [];
var extend = function (base, overrides) {
    var result = {};
    Object.keys(base).forEach(function (key) {
        result[key] = base[key];
    });
    if (overrides) {
        Object.keys(overrides).forEach(function (key) {
            result[key] = overrides[key];
        });
    }
    return result;
};
var same = function (vnode1, vnode2) {
    if (vnode1.vnodeSelector !== vnode2.vnodeSelector) {
        return false;
    }
    if (vnode1.properties && vnode2.properties) {
        if (vnode1.properties.key !== vnode2.properties.key) {
            return false;
        }
        return vnode1.properties.bind === vnode2.properties.bind;
    }
    return !vnode1.properties && !vnode2.properties;
};
var checkStyleValue = function (styleValue) {
    if (typeof styleValue !== 'string') {
        throw new Error('Style values must be strings');
    }
};
var findIndexOfChild = function (children, sameAs, start) {
    if (sameAs.vnodeSelector !== '') {
        // Never scan for text-nodes
        for (var i = start; i < children.length; i++) {
            if (same(children[i], sameAs)) {
                return i;
            }
        }
    }
    return -1;
};
var checkDistinguishable = function (childNodes, indexToCheck, parentVNode, operation) {
    var childNode = childNodes[indexToCheck];
    if (childNode.vnodeSelector === '') {
        return; // Text nodes need not be distinguishable
    }
    var properties = childNode.properties;
    var key = properties ? (properties.key === undefined ? properties.bind : properties.key) : undefined;
    if (!key) {
        for (var i = 0; i < childNodes.length; i++) {
            if (i !== indexToCheck) {
                var node = childNodes[i];
                if (same(node, childNode)) {
                    throw new Error(parentVNode.vnodeSelector + " had a " + childNode.vnodeSelector + " child " + (operation === 'added' ? operation : 'removed') + ", but there is now more than one. You must add unique key properties to make them distinguishable.");
                }
            }
        }
    }
};
var nodeAdded = function (vNode) {
    if (vNode.properties) {
        var enterAnimation = vNode.properties.enterAnimation;
        if (enterAnimation) {
            enterAnimation(vNode.domNode, vNode.properties);
        }
    }
};
var removedNodes = [];
var requestedIdleCallback = false;
var visitRemovedNode = function (node) {
    (node.children || []).forEach(visitRemovedNode);
    if (node.properties && node.properties.afterRemoved) {
        node.properties.afterRemoved.apply(node.properties.bind || node.properties, [node.domNode]);
    }
};
var processPendingNodeRemovals = function () {
    requestedIdleCallback = false;
    removedNodes.forEach(visitRemovedNode);
    removedNodes.length = 0;
};
var scheduleNodeRemoval = function (vNode) {
    removedNodes.push(vNode);
    if (!requestedIdleCallback) {
        requestedIdleCallback = true;
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            window.requestIdleCallback(processPendingNodeRemovals, { timeout: 16 });
        }
        else {
            setTimeout(processPendingNodeRemovals, 16);
        }
    }
};
var nodeToRemove = function (vNode) {
    var domNode = vNode.domNode;
    if (vNode.properties) {
        var exitAnimation = vNode.properties.exitAnimation;
        if (exitAnimation) {
            domNode.style.pointerEvents = 'none';
            var removeDomNode = function () {
                if (domNode.parentNode) {
                    domNode.parentNode.removeChild(domNode);
                    scheduleNodeRemoval(vNode);
                }
            };
            exitAnimation(domNode, removeDomNode, vNode.properties);
            return;
        }
    }
    if (domNode.parentNode) {
        domNode.parentNode.removeChild(domNode);
        scheduleNodeRemoval(vNode);
    }
};
var setProperties = function (domNode, properties, projectionOptions) {
    if (!properties) {
        return;
    }
    var eventHandlerInterceptor = projectionOptions.eventHandlerInterceptor;
    var propNames = Object.keys(properties);
    var propCount = propNames.length;
    var _loop_1 = function (i) {
        var propName = propNames[i];
        var propValue = properties[propName];
        if (propName === 'className') {
            throw new Error('Property "className" is not supported, use "class".');
        }
        else if (propName === 'class') {
            propValue.split(/\s+/).forEach(function (token) { return domNode.classList.add(token); });
        }
        else if (propName === 'classes') {
            // object with string keys and boolean values
            var classNames = Object.keys(propValue);
            var classNameCount = classNames.length;
            for (var j = 0; j < classNameCount; j++) {
                var className = classNames[j];
                if (propValue[className]) {
                    domNode.classList.add(className);
                }
            }
        }
        else if (propName === 'styles') {
            // object with string keys and string (!) values
            var styleNames = Object.keys(propValue);
            var styleCount = styleNames.length;
            for (var j = 0; j < styleCount; j++) {
                var styleName = styleNames[j];
                var styleValue = propValue[styleName];
                if (styleValue) {
                    checkStyleValue(styleValue);
                    projectionOptions.styleApplyer(domNode, styleName, styleValue);
                }
            }
        }
        else if (propName !== 'key' && propValue !== null && propValue !== undefined) {
            var type = typeof propValue;
            if (type === 'function') {
                if (propName.lastIndexOf('on', 0) === 0) {
                    if (eventHandlerInterceptor) {
                        propValue = eventHandlerInterceptor(propName, propValue, domNode, properties); // intercept eventhandlers
                    }
                    if (propName === 'oninput') {
                        /* tslint:disable no-this-keyword no-invalid-this only-arrow-functions no-void-expression */
                        (function () {
                            // record the evt.target.value, because IE and Edge sometimes do a requestAnimationFrame between changing value and running oninput
                            var oldPropValue = propValue;
                            propValue = function (evt) {
                                oldPropValue.apply(this, [evt]);
                                evt.target['oninput-value'] = evt.target.value; // may be HTMLTextAreaElement as well
                            };
                        }());
                        /* tslint:enable */
                    }
                    domNode[propName] = propValue;
                }
            }
            else if (type === 'string' && propName !== 'value' && propName !== 'innerHTML') {
                if (projectionOptions.namespace === NAMESPACE_SVG && propName === 'href') {
                    domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
                }
                else {
                    domNode.setAttribute(propName, propValue);
                }
            }
            else {
                domNode[propName] = propValue;
            }
        }
    };
    for (var i = 0; i < propCount; i++) {
        _loop_1(i);
    }
};
var addChildren = function (domNode, children, projectionOptions) {
    if (!children) {
        return;
    }
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        createDom(child, domNode, undefined, projectionOptions);
    }
};
var initPropertiesAndChildren = function (domNode, vnode, projectionOptions) {
    addChildren(domNode, vnode.children, projectionOptions); // children before properties, needed for value property of <select>.
    if (vnode.text) {
        domNode.textContent = vnode.text;
    }
    setProperties(domNode, vnode.properties, projectionOptions);
    if (vnode.properties && vnode.properties.afterCreate) {
        vnode.properties.afterCreate.apply(vnode.properties.bind || vnode.properties, [domNode, projectionOptions, vnode.vnodeSelector, vnode.properties, vnode.children]);
    }
};
var createDom = function (vnode, parentNode, insertBefore, projectionOptions) {
    var domNode;
    var start = 0;
    var vnodeSelector = vnode.vnodeSelector;
    var doc = parentNode.ownerDocument;
    if (vnodeSelector === '') {
        domNode = vnode.domNode = doc.createTextNode(vnode.text);
        if (insertBefore !== undefined) {
            parentNode.insertBefore(domNode, insertBefore);
        }
        else {
            parentNode.appendChild(domNode);
        }
    }
    else {
        for (var i = 0; i <= vnodeSelector.length; ++i) {
            var c = vnodeSelector.charAt(i);
            if (i === vnodeSelector.length || c === '.' || c === '#') {
                var type = vnodeSelector.charAt(start - 1);
                var found = vnodeSelector.slice(start, i);
                if (type === '.') {
                    domNode.classList.add(found);
                }
                else if (type === '#') {
                    domNode.id = found;
                }
                else {
                    if (found === 'svg') {
                        projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
                    }
                    if (projectionOptions.namespace !== undefined) {
                        domNode = vnode.domNode = doc.createElementNS(projectionOptions.namespace, found);
                    }
                    else {
                        domNode = vnode.domNode = (vnode.domNode || doc.createElement(found));
                        if (found === 'input' && vnode.properties && vnode.properties.type !== undefined) {
                            // IE8 and older don't support setting input type after the DOM Node has been added to the document
                            domNode.setAttribute('type', vnode.properties.type);
                        }
                    }
                    if (insertBefore !== undefined) {
                        parentNode.insertBefore(domNode, insertBefore);
                    }
                    else if (domNode.parentNode !== parentNode) {
                        parentNode.appendChild(domNode);
                    }
                }
                start = i + 1;
            }
        }
        initPropertiesAndChildren(domNode, vnode, projectionOptions);
    }
};
var updateDom;
/**
 * Adds or removes classes from an Element
 * @param domNode the element
 * @param classes a string separated list of classes
 * @param on true means add classes, false means remove
 */
var toggleClasses = function (domNode, classes, on) {
    if (!classes) {
        return;
    }
    classes.split(' ').forEach(function (c) { return domNode.classList.toggle(c, on); });
};
var updateProperties = function (domNode, previousProperties, properties, projectionOptions) {
    if (!properties) {
        return;
    }
    var propertiesUpdated = false;
    var propNames = Object.keys(properties);
    var propCount = propNames.length;
    for (var i = 0; i < propCount; i++) {
        var propName = propNames[i];
        // assuming that properties will be nullified instead of missing is by design
        var propValue = properties[propName];
        var previousValue = previousProperties[propName];
        if (propName === 'class') {
            if (previousValue !== propValue) {
                toggleClasses(domNode, previousValue, false);
                toggleClasses(domNode, propValue, true);
            }
        }
        else if (propName === 'classes') {
            var classList = domNode.classList;
            var classNames = Object.keys(propValue);
            var classNameCount = classNames.length;
            for (var j = 0; j < classNameCount; j++) {
                var className = classNames[j];
                var on = !!propValue[className];
                var previousOn = !!previousValue[className];
                if (on === previousOn) {
                    continue;
                }
                propertiesUpdated = true;
                if (on) {
                    classList.add(className);
                }
                else {
                    classList.remove(className);
                }
            }
        }
        else if (propName === 'styles') {
            var styleNames = Object.keys(propValue);
            var styleCount = styleNames.length;
            for (var j = 0; j < styleCount; j++) {
                var styleName = styleNames[j];
                var newStyleValue = propValue[styleName];
                var oldStyleValue = previousValue[styleName];
                if (newStyleValue === oldStyleValue) {
                    continue;
                }
                propertiesUpdated = true;
                if (newStyleValue) {
                    checkStyleValue(newStyleValue);
                    projectionOptions.styleApplyer(domNode, styleName, newStyleValue);
                }
                else {
                    projectionOptions.styleApplyer(domNode, styleName, '');
                }
            }
        }
        else {
            if (!propValue && typeof previousValue === 'string') {
                propValue = '';
            }
            if (propName === 'value') {
                var domValue = domNode[propName];
                if (domValue !== propValue // The 'value' in the DOM tree !== newValue
                    && (domNode['oninput-value']
                        ? domValue === domNode['oninput-value'] // If the last reported value to 'oninput' does not match domValue, do nothing and wait for oninput
                        : propValue !== previousValue // Only update the value if the vdom changed
                    )) {
                    // The edge cases are described in the tests
                    domNode[propName] = propValue; // Reset the value, even if the virtual DOM did not change
                    domNode['oninput-value'] = undefined;
                } // else do not update the domNode, otherwise the cursor position would be changed
                if (propValue !== previousValue) {
                    propertiesUpdated = true;
                }
            }
            else if (propValue !== previousValue) {
                var type = typeof propValue;
                if (type !== 'function' || !projectionOptions.eventHandlerInterceptor) {
                    if (type === 'string' && propName !== 'innerHTML') {
                        if (projectionOptions.namespace === NAMESPACE_SVG && propName === 'href') {
                            domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
                        }
                        else if (propName === 'role' && propValue === '') {
                            domNode.removeAttribute(propName);
                        }
                        else {
                            domNode.setAttribute(propName, propValue);
                        }
                    }
                    else {
                        if (domNode[propName] !== propValue) {
                            domNode[propName] = propValue;
                        }
                    }
                    propertiesUpdated = true;
                }
            }
        }
    }
    return propertiesUpdated;
};
var updateChildren = function (vnode, domNode, oldChildren, newChildren, projectionOptions) {
    if (oldChildren === newChildren) {
        return false;
    }
    oldChildren = oldChildren || emptyArray;
    newChildren = newChildren || emptyArray;
    var oldChildrenLength = oldChildren.length;
    var newChildrenLength = newChildren.length;
    var oldIndex = 0;
    var newIndex = 0;
    var i;
    var textUpdated = false;
    while (newIndex < newChildrenLength) {
        var oldChild = (oldIndex < oldChildrenLength) ? oldChildren[oldIndex] : undefined;
        var newChild = newChildren[newIndex];
        if (oldChild !== undefined && same(oldChild, newChild)) {
            textUpdated = updateDom(oldChild, newChild, projectionOptions) || textUpdated;
            oldIndex++;
        }
        else {
            var findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
            if (findOldIndex >= 0) {
                // Remove preceding missing children
                for (i = oldIndex; i < findOldIndex; i++) {
                    nodeToRemove(oldChildren[i]);
                    checkDistinguishable(oldChildren, i, vnode, 'removed');
                }
                textUpdated = updateDom(oldChildren[findOldIndex], newChild, projectionOptions) || textUpdated;
                oldIndex = findOldIndex + 1;
            }
            else {
                // New child
                createDom(newChild, domNode, (oldIndex < oldChildrenLength) ? oldChildren[oldIndex].domNode : undefined, projectionOptions);
                nodeAdded(newChild);
                checkDistinguishable(newChildren, newIndex, vnode, 'added');
            }
        }
        newIndex++;
    }
    if (oldChildrenLength > oldIndex) {
        // Remove child fragments
        for (i = oldIndex; i < oldChildrenLength; i++) {
            nodeToRemove(oldChildren[i]);
            checkDistinguishable(oldChildren, i, vnode, 'removed');
        }
    }
    return textUpdated;
};
updateDom = function (previous, vnode, projectionOptions) {
    var domNode = previous.domNode;
    var textUpdated = false;
    if (previous === vnode) {
        return false; // By contract, VNode objects may not be modified anymore after passing them to maquette
    }
    var updated = false;
    if (vnode.vnodeSelector === '') {
        if (vnode.text !== previous.text) {
            var newTextNode = domNode.ownerDocument.createTextNode(vnode.text);
            domNode.parentNode.replaceChild(newTextNode, domNode);
            vnode.domNode = newTextNode;
            textUpdated = true;
            return textUpdated;
        }
        vnode.domNode = domNode;
    }
    else {
        if (vnode.vnodeSelector.lastIndexOf('svg', 0) === 0) {
            projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
        }
        if (previous.text !== vnode.text) {
            updated = true;
            if (vnode.text === undefined) {
                domNode.removeChild(domNode.firstChild); // the only textnode presumably
            }
            else {
                domNode.textContent = vnode.text;
            }
        }
        vnode.domNode = domNode;
        updated = updateChildren(vnode, domNode, previous.children, vnode.children, projectionOptions) || updated;
        updated = updateProperties(domNode, previous.properties, vnode.properties, projectionOptions) || updated;
        if (vnode.properties && vnode.properties.afterUpdate) {
            vnode.properties.afterUpdate.apply(vnode.properties.bind || vnode.properties, [domNode, projectionOptions, vnode.vnodeSelector, vnode.properties, vnode.children]);
        }
    }
    if (updated && vnode.properties && vnode.properties.updateAnimation) {
        vnode.properties.updateAnimation(domNode, vnode.properties, previous.properties);
    }
    return textUpdated;
};
var createProjection = function (vnode, projectionOptions) {
    return {
        getLastRender: function () { return vnode; },
        update: function (updatedVnode) {
            if (vnode.vnodeSelector !== updatedVnode.vnodeSelector) {
                throw new Error('The selector for the root VNode may not be changed. (consider using dom.merge and add one extra level to the virtual DOM)');
            }
            var previousVNode = vnode;
            vnode = updatedVnode;
            updateDom(previousVNode, updatedVnode, projectionOptions);
        },
        domNode: vnode.domNode
    };
};

var DEFAULT_PROJECTION_OPTIONS = {
    namespace: undefined,
    performanceLogger: function () { return undefined; },
    eventHandlerInterceptor: undefined,
    styleApplyer: function (domNode, styleName, value) {
        // Provides a hook to add vendor prefixes for browsers that still need it.
        domNode.style[styleName] = value;
    }
};
var applyDefaultProjectionOptions = function (projectorOptions) {
    return extend(DEFAULT_PROJECTION_OPTIONS, projectorOptions);
};
var dom = {
    /**
     * Creates a real DOM tree from `vnode`. The [[Projection]] object returned will contain the resulting DOM Node in
     * its [[Projection.domNode|domNode]] property.
     * This is a low-level method. Users will typically use a [[Projector]] instead.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
     * objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the projection.
     * @returns The [[Projection]] which also contains the DOM Node that was created.
     */
    create: function (vnode, projectionOptions) {
        projectionOptions = applyDefaultProjectionOptions(projectionOptions);
        createDom(vnode, document.createElement('div'), undefined, projectionOptions);
        return createProjection(vnode, projectionOptions);
    },
    /**
     * Appends a new child node to the DOM which is generated from a [[VNode]].
     * This is a low-level method. Users will typically use a [[Projector]] instead.
     * @param parentNode - The parent node for the new child node.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
     * objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the [[Projection]].
     * @returns The [[Projection]] that was created.
     */
    append: function (parentNode, vnode, projectionOptions) {
        projectionOptions = applyDefaultProjectionOptions(projectionOptions);
        createDom(vnode, parentNode, undefined, projectionOptions);
        return createProjection(vnode, projectionOptions);
    },
    /**
     * Inserts a new DOM node which is generated from a [[VNode]].
     * This is a low-level method. Users wil typically use a [[Projector]] instead.
     * @param beforeNode - The node that the DOM Node is inserted before.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function.
     * NOTE: [[VNode]] objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the projection, see [[createProjector]].
     * @returns The [[Projection]] that was created.
     */
    insertBefore: function (beforeNode, vnode, projectionOptions) {
        projectionOptions = applyDefaultProjectionOptions(projectionOptions);
        createDom(vnode, beforeNode.parentNode, beforeNode, projectionOptions);
        return createProjection(vnode, projectionOptions);
    },
    /**
     * Merges a new DOM node which is generated from a [[VNode]] with an existing DOM Node.
     * This means that the virtual DOM and the real DOM will have one overlapping element.
     * Therefore the selector for the root [[VNode]] will be ignored, but its properties and children will be applied to the Element provided.
     * This is a low-level method. Users wil typically use a [[Projector]] instead.
     * @param element - The existing element to adopt as the root of the new virtual DOM. Existing attributes and child nodes are preserved.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]] objects
     * may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the projection, see [[createProjector]].
     * @returns The [[Projection]] that was created.
     */
    merge: function (element, vnode, projectionOptions) {
        projectionOptions = applyDefaultProjectionOptions(projectionOptions);
        vnode.domNode = element;
        initPropertiesAndChildren(element, vnode, projectionOptions);
        return createProjection(vnode, projectionOptions);
    },
    /**
     * Replaces an existing DOM node with a node generated from a [[VNode]].
     * This is a low-level method. Users will typically use a [[Projector]] instead.
     * @param element - The node for the [[VNode]] to replace.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
     * objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the [[Projection]].
     * @returns The [[Projection]] that was created.
     */
    replace: function (element, vnode, projectionOptions) {
        projectionOptions = applyDefaultProjectionOptions(projectionOptions);
        createDom(vnode, element.parentNode, element, projectionOptions);
        element.parentNode.removeChild(element);
        return createProjection(vnode, projectionOptions);
    }
};

/* tslint:disable function-name */
var toTextVNode = function (data) {
    return {
        vnodeSelector: '',
        properties: undefined,
        children: undefined,
        text: data.toString(),
        domNode: null
    };
};
var appendChildren = function (parentSelector, insertions, main) {
    for (var i = 0, length_1 = insertions.length; i < length_1; i++) {
        var item = insertions[i];
        if (Array.isArray(item)) {
            appendChildren(parentSelector, item, main);
        }
        else {
            if (item !== null && item !== undefined) {
                if (typeof item === 'string') {
                    item = toTextVNode(item);
                }
                main.push(item);
            }
        }
    }
};
function h(selector, properties, children) {
    if (Array.isArray(properties)) {
        children = properties;
        properties = undefined;
    }
    else if ((properties && (typeof properties === 'string' || properties.hasOwnProperty('vnodeSelector'))) ||
        (children && (typeof children === 'string' || children.hasOwnProperty('vnodeSelector')))) {
        throw new Error('h called with invalid arguments');
    }
    var text;
    var flattenedChildren;
    // Recognize a common special case where there is only a single text node
    if (children !== undefined && children.length === 1 && typeof children[0] === 'string') {
        text = children[0];
    }
    else if (children) {
        flattenedChildren = [];
        appendChildren(selector, children, flattenedChildren);
        if (flattenedChildren.length === 0) {
            flattenedChildren = undefined;
        }
    }
    return {
        vnodeSelector: selector,
        properties: properties,
        children: flattenedChildren,
        text: (text === '') ? undefined : text,
        domNode: null
    };
}

var createParentNodePath = function (node, rootNode) {
    var parentNodePath = [];
    while (node !== rootNode) {
        parentNodePath.push(node);
        node = node.parentNode;
    }
    return parentNodePath;
};
var findVNodeByParentNodePath = function (vnode, parentNodePath) {
    var result = vnode;
    parentNodePath.forEach(function (node) {
        result = (result && result.children) ? result.children.find(function (child) { return child.domNode === node; }) : undefined;
    });
    return result;
};
var createEventHandlerInterceptor = function (projector, getProjection, performanceLogger) {
    var modifiedEventHandler = function (evt) {
        performanceLogger('domEvent', evt);
        var projection = getProjection();
        var parentNodePath = createParentNodePath(evt.currentTarget, projection.domNode);
        parentNodePath.reverse();
        var matchingVNode = findVNodeByParentNodePath(projection.getLastRender(), parentNodePath);
        projector.scheduleRender();
        var result;
        if (matchingVNode) {
            /* tslint:disable no-invalid-this */
            result = matchingVNode.properties["on" + evt.type].apply(matchingVNode.properties.bind || this, arguments);
            /* tslint:enable no-invalid-this */
        }
        performanceLogger('domEventProcessed', evt);
        return result;
    };
    return function (propertyName, eventHandler, domNode, properties) { return modifiedEventHandler; };
};
/**
 * Creates a [[Projector]] instance using the provided projectionOptions.
 *
 * For more information, see [[Projector]].
 *
 * @param projectorOptions   Options that influence how the DOM is rendered and updated.
 */
var createProjector = function (projectorOptions) {
    var projector;
    var projectionOptions = applyDefaultProjectionOptions(projectorOptions);
    var performanceLogger = projectionOptions.performanceLogger;
    var renderCompleted = true;
    var scheduled;
    var stopped = false;
    var projections = [];
    var renderFunctions = []; // matches the projections array
    var addProjection = function (
        /* one of: dom.append, dom.insertBefore, dom.replace, dom.merge */
        domFunction, 
        /* the parameter of the domFunction */
        node, renderFunction) {
        var projection;
        var getProjection = function () { return projection; };
        projectionOptions.eventHandlerInterceptor = createEventHandlerInterceptor(projector, getProjection, performanceLogger);
        projection = domFunction(node, renderFunction(), projectionOptions);
        projections.push(projection);
        renderFunctions.push(renderFunction);
    };
    var doRender = function () {
        scheduled = undefined;
        if (!renderCompleted) {
            return; // The last render threw an error, it should have been logged in the browser console.
        }
        renderCompleted = false;
        performanceLogger('renderStart', undefined);
        for (var i = 0; i < projections.length; i++) {
            var updatedVnode = renderFunctions[i]();
            performanceLogger('rendered', undefined);
            projections[i].update(updatedVnode);
            performanceLogger('patched', undefined);
        }
        performanceLogger('renderDone', undefined);
        renderCompleted = true;
    };
    projector = {
        renderNow: doRender,
        scheduleRender: function () {
            if (!scheduled && !stopped) {
                scheduled = requestAnimationFrame(doRender);
            }
        },
        stop: function () {
            if (scheduled) {
                cancelAnimationFrame(scheduled);
                scheduled = undefined;
            }
            stopped = true;
        },
        resume: function () {
            stopped = false;
            renderCompleted = true;
            projector.scheduleRender();
        },
        append: function (parentNode, renderFunction) {
            addProjection(dom.append, parentNode, renderFunction);
        },
        insertBefore: function (beforeNode, renderFunction) {
            addProjection(dom.insertBefore, beforeNode, renderFunction);
        },
        merge: function (domNode, renderFunction) {
            addProjection(dom.merge, domNode, renderFunction);
        },
        replace: function (domNode, renderFunction) {
            addProjection(dom.replace, domNode, renderFunction);
        },
        detach: function (renderFunction) {
            for (var i = 0; i < renderFunctions.length; i++) {
                if (renderFunctions[i] === renderFunction) {
                    renderFunctions.splice(i, 1);
                    return projections.splice(i, 1)[0];
                }
            }
            throw new Error('renderFunction was not found');
        }
    };
    return projector;
};

/**
 * Creates a [[CalculationCache]] object, useful for caching [[VNode]] trees.
 * In practice, caching of [[VNode]] trees is not needed, because achieving 60 frames per second is almost never a problem.
 * For more information, see [[CalculationCache]].
 *
 * @param <Result> The type of the value that is cached.
 */
var createCache = function () {
    var cachedInputs;
    var cachedOutcome;
    return {
        invalidate: function () {
            cachedOutcome = undefined;
            cachedInputs = undefined;
        },
        result: function (inputs, calculation) {
            if (cachedInputs) {
                for (var i = 0; i < inputs.length; i++) {
                    if (cachedInputs[i] !== inputs[i]) {
                        cachedOutcome = undefined;
                    }
                }
            }
            if (!cachedOutcome) {
                cachedOutcome = calculation();
                cachedInputs = inputs;
            }
            return cachedOutcome;
        }
    };
};

/**
 * Creates a {@link Mapping} instance that keeps an array of result objects synchronized with an array of source objects.
 * See {@link http://maquettejs.org/docs/arrays.html|Working with arrays}.
 *
 * @param <Source>       The type of source items. A database-record for instance.
 * @param <Target>       The type of target items. A [[MaquetteComponent]] for instance.
 * @param getSourceKey   `function(source)` that must return a key to identify each source object. The result must either be a string or a number.
 * @param createResult   `function(source, index)` that must create a new result object from a given source. This function is identical
 *                       to the `callback` argument in `Array.map(callback)`.
 * @param updateResult   `function(source, target, index)` that updates a result to an updated source.
 */
var createMapping = function (getSourceKey, createResult, updateResult) {
    var keys = [];
    var results = [];
    return {
        results: results,
        map: function (newSources) {
            var newKeys = newSources.map(getSourceKey);
            var oldTargets = results.slice();
            var oldIndex = 0;
            for (var i = 0; i < newSources.length; i++) {
                var source = newSources[i];
                var sourceKey = newKeys[i];
                if (sourceKey === keys[oldIndex]) {
                    results[i] = oldTargets[oldIndex];
                    updateResult(source, oldTargets[oldIndex], i);
                    oldIndex++;
                }
                else {
                    var found = false;
                    for (var j = 1; j < keys.length + 1; j++) {
                        var searchIndex = (oldIndex + j) % keys.length;
                        if (keys[searchIndex] === sourceKey) {
                            results[i] = oldTargets[searchIndex];
                            updateResult(newSources[i], oldTargets[searchIndex], i);
                            oldIndex = searchIndex + 1;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        results[i] = createResult(source, i);
                    }
                }
            }
            results.length = newSources.length;
            keys = newKeys;
        }
    };
};

exports.dom = dom;
exports.h = h;
exports.createProjector = createProjector;
exports.createCache = createCache;
exports.createMapping = createMapping;

Object.defineProperty(exports, '__esModule', { value: true });

})));
