/**
 * CLI Types for WCF Build Tool
 */

export interface CLIOptions {
  /** Command to execute */
  command: 'build' | 'dev' | 'serve';
  /** Production mode */
  prod: boolean;
  /** Enable gzip/brotli compression */
  gzip: boolean;
  /** Application name */
  app: string;
  /** Entry point file */
  entry?: string;
  /** Output directory */
  outDir?: string;
  /** Assets source directory */
  assetsDir?: string;
  /** HTML template file */
  htmlTemplate?: string;
  /** Start dev server after build */
  serve: boolean;
  /** Write intermediate files for debugging */
  debugTap: boolean;
}

export interface BuildConfig {
  /** Entry points for the build */
  entryPoints: string[];
  /** Output directory */
  outDir: string;
  /** Assets input directory */
  assetsInputDir?: string;
  /** Assets output directory */
  assetsOutputDir?: string;
  /** Input HTML file path */
  inputHTMLFilePath: string;
  /** Output HTML file path */
  outputHTMLFilePath: string;
  /** Whether in production mode */
  isProd: boolean;
  /** Whether to start dev server */
  serve: boolean;
  /** Whether to use gzip/brotli compression */
  useGzip: boolean;
  /** Whether to write debug tap files */
  debugTap: boolean;
  /** Debug tap output directory */
  debugTapDir: string;
}
