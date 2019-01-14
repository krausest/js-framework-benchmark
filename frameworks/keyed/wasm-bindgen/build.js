(async () => {
  const wasmBindgenVersion = "0.2.31";

  const fs = require("fs");
  const https = require("https");
  const os = require("os");
  const path = require("path");
  const spawnSync = require("child_process").spawnSync;

  function spawnSyncOrThrow() {
    const result = spawnSync(...arguments);
    if (result.error) {
      throw result.error;
    } else if (result.status !== 0) {
      const args = Array.from(arguments);
      throw new Error(
        args[0] + " " + args[1].join(" ") + ": exit status=" + result.status
      );
    }
    return result;
  }

  const projectDir = spawnSyncOrThrow("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8"
  }).stdout.trim();
  const localCargoDir = path.join(__dirname, ".cargo");

  process.env["RUSTUP_HOME"] = path.join(projectDir, ".rustup");
  process.env["CARGO_HOME"] = path.join(projectDir, ".cargo");
  process.env["PATH"] =
    path.join(localCargoDir, "bin") +
    path.delimiter +
    path.join(process.env["CARGO_HOME"], "bin") +
    path.delimiter +
    process.env.PATH;

  [
    process.env["RUSTUP_HOME"],
    path.join(process.env["RUSTUP_HOME"], "tmp")
  ].forEach(dir => {
    fs.existsSync(dir) || fs.mkdirSync(dir);
  });

  const rustup = path.join(process.env["CARGO_HOME"], "bin", "rustup");
  const cargo = path.join(process.env["CARGO_HOME"], "bin", "cargo");

  if (spawnSync(rustup, ["--version"], { stdio: "inherit" }).status !== 0) {
    const isWindows = os.platform() === "win32";
    const [rustupInitExt, rustupInitUrl] = isWindows
      ? ["exe", "https://win.rustup.rs/x86_64"]
      : ["sh", "https://sh.rustup.rs/"];
    const rustupInit = path.join(
      process.env["RUSTUP_HOME"],
      "tmp",
      "rustup-init." + rustupInitExt
    );

    await new Promise((resolve, reject) => {
      const rustupInitFile = fs
        .createWriteStream(rustupInit)
        .on("error", reject)
        .on("finish", resolve);
      https
        .get(rustupInitUrl, response => {
          response.pipe(rustupInitFile);
        })
        .on("error", reject);
    });

    const rustupInitArgs = [
      "--no-modify-path",
      "--default-toolchain",
      "wasm32-unknown-unknown",
      "-y"
    ];
    if (isWindows) {
      spawnSyncOrThrow(rustupInit, rustupInitArgs, { stdio: "inherit" });
    } else {
      spawnSyncOrThrow("sh", [rustupInit, ...rustupInitArgs], {
        stdio: "inherit"
      });
    }
  }

  if (
    spawnSync(rustup, ["run", "stable", "rustc", "--version"], {
      stdio: "inherit"
    }).status !== 0
  ) {
    spawnSyncOrThrow(rustup, ["self", "update"], { stdio: "inherit" });
    spawnSyncOrThrow(rustup, ["install", "stable"], { stdio: "inherit" });
  }

  spawnSyncOrThrow(
    rustup,
    ["target", "add", "wasm32-unknown-unknown", "--toolchain", "stable"],
    {
      stdio: "inherit"
    }
  );

  const wasmBindgen = path.join(localCargoDir, "bin", "wasm-bindgen");
  const wasmBindgenVersionOut = spawnSync(wasmBindgen, ["--version"]);
  const wasmBindgenVersionInstalled = String(wasmBindgenVersionOut.stdout);
  const shouldInstallWasmBindgen =
    wasmBindgenVersionOut.status !== 0 ||
    !wasmBindgenVersionInstalled.includes(wasmBindgenVersion);
  if (shouldInstallWasmBindgen) {
    spawnSyncOrThrow(
      cargo,
      [
        "+stable",
        "install",
        "-f",
        "wasm-bindgen-cli",
        "--version",
        wasmBindgenVersion,
        "--root",
        localCargoDir
      ],
      { stdio: "inherit" }
    );
  }

  // const wasmGc = path.join(localCargoDir, 'bin', 'wasm-gc')
  // if (spawnSync(wasmGc, ['-h'], { stdio: 'inherit' }).status !== 0) {
  //   spawnSyncOrThrow(cargo, ['+stable', 'install', 'wasm-gc'], { stdio: 'inherit' })
  // }

  if (spawnSync("which", ["wasm-opt"], { stdio: "inherit" }).status !== 0) {
    console.error("Please install binaryen/wasm-opt");
    return process.exit(1);
  }

  if (
    spawnSyncOrThrow(
      cargo,
      [
        "+stable",
        "build",
        "-vv",
        "--release",
        "--target=wasm32-unknown-unknown"
      ],
      { stdio: "inherit" }
    ).status !== 0
  ) {
    return process.exit(1);
  }

  const wasmInputPath = path.join(
    "target",
    "wasm32-unknown-unknown",
    "release",
    "js_framework_benchmark_wasm_bindgen.wasm"
  );
  spawnSyncOrThrow(wasmBindgen, [wasmInputPath, "--out-dir", "."], {
    stdio: "inherit"
  });

  spawnSyncOrThrow(
    "wasm-gc",
    [
      "js_framework_benchmark_wasm_bindgen_bg.wasm",
      "js_framework_benchmark_wasm_bindgen_bg_gc.wasm"
    ],
    { stdio: "inherit" }
  );
  spawnSyncOrThrow(
    "wasm-opt",
    [
      "--output",
      "js_framework_benchmark_wasm_bindgen_bg_gc_opt.wasm",
      "js_framework_benchmark_wasm_bindgen_bg_gc.wasm"
    ],
    { stdio: "inherit" }
  );
  spawnSyncOrThrow(
    "cp",
    [
      "-f",
      "js_framework_benchmark_wasm_bindgen_bg_gc_opt.wasm",
      "js_framework_benchmark_wasm_bindgen_bg.wasm"
    ],
    { stdio: "inherit" }
  );
})().catch(console.dir);
