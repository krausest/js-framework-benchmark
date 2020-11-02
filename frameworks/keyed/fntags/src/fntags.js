/**
 * A function to create dom elements with the given attributes and children.
 * If an argument is a non-node object it is considered an attributes object, attributes are combined with Object.assign in the order received.
 * All standard html attributes can be passed, as well as any other property.
 * Strings are added as attributes via setAttribute, functions are added as event listeners, other types are set as properties.
 *
 * The rest of the arguments will be considered children of this element and appended to it in the same order as passed.
 *
 * @param tag html tag to use when created the element
 * @param children optional attrs and children for the element
 * @returns HTMLElement an html element
 *

 */
export const h = ( tag, ...children ) => {
    let element = document.createElement( tag )
    if( isAttrs( children[ 0 ] ) ) {
        let attrs = children.shift()
        for( let a of Object.keys( attrs ) ) {
            let attr = attrs[ a ]
            if( typeof attr === 'function' && attr.isBoundAttribute ) {
                attr.init( a, element )
                attr = attr()
            }
            setAttribute( a, attr, element )
        }
    }
    for( let child of children ) {
        if( Array.isArray( child ) )
            for( let c of child ) {
                element.append( renderNode( c ) )
            }
        else
            element.append( renderNode( child ) )
    }
    return element
}


/**
 * Create a state object that can be bound to.
 * @param initialValue The initial state
 * @param mapKey A map function to extract a key from an element in the array. Receives the array value to extract the key from.
 * @returns function A function that can be used to get and set the state
 */
export const fnstate = ( initialValue, mapKey ) => {
    let ctx = {
        currentValue: initialValue,
        observers: [],
        bindContexts: [],
        selectObservers: {},
        mapKey,
        state( newState ) {
            if( arguments.length === 0 || arguments.length === 1 && arguments[ 0 ] === ctx.state ) {
                return ctx.currentValue
            } else {
                ctx.currentValue = newState
                for( let observer of ctx.observers ) {
                    observer( newState )
                }
            }
            return newState
        }
    }

    /**
     * Bind the values of this state to the given element.
     * Values are items/elements of an array.
     * If the current value is not an array, this will behave the same as bindAs.
     *
     * @param parent The parent to bind the children to.
     * @param element The element to bind to. If not a function, an update function must be passed
     * @param update If passed this will be executed directly when the state of any value changes with no other intervention
     */
    ctx.state.bindValues = ( parent, element, update ) => doBindValues( ctx, parent, element, update )

    /**
     * Bind this state to the given element
     *
     * @param element The element to bind to. If not a function, an update function must be passed
     * @param update If passed this will be executed directly when the state changes with no other intervention
     * @returns {(HTMLDivElement|Text)[]|HTMLDivElement|Text}
     */
    ctx.state.bindAs = ( element, update ) => doBindAs( ctx, element, update )

    /**
     * Bind attribute values to state changes
     * @param attribute A function that returns an attribute value
     * @returns {function(): *} A function that calls the passed function, with some extra metadata
     */
    ctx.state.bindAttr = attribute => doBindAttr( ctx.state, attribute )

    /**
     * Bind select and deselect to an element
     * @param element The element to bind to. If not a function, an update function must be passed
     * @param update If passed this will be executed directly when the state changes with no other intervention
     */
    ctx.state.bindSelect = ( element, update ) => doBindSelect( ctx, element, update )


    /**
     * Bind select and deselect to an attribute
     * @param attribute A function that returns an attribute value
     * @returns {function(): *} A function that calls the passed function, with some extra metadata
     */
    ctx.state.bindSelectAttr = attribute => doBindSelectAttr( ctx, attribute )

    /**
     * Mark the element with the given key as selected. This causes the bound select functions to be executed.
     */
    ctx.state.select = ( key ) => doSelect( ctx, key )

    /**
     * Get the currently selected key
     * @returns {*}
     */
    ctx.state.selected = () => ctx.selected

    ctx.state.isFnState = true

    /**
     * Perform an Object.assign on the current state using the provided update
     */
    ctx.state.patch = ( update ) => ctx.state( Object.assign( ctx.currentValue, update ) )

    /**
     * Register a callback that will be executed whenever the state is changed
     */
    ctx.state.subscribe = ( callback ) => ctx.observers.push( callback )

    /**
     * Remove all of the observers and optionally reset the value to it's initial value
     */
    ctx.state.reset = ( reInit ) => doReset( ctx, reInit, initialValue )

    return ctx.state
}

const subscribeSelect = ( ctx, callback ) => {
    let parentCtx = ctx.state.parentCtx
    let key = keyMapper( parentCtx.mapKey, ctx.currentValue )
    if( parentCtx.selectObservers[ key ] === undefined )
        parentCtx.selectObservers[ key ] = []
    parentCtx.selectObservers[ key ].push( callback )
}

