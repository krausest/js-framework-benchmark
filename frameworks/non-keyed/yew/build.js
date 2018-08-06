(async () => {
  const cargoWebVersion = '0.6.15'

  const fs = require('fs')
  const https = require('https')
  const os = require('os')
  const path = require('path')
  const spawnSync = require('child_process').spawnSync

  function spawnSyncOrThrow () {
    const result = spawnSync(...arguments)
    if (result.error) {
      throw result.error
    } else if (result.status !== 0) {
      const args = Array.from(arguments)
      throw new Error(args[0] + ' ' + args[1].join(' ') + ': exit status=' + result.status)
    }
    return result
  }

  const projectDir = spawnSyncOrThrow('git', ['rev-parse', '--show-toplevel'], { 'encoding': 'utf8' }).stdout.trim()
  const localCargoDir = path.join(__dirname, '.cargo')

  process.env['RUSTUP_HOME'] = path.join(projectDir, '.rustup')
  process.env['CARGO_HOME'] = path.join(projectDir, '.cargo')
  process.env['PATH'] =
        path.join(localCargoDir, 'bin') + path.delimiter +
        path.join(process.env['CARGO_HOME'], 'bin') + path.delimiter +
        process.env.PATH;

  [process.env['RUSTUP_HOME'], path.join(process.env['RUSTUP_HOME'], 'tmp')].forEach(dir => {
    fs.existsSync(dir) || fs.mkdirSync(dir)
  })

  const rustup = path.join(process.env['CARGO_HOME'], 'bin', 'rustup')
  const cargo = path.join(process.env['CARGO_HOME'], 'bin', 'cargo')
  const cargoWeb = path.join(localCargoDir, 'bin', 'cargo-web')
  const buildToolchain = fs.readFileSync('rust-toolchain', 'utf8').trim()

  if (spawnSync(rustup, ['--version'], { stdio: 'inherit' }).status !== 0) {
    const isWindows = os.platform() === 'win32'
    const [rustupInitExt, rustupInitUrl] = isWindows
      ? ['exe', 'https://win.rustup.rs/x86_64']
      : ['sh', 'https://sh.rustup.rs/']
    const rustupInit = path.join(process.env['RUSTUP_HOME'], 'tmp', 'rustup-init.' + rustupInitExt)

    await new Promise((resolve, reject) => {
      const rustupInitFile = fs.createWriteStream(rustupInit).on('error', reject).on('finish', resolve)
      https.get(rustupInitUrl, response => {
        response.pipe(rustupInitFile)
      }).on('error', reject)
    })

    const rustupInitArgs = ['--no-modify-path', '--default-toolchain', 'none', '-y']
    if (isWindows) {
      spawnSyncOrThrow(rustupInit, rustupInitArgs, { stdio: 'inherit' })
    } else {
      spawnSyncOrThrow('sh', [rustupInit, ...rustupInitArgs], { stdio: 'inherit' })
    }
  }

  ['stable', buildToolchain].forEach(toolchain => {
    if (spawnSync(rustup, ['run', toolchain, 'rustc', '--version'], { stdio: 'inherit' }).status !== 0) {
      spawnSyncOrThrow(rustup, ['self', 'update'], { stdio: 'inherit' })
      spawnSyncOrThrow(rustup, ['install', toolchain], { stdio: 'inherit' })
    }
  })

  if (spawnSync(cargoWeb, ['--version'], { stdio: 'inherit' }).status !== 0) {
    spawnSyncOrThrow(cargo, ['+stable', 'install', 'cargo-web', '--version', cargoWebVersion, '--root', localCargoDir], { stdio: 'inherit' })
  }

  spawnSyncOrThrow(cargo, process.argv.slice(2), { stdio: 'inherit' })

  const cargoMetadataObject = JSON.parse(spawnSyncOrThrow(cargo, ['metadata', '--format-version=1'], { 'encoding': 'utf8' }).stdout)
  const cargoPackage = cargoMetadataObject.packages.find(({ name }) => name === path.basename(__dirname))
  if (cargoPackage && cargoPackage.source.startsWith('registry+')) {
    let packageJsonObject = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    packageJsonObject['js-framework-benchmark']['frameworkVersion'] = cargoPackage.version
    fs.writeFileSync('package.json', JSON.stringify(packageJsonObject, null, 2) + '\n', 'utf8')
  }

  const deployDir = path.join('target', 'deploy')
  fs.existsSync(deployDir) && fs.readdirSync(deployDir).forEach(deployedPath => {
    const srcPath = path.join(deployDir, deployedPath)
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, deployedPath)
    }
  })
})().catch(console.dir)
