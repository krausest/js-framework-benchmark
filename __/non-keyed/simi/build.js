(async () => {
    const spawnSync = require('child_process').spawnSync

    function spawnSyncOrThrow() {
        const result = spawnSync(...arguments)
        if (result.error) {
            throw result.error
        } else if (result.status !== 0) {
            const args = Array.from(arguments)
            throw new Error(args[0] + ' ' + args[1].join(' ') + ': exit status=' + result.status)
        }
        return result
    }

    if (spawnSync('rustup', ['--version'], { stdio: 'inherit' }).status !== 0) {
        throw new Error('The build process for this framework is intended for a Rust user (via rustup).' +
            'If you want to install Rust, visit https://www.rust-lang.org/.' +
            'Otherwise, you can run the benchmark with the provided `.js` and `.wasm` files.' +
            '(Note that other dependencies (require by this framework) will be installed automatically by "npm run build-prod-force")')
    }

    spawnSyncOrThrow('rustup', ['toolchain', 'install', 'nightly'], { stdio: 'inherit' })
    spawnSyncOrThrow('rustup', ['target', 'add', 'wasm32-unknown-unknown', '--toolchain', 'nightly'], { stdio: 'inherit' })

    if (spawnSync('wasm-bindgen', ['--version'], { stdio: 'inherit' }).status !== 0) {
        spawnSyncOrThrow('cargo', ['install', 'wasm-bindgen-cli', '--version', '0.2.29'], { stdio: 'inherit' })
    }

    if (spawnSync('simi', ['--version'], { stdio: 'inherit' }).status !== 0) {
        spawnSyncOrThrow('cargo', ['install', 'simi-cli'], { stdio: 'inherit' })
    }

    const build_mode = process.argv[2]
    spawnSyncOrThrow('simi', ['build', build_mode], { stdio: 'inherit' })
})().catch(console.dir)
