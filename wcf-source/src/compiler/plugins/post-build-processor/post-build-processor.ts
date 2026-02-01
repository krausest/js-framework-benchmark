import fs from 'fs';
import http from 'http';
import path from 'path';
import readline from 'readline';
import zlib from 'zlib';
import type { Metafile, Plugin } from 'esbuild';
import { consoleColors, ansi, PLUGIN_NAME, sourceCache, getContentType } from '../../utils/index.js';

const NAME = PLUGIN_NAME.POST_BUILD;

let totalBundleSizeInBytes = 0;
const fileSizeLog: { fileName: string; sizeInBytes: number }[] = [];

const serverPort = 4200;
let serverStarted = false;
let sseClients: http.ServerResponse[] = [];

export interface PostBuildOptions {
  distDir: string;
  inputHTMLFilePath: string;
  outputHTMLFilePath: string;
  assetsInputDir?: string;
  assetsOutputDir?: string;
  serve?: boolean;
  isProd?: boolean;
  useGzip?: boolean;
}

// Module-level config that gets set by plugin factory
let config: PostBuildOptions;

export const PostBuildPlugin = (options: PostBuildOptions): Plugin => {
  config = options;
  
  return {
    name: NAME,
    setup(build) {
      const { distDir } = config;
      
      build.onStart(async () => {
        sourceCache.clear();

        if (fs.existsSync(distDir)) {
          await fs.promises.rm(distDir, { recursive: true });
        }
        await fs.promises.mkdir(distDir, { recursive: true });
      });

      build.onEnd(async (result: { metafile?: Metafile }) => {
        totalBundleSizeInBytes = 0;

        const { assetsInputDir, assetsOutputDir, serve } = config;
        if (assetsInputDir && assetsOutputDir) {
          if (serve) {
            watchAndRecursivelyCopyAssetsIntoDist(assetsInputDir, assetsOutputDir);
          } else {
            await recursivelyCopyAssetsIntoDist(assetsInputDir, assetsOutputDir);
          }
        }

        if (result.metafile) {
          await processMetafileAndUpdateHTML(result.metafile);
        }
      });
    },
  };
};
const processMetafileAndUpdateHTML = async (metafile: Metafile): Promise<void> => {
  const { distDir } = config;
  const outputs = metafile.outputs;
  const hashedFileNames: Record<string, string> = {
    main: '',
    router: '',
    index: '',
  };
  for (const [outputPath, info] of Object.entries(outputs)) {
    const fileName = path.basename(outputPath);
    const fullPath = path.join(distDir, fileName);
    let sizeInBytes = info.bytes; // Fallback to metafile size
    try {
      const stats = await fs.promises.stat(fullPath);
      sizeInBytes = stats.size;
    } catch {
    }

    totalBundleSizeInBytes += sizeInBytes;
    fileSizeLog.push({ fileName, sizeInBytes });
    if (info.entryPoint) {
      if (info.entryPoint.includes('main.ts') || info.entryPoint.includes('main-')) {
        hashedFileNames.main = fileName;
      } else if (info.entryPoint.includes('router.ts')) {
        hashedFileNames.router = fileName;
      } else if (info.entryPoint.includes('index.ts')) {
        hashedFileNames.index = fileName;
      }
    }
  }

  await copyIndexHTMLIntoDistAndStartServer(hashedFileNames);
};

const getSizeColor = (sizeInBytes: number, maxSize: number): string => {
  const ratio = sizeInBytes / maxSize;
  if (ratio < 0.33) return '\x1b[32m'; // green
  if (ratio < 0.66) return '\x1b[33m'; // yellow
  if (ratio < 0.85) return '\x1b[38;5;208m'; // orange
  return '\x1b[31m'; // red
};

const printAllFileSizes = async (): Promise<void> => {
  const { distDir, useGzip } = config;
  const maxSize = Math.max(...fileSizeLog.map((f) => f.sizeInBytes));
  const cyanColor = '\x1b[36m';
  const { reset } = consoleColors;

  for (const { fileName, sizeInBytes } of fileSizeLog) {
    const sizeInKilobytes = sizeInBytes / 1024;
    const sizeColor = getSizeColor(sizeInBytes, maxSize);
    let sizeInfo = `${sizeColor}Size: ${sizeInKilobytes.toFixed(2)} KB${reset}`;
    if (useGzip) {
      const gzipPath = path.join(distDir, fileName + '.gz');
      const brotliPath = path.join(distDir, fileName + '.br');
      const greenColor = '\x1b[32m';

      if (fs.existsSync(gzipPath)) {
        const gzipStats = await fs.promises.stat(gzipPath);
        const gzipSizeKB = gzipStats.size / 1024;
        sizeInfo += ` ${greenColor}(gzip: ${gzipSizeKB.toFixed(2)} KB`;

        if (fs.existsSync(brotliPath)) {
          const brotliStats = await fs.promises.stat(brotliPath);
          const brotliSizeKB = brotliStats.size / 1024;
          sizeInfo += `, br: ${brotliSizeKB.toFixed(2)} KB)`;
        } else {
          sizeInfo += `)`;
        }
        sizeInfo += reset;
      }
    }

    console.info(`${cyanColor}${fileName}${reset}  ${sizeInfo}`);
  }
};

