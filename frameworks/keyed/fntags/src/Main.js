import { findElement, fnapp, fnbind, fnstate, h, resetState } from 'https://cdn.jsdelivr.net/npm/fntags@0.2.4/src/fntags.min.js'

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

let selected = fnstate(null)

const row = ( item ) => item.map(i=>i.id, ()=>{
    let label = h( 'a', {
        onclick: () => {
            if( selected() ) selected().className = ''
            tr.className = 'danger'
            selected(tr)
        }
    }, item().label )
    let id = h( 'td', { class: 'col-md-1' }, item().id )
    let tr = h( 'tr', { id: item().id.toString(), class: selected() && selected().getAttribute("id") === item().id ? 'danger' : '' },
                id,
                h( 'td', { class: 'col-md-4' }, label ),
                h( 'td', {
                       class: 'col-md-1',
                       onclick: ( e ) => {
                           e.preventDefault()
                           tr.replaceWith( '' )
                           item( null )
                           resetState(item)
                           tr = null
                       }
                   },
                   h( 'a',
                      h( 'span', { class: 'glyphicon glyphicon-remove', 'aria-hidden': 'true' } )
                   )
                ),
                h( 'td', { class: 'col-md-6' } )
    )
    return fnbind(
        item,
        tr,
        () => {
            label.innerText = item().label
            id.innerText = item().id
        }
    )
})

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
                      Button( 'clear', 'Clear', () => data( [] ) && cache.clear() ) ,
                      Button( 'swaprows', 'Swap Rows', () => {
                          const theData = data()
                          if( theData.length > 998 ) {

                              let rowa = findElement( theData[ 1 ], el => el.getAttribute( 'id' ) == theData[ 1 ]().id )
                              let rowb = findElement( theData[ 998 ], el => el.getAttribute( 'id' ) == theData[ 998 ]().id )

                              const a = theData[ 1 ]
                              theData[ 1 ] = theData[ 998 ]
                              theData[ 998 ] = a
                              let sib = rowa.nextSibling
                              let parent = rowa.parentNode
                              parent.insertBefore( rowa, rowb )
                              parent.insertBefore( rowb, sib )
                          }
                      } )
                   )
                )
             )
          )
       ),
       h( 'table', { class: 'table table-hover table-striped test-data' },
          fnbind( data, h( 'tbody' ), ( el ) => {
              while( el.firstChild ) {
                  el.removeChild( el.firstChild )
              }
              el.append( ...data().map( row ) )
          } )
       ),
       h( 'span', { class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': 'true' } )
)