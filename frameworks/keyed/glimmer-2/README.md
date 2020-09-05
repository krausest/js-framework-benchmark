# Glimmer.js

Welcome to Glimmer.js! Glimmer.js is actually a made up of lots of small
packages, so this meta-repo exists to help you find what you're looking for.

## Resources

- [Guides](https://glimmerjs.com/guides)
- [API Docs](https://glimmerjs.com/api/)
- [Glimmer Playground](https://glimmer-playground.netlify.com)

## Packages

Glimmer.js is the developer-facing API on top of the low-level [Glimmer VM](https://github.com/glimmerjs/glimmer-vm).

### User-Facing

These packages are imported and used by Glimmer developers directly.

- [`@glimmer/component`] - defines the Glimmer component base class and component lifecycle
- [`@glimmer/tracking`] - defines the Glimmer property change tracking system

[`@glimmer/component`]: https://github.com/glimmerjs/glimmer.js/tree/master/packages/%40glimmer/component
[`@glimmer/tracking`]: https://github.com/glimmerjs/glimmer.js/tree/master/packages/%40glimmer/tracking

## Tests

### Type Tests

The following packages are committed to maintaining stable Typescript types in
addition to their JavaScript API:

* `@glimmer/component`
* `@glimmer/tracking`

Any changes to their types, _including_ changes caused by upgrading the
Typescript compiler, are covered under SemVer for these packages (e.g. breaking
changes to types will require a new major version).

In order to ensure we aren't making changes to types unintentionally, we have a
set of tests for their public APIs in `/test/types`. These can be run with:

```sh
yarn build
yarn test:types
```

In general, any new additions to the public types should be a new _minor version_,
and removals of public APIs or changes to the versions of TS that are supported
should be a _major version_. Corrections to existing types that are
_not breaking_ (e.g. strictly equal to or wider than the current type) can be
released in _patch versions_.

To add a new API:

1. Add it to any `hasExactKeys` statements that assert on the keys of a public
   value/type
2. Add an `$ExpectType` test for the new API to ensure it has the correct type.

To remove an API:

1. Remove it from any `hasExactKeys` statements
2. Remove any `$ExpectType` tests related to it

#### Symbols

Symbols are often used for internal state that is only accessible within a
framework. We use a few symbols internally in these packages, and because of
this they appear in the public type signatures, and assertions. However, unless
the symbol itself is part of the public JS API of the package, these properties
are _inacessible_ to users, and thus they are not part of public API, and any
changes can be made and released in a patch release.
