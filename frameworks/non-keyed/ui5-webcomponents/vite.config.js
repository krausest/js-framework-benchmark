export default {
    build: {
        lib: {
            entry: "./bundle.esm.js",
            // the proper extensions will be added
            fileName: 'bundle.esm',
            formats: ['es']
        },
    },
}