const injectLiveReloadScript = (html: string): string => {
  const script = `<script>new EventSource('/__live-reload').onmessage=()=>location.reload()</script>`;
  return html.replace('</body>', `${script}</body>`);
};
const copyIndexHTMLIntoDistAndStartServer = async (hashedFileNames: Record<string, string | undefined>): Promise<void> => {
  const { inputHTMLFilePath, outputHTMLFilePath, isProd, serve, useGzip, distDir } = config;
  const placeholders: Record<string, string | undefined> = {
    MAIN_JS_FILE_PLACEHOLDER: hashedFileNames.main,
    ROUTER_JS_FILE_PLACEHOLDER: hashedFileNames.router,
    INDEX_JS_FILE_PLACEHOLDER: hashedFileNames.index,
  };
  let data = await fs.promises.readFile(inputHTMLFilePath, 'utf8');
  for (const [placeholder, fileName] of Object.entries(placeholders)) {
    if (fileName) {
      data = data.replace(placeholder, fileName);
    }
  }
  const { injectBootstrapHTML } = await import('../html-bootstrap-injector/html-bootstrap-injector.js');
  let updatedData = injectBootstrapHTML(data);
  const { minifySelectorsInHTML } = await import('../minification/minification.js');
  updatedData = minifySelectorsInHTML(updatedData);
  if (isProd) {
    const { minifyHTML } = await import('../minification/template-minifier.js');
    updatedData = minifyHTML(updatedData);
  }
  if (serve && !isProd) {
    updatedData = injectLiveReloadScript(updatedData);
  }

  await fs.promises.writeFile(outputHTMLFilePath, updatedData, 'utf8');

  const sizeInBytes = Buffer.byteLength(updatedData, 'utf8');
  totalBundleSizeInBytes += sizeInBytes;
  fileSizeLog.push({ fileName: 'index.html', sizeInBytes });

  const totalSizeInKilobytes = totalBundleSizeInBytes / 1024;
  if (useGzip) {
    await gzipDistFiles();
  }
  await printAllFileSizes();
  console.info(consoleColors.green, `=== TOTAL BUNDLE SIZE: ${totalBundleSizeInBytes.toFixed(2)} B (${totalSizeInKilobytes.toFixed(2)} KB) ===`);
  if (useGzip) {
    let totalGzippedSize = 0;
    let totalBrotliSize = 0;
    for (const { fileName } of fileSizeLog) {
      const gzipPath = path.join(distDir, fileName + '.gz');
      const brotliPath = path.join(distDir, fileName + '.br');

      if (fs.existsSync(gzipPath)) {
        const stats = await fs.promises.stat(gzipPath);
        totalGzippedSize += stats.size;
      }

      if (fs.existsSync(brotliPath)) {
        const stats = await fs.promises.stat(brotliPath);
        totalBrotliSize += stats.size;
      }
    }
    const totalGzippedKB = totalGzippedSize / 1024;
    const totalBrotliKB = totalBrotliSize / 1024;
    console.info(consoleColors.green, `=== TOTAL GZIPPED: ${totalGzippedSize.toFixed(2)} B (${totalGzippedKB.toFixed(2)} KB) ===`);
    console.info(consoleColors.green, `=== TOTAL BROTLI: ${totalBrotliSize.toFixed(2)} B (${totalBrotliKB.toFixed(2)} KB) ===`);
  }

  console.info('');

  fileSizeLog.length = 0;

  if (serve && !serverStarted) {
    startServer();
  } else if (serve && !isProd) {
    notifyLiveReloadClients();
  }
};
const promptForPort = (): Promise<number> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${ansi.yellow}Enter a different port number: ${ansi.reset}`, (answer: string) => {
      rl.close();
      const port = parseInt(answer, 10);
      if (isNaN(port) || port < 1 || port > 65535) {
        console.error(consoleColors.red, 'Invalid port number. Please enter a number between 1 and 65535.');
        resolve(promptForPort());
      } else {
        resolve(port);
      }
    });
  });
};
const compressAndServe = (filePath: string, req: http.IncomingMessage, res: http.ServerResponse, contentType: string, cacheControl: string): void => {
  const { useGzip } = config;
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const canCompress = useGzip && !contentType.startsWith('image/') && !contentType.startsWith('video/') && !contentType.startsWith('audio/');

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', cacheControl);

  if (canCompress) {
    res.setHeader('Vary', 'Accept-Encoding');
    if (acceptEncoding.includes('br')) {
      res.setHeader('Content-Encoding', 'br');
      const brotli = zlib.createBrotliCompress({
        params: {
          [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          [zlib.constants.BROTLI_PARAM_LGWIN]: 24,
        },
      });
      fs.createReadStream(filePath).pipe(brotli).pipe(res);
    } else if (acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
      const gzip = zlib.createGzip({ level: 9 });
      fs.createReadStream(filePath).pipe(gzip).pipe(res);
    } else {
      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    fs.createReadStream(filePath).pipe(res);
  }
};

const startServer = (port: number = serverPort): void => {
  const { distDir, isProd } = config;
  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const requestedUrl = req.url || '/';
    const requestedPath = path.join(distDir, requestedUrl);
    const indexPath = path.join(distDir, 'index.html');
    const hasFileExtension = path.extname(requestedUrl).length > 0;
    if (requestedUrl === '/__live-reload' && !isProd) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();
      sseClients.push(res);
      req.on('close', () => {
        sseClients = sseClients.filter((client) => client !== res);
      });
      return;
    }
    if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
      compressAndServe(requestedPath, req, res, getContentType(requestedUrl), 'public, max-age=31536000, immutable');
    }
    else if (!hasFileExtension) {
      compressAndServe(indexPath, req, res, 'text/html', 'no-cache');
    }
    else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  server.on('error', async (err: Error & { code?: string }) => {
    if (err.code === 'EADDRINUSE') {
      console.error(consoleColors.red, `Port ${port} is already in use.`);
      const newPort = await promptForPort();
      startServer(newPort);
    } else {
      throw err;
    }
  });

  const url = `http://localhost:${port}/`;
  server.listen(port, () => {
    if (!isProd) {
      console.info(consoleColors.cyan, 'Live reload enabled');
    }
    console.info(consoleColors.yellow, `Server running at ${url}`);
    console.info('');
    console.info('');
    serverStarted = true;
  });
};
const notifyLiveReloadClients = (): void => {
  for (const client of sseClients) {
    client.write('data: reload\n\n');
  }
};
const recursivelyCopyAssetsIntoDist = async (src: string, dest: string): Promise<void> => {
  await fs.promises.mkdir(dest, { recursive: true });

  try {
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await recursivelyCopyAssetsIntoDist(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  } catch {
  }
};

const watchAndRecursivelyCopyAssetsIntoDist = (src: string, dest: string): void => {
  if (!fs.existsSync(src)) {
    return;
  }

  recursivelyCopyAssetsIntoDist(src, dest);

  fs.watch(src, { recursive: true }, (eventType: string, filename: string | null) => {
    if (filename) {
      const srcPath = path.join(src, filename);
      const destPath = path.join(dest, filename);

      if (eventType === 'change') {
        if (fs.existsSync(srcPath) && fs.lstatSync(srcPath).isDirectory()) {
          recursivelyCopyAssetsIntoDist(srcPath, destPath);
        } else if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
        }
      } else if (eventType === 'rename') {
        if (fs.existsSync(srcPath)) {
          if (fs.lstatSync(srcPath).isDirectory()) {
            recursivelyCopyAssetsIntoDist(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        } else {
          if (fs.existsSync(destPath)) {
            fs.rmSync(destPath, { recursive: true, force: true });
          }
        }
      }
    }
  });
};
const gzipDistFiles = async (): Promise<void> => {
  const { distDir } = config;
  const compressFile = async (filePath: string): Promise<void> => {
    const gzipPath = filePath + '.gz';
    const brotliPath = filePath + '.br';
    await new Promise<void>((resolve, reject) => {
      const readStream = fs.createReadStream(filePath);
      const writeStream = fs.createWriteStream(gzipPath);
      const gzip = zlib.createGzip({ level: 9 }); // Maximum compression

      readStream
        .pipe(gzip)
        .pipe(writeStream)
        .on('finish', () => resolve())
        .on('error', reject);
    });
    await new Promise<void>((resolve, reject) => {
      const content = fs.readFileSync(filePath);
      const brotli = zlib.brotliCompressSync(content, {
        params: {
          [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // Max quality
          [zlib.constants.BROTLI_PARAM_LGWIN]: 24, // Max window
          [zlib.constants.BROTLI_PARAM_LGBLOCK]: 0, // Auto
          [zlib.constants.BROTLI_PARAM_SIZE_HINT]: content.length,
        },
      });
      fs.writeFileSync(brotliPath, brotli);
      resolve();
    });
  };

  const processDirectory = async (dir: string): Promise<void> => {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.isFile() && !entry.name.endsWith('.gz') && !entry.name.endsWith('.br')) {
        const ext = path.extname(entry.name).toLowerCase();
        const compressibleExtensions = ['.html', '.js', '.css', '.json', '.svg', '.txt', '.xml'];

        if (compressibleExtensions.includes(ext)) {
          await compressFile(fullPath);
        }
      }
    }
  };

  console.info(consoleColors.blue, 'Compressing files with gzip and brotli...');
  await processDirectory(distDir);
  console.info(consoleColors.green, 'Compression complete');
};
