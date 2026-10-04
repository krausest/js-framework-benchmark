// Renders the official release list (releases.json) into overview.html, llms.txt and sitemap.xml.
// Used by the vite plugin below and by release.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.dirname(fileURLToPath(import.meta.url));
export const BASE_URL = "https://krausest.github.io/js-framework-benchmark/";
export const RELEASES_FILE = path.join(ROOT, "releases.json");

/** @typedef {{ year: number, label: string, path: string, note: string }} Release */

/** @returns {Release[]} newest first */
export function readReleases() {
  return JSON.parse(fs.readFileSync(RELEASES_FILE, "utf8"));
}

/** JSON with one release per line */
export function formatReleases(releases) {
  const lines = releases.map(
    (r) =>
      `  { "year": ${r.year}, "label": ${JSON.stringify(r.label)}, "path": ${JSON.stringify(r.path)}, "note": ${JSON.stringify(r.note)} }`,
  );
  return "[\n" + lines.join(",\n") + "\n]\n";
}

const url = (release) => BASE_URL + release.path;

function replaceRegion(text, name, content) {
  const re = new RegExp(`(<!-- ${name}:start[^>]*-->\\n)[\\s\\S]*?(\\n\\s*<!-- ${name}:end -->)`);
  if (!re.test(text)) throw new Error(`Marker region '${name}' not found`);
  return text.replace(re, (_, start, end) => start + content + end);
}

function renderLatest(latest) {
  return `          <h2 id="latest-title">${latest.label}</h2>
          <p>
            The latest published comparison.<br />
            A good place to start exploring.
          </p>
          <a class="primary-link" href="${url(latest)}"
            >Explore results <span aria-hidden="true">↗</span></a
          >`;
}

function renderArchive(releases) {
  const years = [...new Set(releases.map((r) => r.year))];
  return years
    .map((year, i) => {
      const entries = releases.filter((r) => r.year === year);
      const items = entries.map((r) => {
        const meta =
          r === releases[0]
            ? '<span class="release-meta latest-label">Latest official</span>'
            : r.note
              ? `<span class="release-meta">${r.note}</span>`
              : "";
        return `            <li>
              <a href="${url(r)}"
                ><span>${r.label}</span>${meta}</a
              >
            </li>`;
      });
      const count = `${entries.length} release${entries.length === 1 ? "" : "s"}`;
      return `        <details class="archive-year"${i === 0 ? " open" : ""}>
          <summary><span class="year">${year}</span><span class="release-count">${count}</span></summary>
          <ul class="release-list">
${items.join("\n")}
          </ul>
        </details>`;
    })
    .join("\n");
}

export function renderOverview(html, releases) {
  html = replaceRegion(html, "latest", renderLatest(releases[0]));
  return replaceRegion(html, "archive", renderArchive(releases));
}

export function renderLlms(template, releases) {
  const latest = releases[0];
  const line = `- [${latest.label} official results](${url(latest)}): The latest official report listed in the archive; consult the archive for subsequent releases.`;
  if (!template.includes("{{LATEST_LINE}}")) throw new Error("{{LATEST_LINE}} not found in llms.txt template");
  return template.replace("{{LATEST_LINE}}", line);
}

export function renderSitemap(template, releases) {
  const urls = releases.map((r) => `  <url>\n    <loc>${url(r)}</loc>\n  </url>`).join("\n");
  if (!template.includes("<!-- releases -->")) throw new Error("<!-- releases --> not found in sitemap.xml template");
  return template.replace("<!-- releases -->", urls);
}

/** Vite plugin: renders the release list into overview.html and emits llms.txt and sitemap.xml. */
export function releasesPlugin() {
  return {
    name: "releases",
    buildStart() {
      this.addWatchFile(RELEASES_FILE);
    },
    transformIndexHtml(html, ctx) {
      return ctx.filename?.endsWith("overview.html") ? renderOverview(html, readReleases()) : html;
    },
    generateBundle() {
      const releases = readReleases();
      const template = (name) => fs.readFileSync(path.join(ROOT, "templates", name), "utf8");
      this.emitFile({ type: "asset", fileName: "llms.txt", source: renderLlms(template("llms.txt"), releases) });
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: renderSitemap(template("sitemap.xml"), releases) });
    },
  };
}
