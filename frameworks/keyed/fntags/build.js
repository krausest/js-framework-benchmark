const fs = require( 'fs-extra' )
const terser = require( 'terser' )

async function build() {

    if( await fs.exists( 'dist' ) ) await fs.remove( 'dist' )
    await fs.mkdir( 'dist' )

    const minify = async ( file ) => {
        let content = await fs.readFile( file, 'utf8' )
        if( process.argv[2] === 'dev' ) {
            return content
        } else {
            let minifyOutput = await terser.minify( content, {module: true, ecma: 2015} );
            if( minifyOutput.error ) {
                const err = new Error( `failed to minify ${file}` )
                err.stack += `\nCaused By: ${minifyOutput.error.stack}`
                throw err
            }
            return minifyOutput.code
        }
    }
    await fs.writeFile( 'dist/fntags.min.js', await minify( 'node_modules/@srfnstack/fntags/src/fntags.mjs' ) )
    await fs.writeFile( 'dist/Main.js', await minify( 'src/Main.js' ) )
}

build().catch(e => {throw e})