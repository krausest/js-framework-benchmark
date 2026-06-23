# keyed/marko-local

Identical to [`keyed/marko`](../marko), except its Marko dependencies are
replaced with a **production build of a local Marko checkout**. This makes it
easy to benchmark in-progress changes to Marko against the published release
(`keyed/marko`) side by side.

## Usage

```sh
# 1. Build the local Marko, vendor it into .local/, and install.
npm run link-local

# 2. Build the benchmark app.
npm run build-prod
```

By default `link-local` expects the Marko checkout to live next to this
benchmark repo (i.e. `../marko` relative to the repo root). Point it elsewhere
with the `MARKO_REPO` env var:

```sh
MARKO_REPO=/path/to/marko npm run link-local
```

Re-run `npm run link-local` whenever the local Marko changes to refresh the
comparison.

## How it works

`link-local-marko.mjs`:

1. Builds `@marko/compiler` and `@marko/runtime-tags` in the Marko checkout.
2. Runs Marko's own `scripts/pkg-override` so the packages' `exports`/`main`
   resolve to their production `dist/` output (the same swap Marko does on
   publish), vendors them into `.local/` (gitignored), then reverts the swap so
   the Marko checkout is left untouched.
3. Installs this app so the `file:` deps in `package.json` resolve to the
   vendored copies.

`.local/`, `node_modules/`, `dist/`, and `package-lock.json` are all generated
and gitignored — only the app source and the link script are committed.
