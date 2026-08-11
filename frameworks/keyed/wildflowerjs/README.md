# WildflowerJS (data-list)

[WildflowerJS](https://wildflowerjs.com) is a reactive JavaScript framework with
no build step and no virtual DOM. Components are plain HTML with attribute
bindings (`data-bind`, `data-model`, `data-action`, `data-list`), and state
changes flow through a single reactive dependency graph that updates the real
DOM directly.

## The `data-list` model

This entry uses `data-list`, WildflowerJS's general-purpose reactive list
rendering. Rows live in a plain state array; the framework diffs and
reconciles the DOM automatically when the array changes, matched by
`data-key`. This is the default, declarative way to render a list in
WildflowerJS and is what most applications use.

A second entry, `wildflowerjs-pool`, benchmarks a different reactivity model
built into the same framework (`data-pool`). It was designed with
high-frequency mutation workloads in mind, and is also a valid, often
simpler choice for ordinary lists. The two approaches are different enough
that we felt they warranted separate entries rather than one.
