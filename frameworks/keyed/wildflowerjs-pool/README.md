# WildflowerJS (data-pool)

[WildflowerJS](https://wildflowerjs.com) is a reactive JavaScript framework with
no build step and no virtual DOM. Components are plain HTML with attribute
bindings, and state changes flow through a single reactive dependency graph
that updates the real DOM directly.

## The `data-pool` model

This entry uses `data-pool`, a separate reactivity model within the same
framework. Pool entities are addressed directly (`pool.at(i)`, `pool.push()`,
`pool.remove()`), and a mutation is applied by explicitly marking the changed
entity dirty (`pool.markDirty(id)`) instead of being inferred from a general
dependency graph. It was built with high-frequency mutation workloads in mind
(real-time simulations, per-frame updates, large entity sets). That same
directness also makes it a valid, often simpler choice for ordinary lists,
independent of scale.

The sibling entry, `wildflowerjs`, benchmarks WildflowerJS's general-purpose
`data-list` reactivity instead. We felt the two approaches were different
enough to warrant separate entries rather than folding them into one.
