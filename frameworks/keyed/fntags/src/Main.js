import { fnapp, fnbind, fnstate, h, resetState } from '../node_modules/fntags/src/fntags.js'

const data = fnstate( { current: [] } )
const selected = fnstate( { id: 0 } )

function random( max ) { return Math.round( Math.random() * 1000 ) % max }

const A = [ 'pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean',
    'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive',
    'cheap', 'expensive', 'fancy' ]
const C = [ 'red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange' ]
const N = [ 'table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse',
    'keyboard' ]

let nextId = 1

function buildData( count ) {
    const data = new Array( count )
    for( let i = 0; i < count; i++ ) {
        data[ i ] = fnstate( {
                                 id: nextId++,
                                 label: `${A[ random( A.length ) ]} ${C[ random( C.length ) ]} ${N[ random( N.length ) ]}`
                             } )
    }
    return data
}

const createOneThousand = () => {
    resetState( selected, true )
    data.current = buildData( 1000 )
}

const createTenThousand = () => {
    resetState( selected, true )
    data.current = buildData( 10000 )
}

const appendOneThousand = () =>
    data.current = data.current.concat( buildData( 1000 ) )

const updateEveryTenth = () => {
    for( let i = 0; i < data.current.length; i += 10 ) {
        data.current[ i ].label += ' !!!'
    }
}

const swapRows = () => {
    const theData = data.current
    if( theData.length > 998 ) {
        const a = Object.assign( {}, theData[ 1 ] )
        Object.assign( theData[ 1 ], theData[ 998 ] )
        Object.assign( theData[ 998 ], a )
    }
}

const clear = () => {
    resetState( selected, true )

    data.current = []
}

const Button = ( id, title, onclick ) => (
    h( 'div', { class: 'col-sm-6 smallpad' },
       h( 'button', { id, type: 'button', class: 'btn btn-primary btn-block', onclick: onclick }, title )
    )
)

const row = ( item, idx ) => {
    let tr = h( 'tr', { id: item.id },
                h( 'td', { class: 'col-md-1' }, fnbind( item, () => item.id )),
                   h( 'td', { class: 'col-md-4' }, h( 'a', { onclick: () => selected.id = item.id }, fnbind( item, () => item.label ) ) ),
                   h( 'td', {
                          class: 'col-md-1',
                          onclick: ( e ) => {
                              tr.replaceWith( '' )
                              resetState( item )
                              data.current.splice( idx, 1 )
                          }
                      },
                      h( 'a',
                         h( 'span', { class: 'glyphicon glyphicon-remove', 'aria-hidden': 'true' } )
                      )
                   ),
                   h( 'td', { class: 'col-md-6' } )
                )
    return fnbind( selected, tr, ( el, st ) => {
        if( st.id === item.id )
            el.className = 'danger'
        else
            el.className = ''

    } )
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
                      Button( 'run', 'Create 1,000 rows', createOneThousand ),
                      Button( 'runlots', 'Create 10,000 rows', createTenThousand ),
                      Button( 'add', 'Append 1,000 rows', appendOneThousand ),
                      Button( 'update', 'Update every 10th row', updateEveryTenth ),
                      Button( 'clear', 'Clear', clear ),
                      Button( 'swaprows', 'Swap Rows', swapRows )
                   )
                )
             )
          )
       ),
       h( 'table', { class: 'table table-hover table-striped test-data' },
          fnbind( data, () =>
              h( 'tbody', ...data.current.map( row ) )
          )
       ),
       h( 'span', { class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': 'true' } )
)

