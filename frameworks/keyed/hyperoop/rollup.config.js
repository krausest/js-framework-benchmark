import typescript from 'rollup-plugin-typescript2';
import resolve    from 'rollup-plugin-node-resolve';
import commonjs   from "rollup-plugin-commonjs"

export default {
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
		resolve({
			jsnext: true
        }),
        commonjs({
            namedExports: {
                'node_modules/hyperoop/dist/hyperoop.js': [ 'h', 'init', 'Actions', 'SubActions', 'view']
            }
        })
    ]
}
