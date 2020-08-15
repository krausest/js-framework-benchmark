import { fnapp, fnbind, fnstate, h } from 'https://cdn.jsdelivr.net/npm/fntags@0.2.10/src/fntags.min.js'

let data = fnstate( [] )

function random( max ) { return Math.round( Math.random() * 1000 ) % max }

const A = [ 'pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean',
    'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive',
    'cheap', 'expensive', 'fancy' ]
const C = [ 'red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange' ]
const N = [ 'table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse',
    'keyboard' ]

let nextId = 1

function buildData( count ) {
    const newData = new Array( count )
    for( let i = 0; i < count; i++ ) {
        newData[ i ] = fnstate( {
                                    id: nextId++,
                                    label: `${A[ random( A.length ) ]} ${C[ random( C.length ) ]} ${N[ random( N.length ) ]}`
                                } )
    }
    return newData
}

const Button = ( id, title, onclick ) =>
    h( 'div', { class: 'col-sm-6 smallpad' },
       h( 'button', { id, type: 'button', class: 'btn btn-primary btn-block', onclick: onclick }, title )
    )

let rowTemplate =
    h( 'tr',
       h( 'td', { class: 'col-md-1' } ),
       h( 'td', { class: 'col-md-4' }, h( 'a' ) ),
       h( 'td', { class: 'col-md-1' },
          h( 'a',
             h( 'span', { class: 'glyphicon glyphicon-remove', 'aria-hidden': 'true' } )
          )
       ),
       h( 'td', { class: 'col-md-6' } )
    )
let selected = null

const row = ( item ) => {
    const tr = rowTemplate.cloneNode( true )
    const id = tr.firstChild
    const label = id.nextSibling.firstChild
    const removeBtn = id.nextSibling.nextSibling

    removeBtn.addEventListener( 'click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        tr.replaceWith('')
        item.reset()
        item(null)
    } )

    tr.addEventListener( 'click', () => {
        if( selected ) selected.patch( { selected: false } )
        tr.className = 'danger'
        item.patch( { selected: true } )
        selected = item
    } )

    tr.setAttribute( 'id', item().id.toString() )

    const update = () => {
        tr.className = item().selected ? 'danger' : ''
        label.innerText = item().label
        id.innerText = item().id
    }

    update()
    return fnbind( item, tr, update )
}

fnapp( document.body,
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
                      Button( 'add', 'Append 1,000 rows', () => {
                          data( data().concat( buildData( 1000 ) ) )
                      } ),
                      Button( 'update', 'Update every 10th row', () => {
                          for( let i = 0; i < data().length; i += 10 ) {
                              data()[ i ].patch( { label: data()[ i ]().label + ' !!!' } )
                          }
                      } ),
                      Button( 'clear', 'Clear', () => data( [] ) ),
                      Button( 'swaprows', 'Swap Rows', () => {
                          const theData = data()
                          if( theData.length > 998 ) {
                              const a = theData[ 1 ]
                              theData[ 1 ] = theData[ 998 ]
                              theData[ 998 ] = a
                              data( theData )
                          }
                      } )
                   )
                )
             )
          )
       ),
       h( 'table', { class: 'table table-hover table-striped test-data' },
          data.mapChildren( h( 'tbody' ), ( item ) => item().id, row )
       ),
       h( 'span', { class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': 'true' } )
)