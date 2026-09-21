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

The build produces both HTML entry points in `webdriver-ts-results/dist/`. Vite copies `public/sitemap.xml` and `public/llms.txt` into that directory. Preview `/overview.html` before preparing a website update. Building and previewing do not publish anything.

## Publishing layout

The `push_results.sh` workflow uses a sibling checkout at `../krausest.github.io`. Its website files map as follows:

| Build output                           | Pages repository destination          |
| -------------------------------------- | ------------------------------------- |
| `dist/overview.html`                   | `js-framework-benchmark/index.html`   |
| `dist/index.html`                      | `js-framework-benchmark/current.html` |
| Generated JavaScript and CSS           | `js-framework-benchmark/`             |
| `dist/sitemap.xml` and `dist/llms.txt` | `js-framework-benchmark/`             |

`push_results.sh` copies these files, stages them, commits and pushes the Pages repository. Run it only when ready to publish. To prepare a review without publishing, copy the files according to the table and inspect the diff in the Pages checkout first. Historical report files stay in their existing year directories. Keep the relative asset URLs so the build works under `/js-framework-benchmark/`.

## Metadata and archive maintenance

- Edit `webdriver-ts-results/overview.html` for homepage content, canonical URL, social previews and JSON-LD. The homepage canonical is `https://krausest.github.io/js-framework-benchmark/`.
- When adding an official release, update its featured link and archive entry in `overview.html`, add its absolute URL to `public/sitemap.xml`, and update the featured report in `public/llms.txt` together.
- Keep the current development snapshot separate from official releases. It may contain mixed browser versions or different numbers of runs.
- The sitemap includes the homepage, current snapshot and official reports hosted under this site's path. Older reports hosted on `stefankrause.net` remain linked in the archive but are outside this sitemap. Do not invent modification dates.
- `llms.txt` is a concise guide to results and methodology for agents. It does not replace the sitemap or control crawler access, and it does not guarantee search visibility.

Before publishing, check mobile and desktop layouts, keyboard focus, the page without JavaScript, archive links, JSON-LD syntax, sitemap XML and asset loading at the final subdirectory path. After publication, verify the canonical URLs and submit the sitemap through the site's search engine webmaster tools if available.

## Host-level robots.txt

The effective robots file must be served at **`https://krausest.github.io/robots.txt`**, in the root of the Pages repository. A file at `/js-framework-benchmark/robots.txt` does not control crawler access to this project.

Use `webdriver-ts-results/robots.txt` as a template. It is outside `public/` and is not copied by the build or publishing script. The maintainer of the Pages host must review and merge it with any existing root rules because that file applies to every project on `krausest.github.io`. Include this sitemap declaration in the root file:

```text
Sitemap: https://krausest.github.io/js-framework-benchmark/sitemap.xml
```

The site's `llms.txt` can remain under `/js-framework-benchmark/`; its scope is described by its location and the homepage's `rel="describedby"` link.

References: [Google robots.txt location requirements](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), and the [llms.txt proposal](https://llmstxt.org/).