let doBindSelectAttr = function( ctx, attribute ) {
    let boundAttr = createBoundAttr( attribute )
    boundAttr.init = ( attrName, element ) =>
        subscribeSelect( ctx, () => setAttribute( attrName, attribute(), element ) )
    return boundAttr
}

function createBoundAttr( attr ) {
    if( typeof attr !== 'function' )
        throw new Error( 'You must pass a function to bindAttr' )
    let boundAttr = () => attr()
    boundAttr.isBoundAttribute = true
    return boundAttr
}

function doBindAttr( state, attribute ) {
    let boundAttr = createBoundAttr( attribute )
    boundAttr.init = ( attrName, element ) => state.subscribe( () => setAttribute( attrName, attribute(), element ) )
    return boundAttr
}

function doReset( ctx, reInit, initialValue ) {
    ctx.observers = []
    ctx.selectObservers = {}
    if( reInit ) ctx.currentValue = initialValue
}

function doSelect( ctx, key ) {
    let currentSelected = ctx.selected
    ctx.selected = key
    if( ctx.selectObservers[ currentSelected ] !== undefined ) ctx.selectObservers[ currentSelected ].forEach( obs => obs() )
    if( ctx.selectObservers[ ctx.selected ] !== undefined ) ctx.selectObservers[ ctx.selected ].forEach( obs => obs() )
}

function doBindValues( ctx, parent, element, update ) {
    parent = renderNode( parent )
    if( parent === undefined ) throw new Error( 'You must provide a parent element to bind the children to. aka Need Bukkit.' )
    if( typeof element !== 'function' && typeof update !== 'function' )
        throw new Error( 'You must pass an update function when passing a non function element' )
    if( typeof ctx.mapKey !== 'function') {
        console.warn( 'Using value index as key, may not work correctly when moving items...' )
        ctx.mapKey = ( o, i ) => i
    }

    if( !Array.isArray( ctx.currentValue ) ) {
        return ctx.state.bindAs( element, update )
    }
    ctx.currentValue = ctx.currentValue.map( v => v.isFnState ? v : fnstate( v ) )
    ctx.bindContexts.push( { element, update, parent } )
    ctx.state.subscribe( () => {
        if( !Array.isArray( ctx.currentValue ) ) {
            console.warn( 'A state used with bindValues was updated to a non array value. This will be converted to an array of 1 and the state will be updated.' )
            setTimeout( () => ctx.state( [ctx.currentValue] ), 1 )
        } else
            reconcile( ctx )
    } )
    reconcile( ctx )
    return parent
}

let doBind = function( ctx, element, update, handleUpdate, handleReplace ) {
    if( typeof element !== 'function' && typeof update !== 'function' )
        throw new Error( 'You must pass an update function when passing a non function element' )
    if( typeof update === 'function' ) {
        let boundElement = renderNode( evaluateElement( element, ctx.currentValue ) )
        handleUpdate( boundElement )
        return boundElement
    } else {
        let current = setKey( ctx, renderNode( evaluateElement( element, ctx.currentValue ) ) )
        handleReplace( current )
        return current
    }
}

const doBindSelect = ( ctx, element, update ) =>
    doBind( ctx, element, update,
            boundElement =>
                subscribeSelect( ctx, () => update( boundElement ) ),
            ( current ) => {
                let key = keyMapper( ctx.state.parentCtx.mapKey, ctx.currentValue )
                subscribeSelect(
                    ctx,
                    () => {
                        let newElement = renderNode( evaluateElement( element, ctx.currentValue ) )
                        newElement.key = key
                        current.replaceWith( newElement )
                        current = newElement
                    }
                )
            } )

const doBindAs = ( ctx, element, update ) =>
    doBind( ctx, element, update,
            boundElement => {
                ctx.state.subscribe( () => update( boundElement ) )
            },
            ( current ) => {
                ctx.state.subscribe( () => {
                    let newElement = setKey( ctx, renderNode( evaluateElement( element, ctx.currentValue ) ) )
                    if( newElement !== undefined ) {
                        if( newElement.key === undefined || newElement.key !== current.key ) {
                            current.replaceWith( newElement )
                            current = newElement
                        }
                    }
                } )
            } )

/**
 * Reconcile the state of the current array value with the state of the bound elements
 */
function reconcile( ctx ) {
    for( let bindContext of ctx.bindContexts ) {
        if( bindContext.boundElementByKey === undefined) bindContext.boundElementByKey = {}
        arrangeElements( ctx, bindContext )
    }
}

function setKey( ctx, element ) {
    if( element.key === undefined  && ctx.mapKey !== undefined  ) element.key = keyMapper( ctx.mapKey, ctx.currentValue )
    return element
}

