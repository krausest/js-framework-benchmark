const fs = require( 'fs-extra' )
const terser = require( 'terser' )

if( fs.existsSync( 'dist' ) ) fs.removeSync( 'dist' )
fs.mkdirSync( 'dist' )

const minify = ( file ) => {
    let content = fs.readFileSync( file, 'utf8' )
    if( process.argv[ 2 ] === 'dev' ) {
        return content
    } else {
        const code = terser.minify( content ).code
        if( !code ) throw new Error( `failed to minify ${file}` ).stack
        return code
    }
}
fs.writeFileSync('dist/fntags.min.js', minify('src/fntags.js'))
fs.writeFileSync( 'dist/Main.js', minify( 'src/Main.js' ) )