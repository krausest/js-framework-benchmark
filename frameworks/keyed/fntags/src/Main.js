import { fnstate, fntemplate, h } from './fntags.min.js'

let data = fnstate( [], d => d.id )

function random( max ) {
    return Math.round( Math.random() * 1000 ) % max
}

const A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean',
    'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive',
    'cheap', 'expensive', 'fancy']
const C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
const N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse',
    'keyboard']

let nextId = 1

function buildData( count ) {
    const newData = new Array( count )
    for( let i = 0; i < count; i++ ) {
        newData[i] = {
            id: nextId++,
            label: `${A[random( A.length )]} ${C[random( C.length )]} ${N[random( N.length )]}`
        }
    }
    return newData
}

const Button = ( id, title, onclick ) =>
    h( 'div', { class: 'col-sm-6 smallpad' },
        h( 'button', { id, type: 'button', class: 'btn btn-primary btn-block', onclick: onclick }, title )
    )

const row = fntemplate( ctx =>
    h( 'tr', { id: ctx( 'id' ), class: ctx( 'rowClass' ), onclick: ctx( 'rowClick' ) },
        h( 'td', { class: 'col-md-1' }, ctx( 'id' ) ),
        h( 'td', { class: 'col-md-4' }, h( 'a', { class: 'lbl' }, ctx( 'label' ) ) ),
        h( 'td', { class: 'col-md-1' },
            h( 'a', h( 'span', {
                    onclick: ctx( 'removeRow' ),
                    class: 'glyphicon glyphicon-remove',
                    'aria-hidden': 'true'
                } )
            )
        ),
        h( 'td', { class: 'col-md-6' } )
    )
)

document.body.append(
    h( 'div', { class: 'container' },
        h( 'div', { class: 'jumbotron' },
            h( 'div', { class: 'row' },
                h( 'div', { class: 'col-md-6' },
                    h( 'h1', 'fntags keyed' )
                ),
                h( 'div', { class: 'col-md-6' },
                    h( 'div', { class: 'row' },
                        Button( 'run', 'Create 1,000 rows', () => data( buildData( 1000 ) ) ),
                        Button( 'runlots', 'Create 10,000 rows', () => data( buildData( 10000 ) ) ),
                        Button( 'add', 'Append 1,000 rows', () => data( data().concat( buildData( 1000 ) ) ) ),
                        Button( 'update', 'Update every 10th row', () => {
                            let items = data()
                            for( let i = 0; i < items.length; i += 10 ) {
                                let d = items[i]
                                let it = d()
                                it.label += ' !!!'
                                d( it )
                            }
                        } ),
                        Button( 'clear', 'Clear', () => data( [] ) ),
                        Button( 'swaprows', 'Swap Rows', () => {
                            const d = data()
                            if( d.length > 998 ) {
                                const a = d[1]
                                d[1] = d[998]
                                d[998] = a
                            }
                            data( d )
                        } )
                    )
                )
            )
        ),
        h( 'table', { class: 'table table-hover table-striped test-data' },
            data.bindChildren( h( 'tbody' ), item =>
                row( {
                    id: item().id,
                    label: item.bindAs( () => item().label ),
                    rowClass: item.bindSelectAttr( () => data.selected() === item().id ? 'danger' : '' ),
                    rowClick: () => data.select( item().id ),
                    removeRow: ( e ) => {
                        e.stopPropagation()
                        data( data().filter( d => d().id !== item().id ) )
                    }
                } )
            )
        ),
        h( 'span', { class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': 'true' } )
    )
)

