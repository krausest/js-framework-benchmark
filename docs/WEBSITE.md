# Results website

The official website is hosted at <https://krausest.github.io/js-framework-benchmark/> in the separate `krausest.github.io` repository. This repository contains its static overview and the interactive results application.

## Develop and build

From the repository root, with the results application's dependencies installed:

```sh
npm --prefix webdriver-ts-results run dev
```

Open `/overview.html` on the URL printed by Vite for the homepage, or `/index.html` for the interactive results. The homepage's development snapshot link stays on the same site: Vite serves the results app at `/current.html` through its HTML fallback during development and preview. The publishing step below creates that file explicitly. Official report links point to the published website; historical reports are maintained in the Pages repository.

```sh
npm --prefix webdriver-ts-results run build
npm --prefix webdriver-ts-results run preview
```

The build produces both HTML entry points in `webdriver-ts-results/dist/`. The list of official releases lives in `webdriver-ts-results/releases.json` (newest first). The Vite plugin in `releases.mjs` renders it into the marked regions of `overview.html` and generates `dist/sitemap.xml` and `dist/llms.txt` from `webdriver-ts-results/templates/`. Preview `/overview.html` before preparing a website update. Building and previewing do not publish anything.

## Publishing

Both workflows use a sibling checkout at `../krausest.github.io`. Historical report files stay in their existing year directories. Keep the relative asset URLs so the build works under `/js-framework-benchmark/`.

### Development snapshot

`push_results.sh` publishes a snapshot of an existing build. It copies `dist/index.html` to `js-framework-benchmark/current.html` together with the generated JavaScript and CSS, then commits and pushes the Pages repository. It does not touch the homepage, sitemap or `llms.txt`.

### Official release

```sh
npm --prefix webdriver-ts-results run release -- <chrome full version> [--year 2026] [--force] [--dry-run]
```

The release script sets the version and `isOfficial` in `src/App.tsx`, adds the release to `releases.json`, runs `npm run results` and publishes:

| Build output                           | Pages repository destination                         |
| -------------------------------------- | ---------------------------------------------------- |
| `dist/index.html`                      | `js-framework-benchmark/<year>/chrome<major>.html`   |
| Generated JavaScript and CSS           | `js-framework-benchmark/<year>/`                     |
| `dist/overview.html`                   | `js-framework-benchmark/index.html`                  |
| `dist/index.html`                      | `js-framework-benchmark/current.html`                |
| Generated JavaScript and CSS           | `js-framework-benchmark/`                            |
| `dist/sitemap.xml` and `dist/llms.txt` | `js-framework-benchmark/`                            |

Afterwards it resets `isOfficial` to `false` and commits locally in the Pages repository and in this repository (tracked files under `webdriver-ts` and `webdriver-ts-results` only). It does not push. Use `--dry-run` to see the changes to `App.tsx`, `overview.html` and `releases.json` without building or publishing.

## Metadata and archive maintenance

- Edit `webdriver-ts-results/overview.html` for homepage content, canonical URL, social previews and JSON-LD. The homepage canonical is `https://krausest.github.io/js-framework-benchmark/`.
- Official releases are added by the release script. To correct an entry (e.g. add a note like `macOS · Keyed only`), edit `releases.json`; don't edit the generated regions of `overview.html` between the `latest:` and `archive:` markers.
- Keep the current development snapshot separate from official releases. It may contain mixed browser versions or different numbers of runs.
- The sitemap includes the homepage, current snapshot and official reports hosted under this site's path. Older reports hosted on `stefankrause.net` remain linked in the archive but are outside this sitemap. Do not invent modification dates.
- `llms.txt` is a concise guide to results and methodology for agents. It does not replace the sitemap or control crawler access, and it does not guarantee search visibility.

Before publishing, check mobile and desktop layouts, keyboard focus, the page without JavaScript, archive links, JSON-LD syntax, sitemap XML and asset loading at the final subdirectory path. After publication, verify the canonical URLs and submit the sitemap through the site's search engine webmaster tools if available.

## Host-level robots.txt

The effective robots file must be served at **`https://krausest.github.io/robots.txt`**, in the root of the Pages repository. A file at `/js-framework-benchmark/robots.txt` does not control crawler access to this project.

Use `webdriver-ts-results/robots.txt` as a template. It is not copied by the build or publishing scripts. The maintainer of the Pages host must review and merge it with any existing root rules because that file applies to every project on `krausest.github.io`. Include this sitemap declaration in the root file:

```text
Sitemap: https://krausest.github.io/js-framework-benchmark/sitemap.xml
```

The site's `llms.txt` can remain under `/js-framework-benchmark/`; its scope is described by its location and the homepage's `rel="describedby"` link.

References: [Google robots.txt location requirements](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), and the [llms.txt proposal](https://llmstxt.org/).
