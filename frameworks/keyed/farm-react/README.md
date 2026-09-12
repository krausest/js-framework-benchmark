# Farm.js (React) keyed implementation

[Farm.js](https://farmjs.dev/) with its React renderer and the experimental
ahead-of-time compiler enabled (`mode: "infer"`, `reactivity: "hybrid"`,
`onUnsupported: "error"`).

The component source is idiomatic React (`useState`, keyed `map`) with no
benchmark-specific optimizations. The compiler proves at build time which DOM
targets each state value can reach and emits direct DOM bindings for them;
`onUnsupported: "error"` makes the build fail instead of silently falling back
to baseline React, so this entry always measures the compiled path.
