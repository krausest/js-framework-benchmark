// Publishes an official release to ../krausest.github.io/js-framework-benchmark
// Usage: npm run release -- <chrome full version> [--year 2026] [--force] [--dry-run]
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, execSync } from "node:child_process";
import { ROOT, BASE_URL, RELEASES_FILE, readReleases, formatReleases, renderOverview } from "./releases.mjs";

const REPO = path.resolve(ROOT, "..");
const SITE_REPO = path.resolve(REPO, "../krausest.github.io");
const SITE = path.join(SITE_REPO, "js-framework-benchmark");
const DIST = path.join(ROOT, "dist");
const APP_TSX = path.join(ROOT, "src/App.tsx");
const OVERVIEW = path.join(ROOT, "overview.html");
const NOT_FOR_YEAR_FOLDER = new Set(["overview.html", "llms.txt", "sitemap.xml"]);

function fail(message) {
  console.error(`release: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { version: undefined, year: new Date().getFullYear(), force: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--year") args.year = Number(argv[++i]);
    else if (arg === "--force") args.force = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (!args.version && !arg.startsWith("--")) args.version = arg;
    else fail(`unknown argument ${arg}`);
  }
  if (!args.version || !/^\d+\.\d+\.\d+\.\d+$/.test(args.version))
    fail("usage: npm run release -- <chrome full version, e.g. 154.0.8037.98> [--year 2026] [--force] [--dry-run]");
  if (!Number.isInteger(args.year) || args.year < 2000) fail(`invalid year ${args.year}`);
  return args;
}

function replaceOrFail(text, re, replacement, what) {
  if (!re.test(text)) fail(`${what} not found`);
  return text.replace(re, replacement);
}

const setVersion = (app, version) =>
  replaceOrFail(app, /const version = "[^"]*";/, `const version = "Chrome ${version}";`, "version in App.tsx");
const setOfficial = (app, official) =>
  replaceOrFail(app, /const isOfficial = (true|false);/, `const isOfficial = ${official};`, "isOfficial in App.tsx");

function git(cwd, ...args) {
  execFileSync("git", args, { cwd, stdio: "inherit" });
}

const args = parseArgs(process.argv.slice(2));
const major = args.version.split(".")[0];
const release = { year: args.year, label: `Chrome ${major}`, path: `${args.year}/chrome${major}.html`, note: "" };
const target = path.join(SITE, release.path);

const releases = readReleases();
if (releases.some((r) => r.path === release.path)) fail(`${release.path} is already in releases.json`);
const newReleases = [release, ...releases];

const original = {
  app: fs.readFileSync(APP_TSX, "utf8"),
  overview: fs.readFileSync(OVERVIEW, "utf8"),
  releases: fs.readFileSync(RELEASES_FILE, "utf8"),
};
const updatedApp = setOfficial(setVersion(original.app, args.version), true);
const updatedOverview = renderOverview(original.overview, newReleases);
const updatedReleases = formatReleases(newReleases);

if (args.dryRun) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "release-"));
  const files = [
    ["App.tsx", original.app, updatedApp],
    ["overview.html", original.overview, updatedOverview],
    ["releases.json", original.releases, updatedReleases],
  ];
  for (const [name, before, after] of files) {
    fs.writeFileSync(path.join(tmp, `${name}.before`), before);
    fs.writeFileSync(path.join(tmp, `${name}.after`), after);
    try {
      execFileSync("git", ["--no-pager", "diff", "--no-index", `${name}.before`, `${name}.after`], {
        cwd: tmp,
        stdio: "inherit",
      });
    } catch {
      // git diff exits with 1 when files differ
    }
  }
  console.log(`\nDry run: would publish ${BASE_URL}${release.path}${fs.existsSync(target) ? " (exists, needs --force)" : ""}`);
  fs.rmSync(tmp, { recursive: true });
  process.exit(0);
}

if (!fs.existsSync(SITE)) fail(`${SITE} not found`);
if (fs.existsSync(target) && !args.force) fail(`${target} already exists, use --force to overwrite`);

let succeeded = false;
try {
  fs.writeFileSync(APP_TSX, updatedApp);
  fs.writeFileSync(RELEASES_FILE, updatedReleases);
  fs.writeFileSync(OVERVIEW, updatedOverview);

  execSync("npm run results", { cwd: REPO, stdio: "inherit" });

  const yearDir = path.join(SITE, String(args.year));
  fs.mkdirSync(yearDir, { recursive: true });
  for (const file of fs.readdirSync(DIST)) {
    if (NOT_FOR_YEAR_FOLDER.has(file) || !fs.statSync(path.join(DIST, file)).isFile()) continue;
    fs.copyFileSync(path.join(DIST, file), file === "index.html" ? target : path.join(yearDir, file));
  }

  // overview becomes the site root, with the local assets it references
  const overview = fs.readFileSync(path.join(DIST, "overview.html"), "utf8");
  const assets = [...overview.matchAll(/(?:href|src)="(?:\.\/)?([^":#?/]+)"/g)]
    .map((m) => m[1])
    .filter((file) => !file.endsWith(".html") && fs.existsSync(path.join(DIST, file)));
  fs.copyFileSync(path.join(DIST, "overview.html"), path.join(SITE, "index.html"));
  for (const file of new Set([...assets, "llms.txt", "sitemap.xml"])) {
    fs.copyFileSync(path.join(DIST, file), path.join(SITE, file));
  }
  succeeded = true;
} finally {
  if (succeeded) {
    fs.writeFileSync(APP_TSX, setOfficial(fs.readFileSync(APP_TSX, "utf8"), false));
  } else {
    // keep the working tree as it was, so the release can simply be run again
    fs.writeFileSync(APP_TSX, original.app.replace(/const isOfficial = true;/, "const isOfficial = false;"));
    fs.writeFileSync(OVERVIEW, original.overview);
    fs.writeFileSync(RELEASES_FILE, original.releases);
    console.error("release: failed, restored App.tsx (isOfficial = false), overview.html and releases.json");
  }
}

const message = `Chrome ${major} results`;
git(SITE_REPO, "add", "js-framework-benchmark");
git(SITE_REPO, "commit", "-m", message);
git(REPO, "add", "-u", "webdriver-ts", "webdriver-ts-results");
git(REPO, "commit", "-m", message);

console.log(`\nPublished ${BASE_URL}${release.path}`);
console.log("Committed in both repositories, review with 'git show' and push when ready.");