function keyMapper( mapKey, value ) {
    if( typeof value !== 'object' )
        return value
    else if( typeof mapKey !== 'function' ) {
        return 0
    } else
        return mapKey( value )
}

function arrangeElements( ctx, bindContext ) {
    if( ctx.currentValue.length === 0 ) {
        bindContext.parent.textContent = ''
        bindContext.boundElementByKey = {}
        ctx.selectObservers = {}
        return
    }

    let seenKeys = {}
    let prev = null
    let parent = bindContext.parent

    for( let i = ctx.currentValue.length - 1; i >= 0; i-- ) {
        let valueState = ctx.currentValue[ i ]
        if( valueState === null || valueState === undefined || !valueState.isFnState )
            valueState = ctx.currentValue[ i ] = fnstate( valueState )
        let key = keyMapper( ctx.mapKey, valueState() )
        if( seenKeys[ key ] ) throw new Error( 'Duplicate keys in a bound array are not allowed.' )
        seenKeys[ key ] = true
        let current = bindContext.boundElementByKey[ key ]
        let isNew = false
        //ensure the parent state is always set and can be accessed by the child states to lsiten to the selection change and such
        if( valueState.parentCtx === undefined ) valueState.parentCtx = ctx
        if( current === undefined ) {
            isNew = true
            current = bindContext.boundElementByKey[ key ] = renderNode( evaluateElement( bindContext.element, valueState ) )
            current.key = key
        }
        //place the element in the parent
        if( prev == null ) {
            if( !parent.lastChild || parent.lastChild.key !== current.key ) parent.append( current )
        } else {
            if( prev.previousSibling === null ) {
                //insertAdjacentElement is faster, but some nodes don't have it (lookin' at you text)
                if( prev.insertAdjacentElement !== undefined )
                    prev.insertAdjacentElement( 'beforeBegin', current )
                else
                    parent.insertBefore( current, prev )
            } else if( prev.previousSibling.key !== current.key ) {
                //if it's a new key, always insert it
                if( isNew )
                    //insertAdjacentElement is faster, but some nodes don't have it (lookin' at you text)
                    if( prev.insertAdjacentElement !== undefined )
                        prev.insertAdjacentElement( 'beforeBegin', current )
                    else
                        parent.insertBefore( current, prev )
                //if it's an existing key, replace the current object with the correct object
                else
                    prev.previousSibling.replaceWith( current )
            }
        }
        prev = current
    }

    //remove keys
    for( let key of Object.keys( bindContext.boundElementByKey ) ) {
        if( !seenKeys[ key ] ) {
            bindContext.boundElementByKey[ key ].remove()
            delete bindContext.boundElementByKey[ key ]
            if( ctx.selectObservers[ key ] !== undefined )
                delete ctx.selectObservers[ key ]
        }
    }
}

const evaluateElement = ( element, value ) => {
    if( element.isFnState ) return element()
    else return typeof element === 'function' ? element( value ) : element
}

/**
 * Convert non objects (objects are assumed to be nodes) to text nodes and allow promises to resolve to nodes
 */
export const renderNode = ( node ) => {
    if( typeof node === 'object' && node.then === undefined ) {
        return node
    } else if( typeof node === 'string' || typeof node === 'number' ) {
        return document.createTextNode( node )
    } else if( typeof node === 'object' && typeof node.then === 'function' ) {
        const temp = marker()
        node.then( el => temp.replaceWith( renderNode( el ) ) ).catch( e => console.error( 'Caught failed node promise.', e ) )
        return temp
    } else {
        return document.createTextNode( node + '' )
    }
}

let setAttribute = function( attrName, attr, element ) {
    //shortcut for most common cases
    if( typeof attr === 'string' || typeof attr === 'number' ) {
        element.setAttribute( attrName, attr )
    } else if( attrName === 'style' && typeof attr === 'object' ) {
        for( let style in attr ) {
            let st = attr[ style ].toString()
            let impt = st.lastIndexOf( '!important')
            if( impt > -1)
                element.style.setProperty( style, st.substring(0, impt), st.substring(impt) )
            else
                element.style.setProperty( style, attr[ style ] )
        }
    } else if( typeof attr === 'function' && attrName.startsWith( 'on' ) ) {
        element.addEventListener( attrName.substring( 2 ), attr )
    } else {
        element.setAttribute( attrName, attr )
    }
}

export const isAttrs = ( val ) => typeof val === 'object' && val.nodeType === undefined
/**of children
 * Aggregates all attribute objects from a list
 * @param children
 * @returns {{}} A single object containing all of the aggregated attribute objects
 */
export const getAttrs = ( children ) => isAttrs( children[ 0 ] ) ? children[ 0 ] : {}

/**
 * A hidden div node to mark your place in the dom
 * @returns {HTMLDivElement}
 */
const marker = ( attrs ) => h( 'div', Object.assign( attrs || {}, { style: 'display:none' } ) )