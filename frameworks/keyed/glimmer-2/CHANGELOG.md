## v2.0.0-beta.8 (2020-09-02)

#### :rocket: Enhancement
* `@glimmer/component`, `@glimmer/core`, `@glimmer/helper`, `@glimmer/modifier`, `@glimmer/ssr`, `@glimmer/tracking`, `babel-plugins`
  * [#299](https://github.com/glimmerjs/glimmer.js/pull/299) [FEAT] Updates the VM to 0.56.1 ([@pzuraq](https://github.com/pzuraq))

#### :bug: Bug Fix
* `@glimmer/component`
  * [#297](https://github.com/glimmerjs/glimmer.js/pull/297) Add version range to ember-cli-typescript deps ([@ondrejsevcik](https://github.com/ondrejsevcik))

#### :house: Internal
* `@glimmer/component`, `@glimmer/core`, `@glimmer/helper`, `@glimmer/modifier`, `@glimmer/ssr`, `@glimmer/tracking`, `babel-plugins`, `example-apps`
  * [#301](https://github.com/glimmerjs/glimmer.js/pull/301) [FEAT] Upgrade the VM to v0.61.1 ([@pzuraq](https://github.com/pzuraq))
* Other
  * [#287](https://github.com/glimmerjs/glimmer.js/pull/287) Ensure the top level package.json is updated upon release. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 3
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))
- Ondrej Sevcik ([@ondrejsevcik](https://github.com/ondrejsevcik))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v2.0.0-beta.7 (2020-04-20)

#### :boom: Breaking Change
* `@glimmer/component`, `@glimmer/core`, `@glimmer/helper`, `@glimmer/modifier`, `@glimmer/ssr`, `@glimmer/tracking`, `babel-plugins`
  * [#285](https://github.com/glimmerjs/glimmer.js/pull/285) [CHORE] Update to glimmer-vm version 0.51.0 ([@chiragpat](https://github.com/chiragpat))

#### :house: Internal
* `@glimmer/core`
  * [#283](https://github.com/glimmerjs/glimmer.js/pull/283) [Refactor] Updates tests to use tracked utility. ([@rahilvora](https://github.com/rahilvora))

#### Committers: 2
- Chirag Patel ([@chiragpat](https://github.com/chiragpat))
- Rahil Vora ([@rahilvora](https://github.com/rahilvora))

## v2.0.0-beta.6 (2020-04-16)

#### :bug: Bug Fix
* [#274](https://github.com/glimmerjs/glimmer.js/pull/274) [BUGFIX] Ensures interop with Commonjs ([@pzuraq](https://github.com/pzuraq))

#### Committers: 1
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))


## v2.0.0-beta.5 (2020-04-04)

#### :boom: Breaking Change
* `@glimmer/blueprint`, `@glimmer/component`, `@glimmer/core`, `@glimmer/ssr`, `example-apps`
  * [#271](https://github.com/glimmerjs/glimmer.js/pull/271) [BUGFIX][BREAKING] Fixes setComponentTemplate ([@pzuraq](https://github.com/pzuraq))

#### :rocket: Enhancement
* `@glimmer/blueprint`
  * [#270](https://github.com/glimmerjs/glimmer.js/pull/270) Avoid using `&&` in `package.json` scripts. ([@rwjblue](https://github.com/rwjblue))
* `@glimmer/core`
  * [#272](https://github.com/glimmerjs/glimmer.js/pull/272) [BUGFIX] Fixes the types of manager return values ([@pzuraq](https://github.com/pzuraq))

#### :house: Internal
* [#268](https://github.com/glimmerjs/glimmer.js/pull/268) Update dtslint to latest version. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))

## v2.0.0-beta.4 (2020-04-03)

#### :bug: Bug Fix
* `@glimmer/blueprint`
  * [#265](https://github.com/glimmerjs/glimmer.js/pull/265) Add prettier to generated project's package.json. ([@rwjblue](https://github.com/rwjblue))
* `@glimmer/blueprint`, `@glimmer/component`, `@glimmer/core`, `@glimmer/helper`, `@glimmer/ssr`, `@glimmer/tracking`, `babel-plugins`, `example-apps`
  * [#263](https://github.com/glimmerjs/glimmer.js/pull/263) Update to `prettier@2` and ensure it is enforced by `eslint` ([@rwjblue](https://github.com/rwjblue))

#### :memo: Documentation
* `@glimmer/blueprint`, `@glimmer/component`, `@glimmer/tracking`
  * [#266](https://github.com/glimmerjs/glimmer.js/pull/266) Remove outdated information from top level README. ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* Other
  * [#269](https://github.com/glimmerjs/glimmer.js/pull/269) Update release-it-yarn-workspaces to 1.3.0. ([@rwjblue](https://github.com/rwjblue))
  * [#267](https://github.com/glimmerjs/glimmer.js/pull/267) Remove Travis CI setup. ([@rwjblue](https://github.com/rwjblue))
* `@glimmer/blueprint`, `@glimmer/component`, `@glimmer/core`, `@glimmer/helper`, `@glimmer/modifier`, `@glimmer/ssr`, `@glimmer/tracking`, `babel-plugins`, `example-apps`
  * [#264](https://github.com/glimmerjs/glimmer.js/pull/264) Add GitHub Actions CI run. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v2.0.0-beta.3 (2020-04-01)

#### :rocket: Enhancement
* `@glimmer/blueprint`
  * [#262](https://github.com/glimmerjs/glimmer.js/pull/262) Upgrade dependencies to latest version. ([@rwjblue](https://github.com/rwjblue))
  * [#260](https://github.com/glimmerjs/glimmer.js/pull/260) Update typescript related dependencies. ([@rwjblue](https://github.com/rwjblue))
  * [#259](https://github.com/glimmerjs/glimmer.js/pull/259) Update babel related dependencies. ([@rwjblue](https://github.com/rwjblue))
* `babel-plugins`
  * [#256](https://github.com/glimmerjs/glimmer.js/pull/256) Adds a manual `precompileTemplate` API ([@pzuraq](https://github.com/pzuraq))

#### :bug: Bug Fix
* `@glimmer/blueprint`
  * [#261](https://github.com/glimmerjs/glimmer.js/pull/261) Fix versions of @glimmer packages in new project output. ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/core`
  * [#258](https://github.com/glimmerjs/glimmer.js/pull/258) Fix issues with setting a dynamic `<a href="{{@foo}}">` or `<img src="{{@foo}}">` ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/component`, `@glimmer/core`, `@glimmer/helper`, `@glimmer/modifier`, `@glimmer/ssr`, `@glimmer/tracking`
  * [#255](https://github.com/glimmerjs/glimmer.js/pull/255) Fixes inter-package dependencies ([@pzuraq](https://github.com/pzuraq))

#### :memo: Documentation
* `@glimmer/core`, `@glimmer/helper`, `@glimmer/modifier`, `example-apps`
  * [#254](https://github.com/glimmerjs/glimmer.js/pull/254) Update repository URLs for new packages. ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#257](https://github.com/glimmerjs/glimmer.js/pull/257) Update release-it-yarn-workspaces. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v2.0.0-beta.2 (2020-03-31)

Fix a publishing error where cross dependencies were incorrectly published to `2.0.0-beta.1-alpha.1`.

## v2.0.0-beta.1 (2020-03-31)

The first beta for Glimmer.js 2.0! A lot of changes have been made, some of the highlights include:


- Minimal `renderComponent` API!

  ```js
  import { renderComponent } from '@glimmer/core';
  import MyComponent from './MyComponent';

  renderComponent(MyComponent, document.body);
  ```

- Template Import based design - no resolver necessary!
- Standardized build - based on plain JavaScript modules, no need to a custom build pipeline. Use WebPack, Parcel, Rollup, or whatever other build system you want!
- Helper Managers and Modifier Managers added to support custom helpers and modifiers!
- A new blueprint for generating basic Glimmer.js apps!

#### :boom: Breaking Change
* `@glimmer/component`, `@glimmer/core`
  * [#249](https://github.com/glimmerjs/glimmer.js/pull/249) [REFACTOR] Rename Args to TemplateArgs ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/core`
  * [#244](https://github.com/glimmerjs/glimmer.js/pull/244) [BUGFIX] Ensures Strict Mode ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/component`, `@glimmer/core`, `@glimmer/ssr`, `example-apps`
  * [#240](https://github.com/glimmerjs/glimmer.js/pull/240) [FEATURE] Adds Owner ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/blueprint`, `@glimmer/core`, `@glimmer/ssr`
  * [#241](https://github.com/glimmerjs/glimmer.js/pull/241) [CLEANUP] Updates ComponentFactory to ComponentDefinition ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/blueprint`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/core`, `@glimmer/helper`, `@glimmer/modifier`, `@glimmer/ssr`, `@glimmer/test-utils`, `@glimmer/tracking`, `babel-plugins`, `example-apps`
  * [#235](https://github.com/glimmerjs/glimmer.js/pull/235) [BREAKING] Glimmer.js 2.0 ([@pzuraq](https://github.com/pzuraq))

#### :rocket: Enhancement
* `@glimmer/core`, `@glimmer/modifier`, `@glimmer/ssr`, `@glimmer/tracking`
  * [#245](https://github.com/glimmerjs/glimmer.js/pull/245) [FEAT] Modifier Managers ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/core`, `@glimmer/helper`, `example-apps`
  * [#243](https://github.com/glimmerjs/glimmer.js/pull/243) [FEAT] Adds Helpers and HelperManager ([@pzuraq](https://github.com/pzuraq))

#### :bug: Bug Fix
* `@glimmer/core`
  * [#251](https://github.com/glimmerjs/glimmer.js/pull/251) [BUGFIX] Ensure Owner is generic for setManager APIs ([@pzuraq](https://github.com/pzuraq))
  * [#237](https://github.com/glimmerjs/glimmer.js/pull/237) BUGFIX - Prevent duplicate compiled modules in test ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/application`
  * [#234](https://github.com/glimmerjs/glimmer.js/pull/234) Merge pull request #234 from glimmerjs/remove-compiler-from-runtime ([@chadhietala](https://github.com/chadhietala))

#### :house: Internal
* Other
  * [#250](https://github.com/glimmerjs/glimmer.js/pull/250) Add automated release setup. ([@rwjblue](https://github.com/rwjblue))
* `@glimmer/component`, `@glimmer/core`, `@glimmer/helper`, `@glimmer/modifier`, `@glimmer/ssr`, `@glimmer/tracking`, `babel-plugins`
  * [#248](https://github.com/glimmerjs/glimmer.js/pull/248) [CHORE] Update the VM to 0.50.0 ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/blueprint`, `@glimmer/component`
  * [#242](https://github.com/glimmerjs/glimmer.js/pull/242) [UPGRADE] Typescript 3.8 ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/core`, `@glimmer/helper`
  * [#239](https://github.com/glimmerjs/glimmer.js/pull/239) [REFACTOR] Removes most of the remaining custom reference code. ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/blueprint`, `@glimmer/component`, `@glimmer/core`, `@glimmer/helper`, `@glimmer/modifier`, `@glimmer/ssr`, `@glimmer/tracking`, `babel-plugins`
  * [#238](https://github.com/glimmerjs/glimmer.js/pull/238) [REFACTOR] Updates to Glimmer-VM 0.47 ([@pzuraq](https://github.com/pzuraq))

#### Committers: 3
- Chad Hietala ([@chadhietala](https://github.com/chadhietala))
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v1.0.0-beta.2 (2019-11-15)

#### :rocket: Enhancement
* `@glimmer/component`
  * [#224](https://github.com/glimmerjs/glimmer.js/pull/224) [REFACTOR] Removes deprecations and adds usage error messages. ([@pzuraq](https://github.com/pzuraq))
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/ssr`, `@glimmer/tracking`
  * [#223](https://github.com/glimmerjs/glimmer.js/pull/223) Update to Glimmer VM 0.44.0 and migrate tracked implementation to leverage `@glimmer/validator`. ([@pzuraq](https://github.com/pzuraq))

#### :bug: Bug Fix
* `@glimmer/component`
  * [#225](https://github.com/glimmerjs/glimmer.js/pull/225) Removes blueprints from `@glimmer/component`. ([@pzuraq](https://github.com/pzuraq))

#### Committers: 1
- Chris Garrett ([pzuraq](https://github.com/pzuraq))

## v1.0.0-beta.1 (2019-10-23)

#### :boom: Breaking Change
* `@glimmer/application`, `@glimmer/component`, `@glimmer/tracking`
  * [#213](https://github.com/glimmerjs/glimmer.js/pull/213) Remove need for @tracked on getters. ([@tomdale](https://github.com/tomdale))

#### :rocket: Enhancement
* `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/blueprint`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/ssr`, `@glimmer/tracking`
  * [#214](https://github.com/glimmerjs/glimmer.js/pull/214) Implement Ember-compatible Custom Component Manager API. ([@tomdale](https://github.com/tomdale))
* `@glimmer/application`, `@glimmer/component`, `@glimmer/tracking`
  * [#213](https://github.com/glimmerjs/glimmer.js/pull/213) Remove need for @tracked on getters. ([@tomdale](https://github.com/tomdale))

#### :bug: Bug Fix
* `@glimmer/component`
  * [#217](https://github.com/glimmerjs/glimmer.js/pull/217) Moves @glimmer/tracking to devDependencies. ([@pzuraq](https://github.com/pzuraq))

#### :house: Internal
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/ssr`, `@glimmer/tracking`
  * [#212](https://github.com/glimmerjs/glimmer.js/pull/212) Update Glimmer VM to v0.42.0. ([@tomdale](https://github.com/tomdale))

#### Committers: 2
- Chris Garrett ([pzuraq](https://github.com/pzuraq))
- Tom Dale ([tomdale](https://github.com/tomdale))

## v0.14.0-alpha.12 (2019-08-16)

#### :rocket: Enhancement

* `@glimmer/component`
  * [#204](https://github.com/glimmerjs/glimmer.js/pull/204) Adding back didUpdate hook to glimmer.js component-manager. ([@chiragpat](https://github.com/chiragpat))
    * This change also fixes compatibility with Ember 3.13 beta.

#### Committers: 2
- Chirag Patel ([chiragpat](https://github.com/chiragpat))
- Tom Dale ([tomdale](https://github.com/tomdale))

## v0.14.0-alpha.11 (2019-08-10)

#### :rocket: Enhancement
* `@glimmer/tracking`
  * [#202](https://github.com/glimmerjs/glimmer.js/pull/202) Add support for Babel legacy decorators. ([@tomdale](https://github.com/tomdale))

#### Committers: 1

- Tom Dale ([tomdale](https://github.com/tomdale))

## v0.14.0-alpha.10 (2019-08-08)

#### :bug: Bug Fix
* `@glimmer/component`
  * [#201](https://github.com/glimmerjs/glimmer.js/pull/201) Update the assignment of `this.args` to reflect the arg proxy. ([@pzuraq](https://github.com/pzuraq))

#### Committers: 1
- Chris Garrett ([pzuraq](https://github.com/pzuraq))

## v0.14.0-alpha.9 (2019-07-11)

#### :rocket: Enhancement
* `@glimmer/application-test-helpers`, `@glimmer/ssr`
  * [#199](https://github.com/glimmerjs/glimmer.js/pull/199) Modify SSRApplication.renderToString to accept a custom Serializer. ([@SinS3i](https://github.com/SinS3i))

#### Committers: 1
- Kyle Blomquist ([SinS3i](https://github.com/SinS3i))

## v0.14.0-alpha.8 (2019-06-24)

#### :bug: Bug Fix
* `@glimmer/ssr`
  * [#197](https://github.com/glimmerjs/glimmer.js/pull/197) Handle non-primitive values passed as args in SSR. ([@tomdale](https://github.com/tomdale))

#### :house: Internal
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/ssr`, `@glimmer/tracking`
  * [#198](https://github.com/glimmerjs/glimmer.js/pull/198) Upgrade Glimmer VM to v0.41.0. ([@tomdale](https://github.com/tomdale))

#### Committers: 1
- Tom Dale ([tomdale](https://github.com/tomdale))

## v0.14.0-alpha.7 (2019-05-16)

* Re-release of v0.14.0-alpha.6 due to a problem with published artifacts.

## v0.14.0-alpha.6 (2019-05-15)

#### :rocket: Enhancement
* `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/ssr`
  * [#191](https://github.com/glimmerjs/glimmer.js/pull/191) Adding support to pass in a dynamic scope into the ssr glimmer app. ([@chiragpat](https://github.com/chiragpat))

#### Committers: 1
- Chirag Patel ([chiragpat](https://github.com/chiragpat))

## v0.14.0-alpha.5 (2019-05-03)

#### :rocket: Enhancement
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/component`, `@glimmer/ssr`, `@glimmer/test-utils`
  * [#193](https://github.com/glimmerjs/glimmer.js/pull/193) Add JIT mode support for renderComponent. ([@chiragpat](https://github.com/chiragpat))
* `@glimmer/component`
  * [#182](https://github.com/glimmerjs/glimmer.js/pull/182) Make component generic over args. ([@mike-north](https://github.com/mike-north))

#### :house: Internal
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/ssr`, `@glimmer/tracking`
  * [#185](https://github.com/glimmerjs/glimmer.js/pull/185) Bump glimmer-vm to 0.40.1. ([@chiragpat](https://github.com/chiragpat))

#### Committers: 6
- Alex Kanunnikov ([lifeart](https://github.com/lifeart))
- Chirag Patel ([chiragpat](https://github.com/chiragpat))
- Jonathan ([rondale-sc](https://github.com/rondale-sc))
- Julien Palmas ([bartocc](https://github.com/bartocc))
- Mike North ([mike-north](https://github.com/mike-north))
- Tom Dale ([tomdale](https://github.com/tomdale))

## v0.14.0-alpha.4 (2019-03-18)

#### :rocket: Enhancement
* `@glimmer/component`
  * [#178](https://github.com/glimmerjs/glimmer.js/pull/178) [BUGFIX] Freeze args when updating in DEBUG. ([@pzuraq](https://github.com/pzuraq))

#### :bug: Bug Fix
* `@glimmer/component`
  * [#180](https://github.com/glimmerjs/glimmer.js/pull/180) [BUGFIX] Fixes args tracking in Glimmer component. ([@pzuraq](https://github.com/pzuraq))

#### Committers: 1
- Chris Garrett ([pzuraq](https://github.com/pzuraq))

## v0.13.0 (2018-11-05)

#### :boom: Breaking Change
* `@glimmer/blueprint`
  * [#153](https://github.com/glimmerjs/glimmer.js/pull/153) Update blueprint to include tests/index.html.. ([@rondale-sc](https://github.com/rondale-sc))

#### :rocket: Enhancement
* `@glimmer/blueprint`
  * [#153](https://github.com/glimmerjs/glimmer.js/pull/153) Update blueprint to include tests/index.html.. ([@rondale-sc](https://github.com/rondale-sc))
  * [#152](https://github.com/glimmerjs/glimmer.js/pull/152) Bump @glimmer/test-helpers to 0.31.1. ([@rondale-sc](https://github.com/rondale-sc))
* `@glimmer/application`, `@glimmer/component`
  * [#149](https://github.com/glimmerjs/glimmer.js/pull/149) Move `getOwner` out of component manager. ([@smfoote](https://github.com/smfoote))

#### :bug: Bug Fix
* `@glimmer/application`
  * [#134](https://github.com/glimmerjs/glimmer.js/pull/134) await for rerender to finish before changing rendering flag. ([@lifeart](https://github.com/lifeart))
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`
  * [#148](https://github.com/glimmerjs/glimmer.js/pull/148) updates towards noImplicitAny. ([@givanse](https://github.com/givanse))

#### Committers: 4
- Alex Kanunnikov ([lifeart](https://github.com/lifeart))
- Gastón Silva ([givanse](https://github.com/givanse))
- Jonathan ([rondale-sc](https://github.com/rondale-sc))
- Steven ([smfoote](https://github.com/smfoote))

## v0.11.1 (2018-09-20)

#### :rocket: Enhancement
* `@glimmer/component`
  * [#119](https://github.com/glimmerjs/glimmer.js/pull/119) Use WeakMap for storing Glimmer metadata. ([@tomdale](https://github.com/tomdale))

#### :bug: Bug Fix
* `@glimmer/component`
  * [#142](https://github.com/glimmerjs/glimmer.js/pull/142) Auto-track `args`. ([@smfoote](https://github.com/smfoote))
  * [#119](https://github.com/glimmerjs/glimmer.js/pull/119) Use WeakMap for storing Glimmer metadata. ([@tomdale](https://github.com/tomdale))

#### :warning: Deprecation
* `@glimmer/component`
  * [#141](https://github.com/glimmerjs/glimmer.js/pull/141) Add deprecation warning for tracked property dependent keys. ([@smfoote](https://github.com/smfoote))

#### Committers: 3
- Don Denton ([happycollision](https://github.com/happycollision))
- Steven ([smfoote](https://github.com/smfoote))
- Tom Dale ([tomdale](https://github.com/tomdale))

## v0.9.1 (2018-02-15)

#### :house: Internal
* `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`
  * [#113](https://github.com/glimmerjs/glimmer.js/pull/113) Include handle in bytecode data segment metadata. ([@tomdale](https://github.com/tomdale))

#### Committers: 1
- Tom Dale ([tomdale](https://github.com/tomdale))

## v0.9.0 (2018-02-08)

Glimmer.js v0.9.0 is a big infrastructural upgrade that lays the groundwork for
some exciting new features.

The biggest change in 0.9.0 is that we've broken apart the monolithic `Application` class
into composable objects to change how Glimmer.js behaves:

1. A `Renderer` controls how Glimmer performs the initial render.
2. A `Loader` controls how Glimmer loads and compiles templates.
3. A `Builder` controls how DOM elements are constructed when templates are
   rendered.

One benefit of this design is that we can add different modes to Glimmer without
having to ship code for unused modes. For more discussion, see [#34: Separate
Application responsibilities](https://github.com/glimmerjs/glimmer.js/pull/34).

Out of the box, you can experiment with incremental rendering in your Glimmer.js
app using the new `AsyncRenderer`. This renderer breaks initial rendering into
small, discrete units of work. Each unit of work is scheduled using the
browser's [`requestIdleCallback`
API](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback),
ensuring the browser stays responsive even on slower devices and complex pages.

We will also be adding binary bytecode templates and server-side rendering with
rehydration in a future release. The implementation for these features are in
the 0.9.0 release, but not yet integrated into the default application produced
by the blueprint.

To upgrade existing Glimmer.js applications, you will need to update the `src/main.ts` file
to specify the renderer, loader and builder to use. To preserve the rendering behavior
of Glimmer.js 0.8.0, use the `DOMRenderer`, `RuntimeCompilerLoader`, and `SyncRenderer`:

```ts
// src/main.ts
import Application, { DOMBuilder, RuntimeCompilerLoader, SyncRenderer } from '@glimmer/application';
import Resolver, { BasicModuleRegistry } from '@glimmer/resolver';
import moduleMap from '../config/module-map';
import resolverConfiguration from '../config/resolver-configuration';

export default class App extends Application {
  constructor() {
    let moduleRegistry = new BasicModuleRegistry(moduleMap);
    let resolver = new Resolver(resolverConfiguration, moduleRegistry);
    const element = document.body;

    super({
      builder: new DOMBuilder({ element, nextSibling: null }),
      loader: new RuntimeCompilerLoader(resolver),
      renderer: new SyncRenderer(),
      resolver,
      rootName: resolverConfiguration.app.rootName,
    });
  }
}
```

## v0.9.0-alpha.14 (2018-02-08)

#### :rocket: Enhancement
* `@glimmer/blueprint`
  * [#109](https://github.com/glimmerjs/glimmer.js/pull/109) Fix Yarn failure + other updates. ([@tomdale](https://github.com/tomdale))
* `@glimmer/application`
  * [#107](https://github.com/glimmerjs/glimmer.js/pull/107) Use non-volatile UpdatableReference from @glimmer/component. ([@tomdale](https://github.com/tomdale))
  * [#104](https://github.com/glimmerjs/glimmer.js/pull/104) Unify Loader Interface. ([@chadhietala](https://github.com/chadhietala))
  * [#97](https://github.com/glimmerjs/glimmer.js/pull/97) Don't use rAF for scheduling re-render. ([@chadhietala](https://github.com/chadhietala))

#### :memo: Documentation
* `@glimmer/application`
  * [#108](https://github.com/glimmerjs/glimmer.js/pull/108) Inline API docs for @glimmer/application. ([@tomdale](https://github.com/tomdale))
* `@glimmer/component`
  * [#53](https://github.com/glimmerjs/glimmer.js/pull/53) Update and improve Component documentation. ([@locks](https://github.com/locks))

#### :house: Internal
* `@glimmer/blueprint`
  * [#106](https://github.com/glimmerjs/glimmer.js/pull/106) add set -e to fail early. ([@kellyselden](https://github.com/kellyselden))
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/ssr`
  * [#105](https://github.com/glimmerjs/glimmer.js/pull/105) Bump glimmer-vm to 0.30.5. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/app-compiler`
  * [#93](https://github.com/glimmerjs/glimmer.js/pull/93) Implicit 'projectPath' for Broccoli Plugin. ([@chadhietala](https://github.com/chadhietala))

#### Committers: 4
- Chad Hietala ([chadhietala](https://github.com/chadhietala))
- Kelly Selden ([kellyselden](https://github.com/kellyselden))
- Ricardo Mendes ([locks](https://github.com/locks))
- Tom Dale ([tomdale](https://github.com/tomdale))


## v0.9.0-alpha.13 (2017-12-09)

#### :rocket: Enhancement
* `@glimmer/application-test-helpers`, `@glimmer/application`
  * [#96](https://github.com/glimmerjs/glimmer.js/pull/96) Helpers should not be volatile. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/blueprint`
  * [#87](https://github.com/glimmerjs/glimmer.js/pull/87) Import `@glimmer/blueprint` into monorepo. ([@Turbo87](https://github.com/Turbo87))

#### :bug: Bug Fix
* `@glimmer/application`
  * [#95](https://github.com/glimmerjs/glimmer.js/pull/95) Use Glimmer.js version of UpdatableReference to avoid action volatility. ([@tomdale](https://github.com/tomdale))

#### Committers: 3
- Chad Hietala ([chadhietala](https://github.com/chadhietala))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
- Tom Dale ([tomdale](https://github.com/tomdale))


## v0.9.0-alpha.12 (2017-11-28)

#### :bug: Bug Fix
* `@glimmer/application`, `@glimmer/compiler-delegates`
  * [#91](https://github.com/glimmerjs/glimmer.js/pull/91) Confirm dynamic invocations work post-refactor. ([@chadhietala](https://github.com/chadhietala))

#### Committers: 1
- Chad Hietala ([chadhietala](https://github.com/chadhietala))


## v0.9.0-alpha.10 (2017-11-28)

#### :rocket: Enhancement
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`
  * [#89](https://github.com/glimmerjs/glimmer.js/pull/89) Refactor Data Segment. ([@chadhietala](https://github.com/chadhietala))

#### :house: Internal
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/ssr`
  * [#90](https://github.com/glimmerjs/glimmer.js/pull/90) Update @glimmer/vm packages. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/application-test-helpers`, `@glimmer/component`
  * [#85](https://github.com/glimmerjs/glimmer.js/pull/85) Remove unused/duplicate dev dependencies. ([@Turbo87](https://github.com/Turbo87))
* Other
  * [#80](https://github.com/glimmerjs/glimmer.js/pull/80) Remove unused `emberjs-build` dependency. ([@Turbo87](https://github.com/Turbo87))
  * [#83](https://github.com/glimmerjs/glimmer.js/pull/83) TravisCI improvements. ([@Turbo87](https://github.com/Turbo87))
  * [#84](https://github.com/glimmerjs/glimmer.js/pull/84) Update broccoli dependencies. ([@Turbo87](https://github.com/Turbo87))
* `@glimmer/app-compiler`
  * [#82](https://github.com/glimmerjs/glimmer.js/pull/82) app-compiler: Remove unnecessary `co` dependency. ([@Turbo87](https://github.com/Turbo87))
* `@glimmer/app-compiler`, `@glimmer/compiler-delegates`
  * [#81](https://github.com/glimmerjs/glimmer.js/pull/81) Replace deprecated `qunitjs` dependency with `qunit`. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 2
- Chad Hietala ([chadhietala](https://github.com/chadhietala))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v0.9.0-alpha.9 (2017-11-16)

#### :rocket: Enhancement
* `@glimmer/application`
  * [#75](https://github.com/glimmerjs/glimmer.js/pull/75) Actually Expose The Rehydrating Builder. ([@chadhietala](https://github.com/chadhietala))

#### Committers: 1
- Chad Hietala ([chadhietala](https://github.com/chadhietala))


## v0.9.0-alpha.8 (2017-11-15)

#### :bug: Bug Fix
* `@glimmer/compiler-delegates`
  * [#74](https://github.com/glimmerjs/glimmer.js/pull/74) BUGFIX: Builtin helpers and app helpers serialization. ([@chadhietala](https://github.com/chadhietala))

#### Committers: 1
- Chad Hietala ([chadhietala](https://github.com/chadhietala))


## v0.9.0-alpha.7 (2017-11-15)

#### :house: Internal
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`
  * [#73](https://github.com/glimmerjs/glimmer.js/pull/73) Add End To End Smoke Test. ([@chadhietala](https://github.com/chadhietala))

#### Committers: 1
- Chad Hietala ([chadhietala](https://github.com/chadhietala))


## v0.9.0-alpha.6 (2017-11-13)

#### :bug: Bug Fix
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`
  * [#69](https://github.com/glimmerjs/glimmer.js/pull/69) Fix serialization. ([@chadhietala](https://github.com/chadhietala))

#### Committers: 1
- Chad Hietala ([chadhietala](https://github.com/chadhietala))


## v0.9.0-alpha.5 (2017-11-09)

#### :rocket: Enhancement
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/ssr`
  * [#66](https://github.com/glimmerjs/glimmer.js/pull/66) Improve bytecode compilation. ([@tomdale](https://github.com/tomdale))

#### :house: Internal
* `@glimmer/application`
  * [#65](https://github.com/glimmerjs/glimmer.js/pull/65) Remove dependency on @glimmer/test-helpers. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/compiler-delegates`
  * [#64](https://github.com/glimmerjs/glimmer.js/pull/64) Data Segment Generation Tests. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/app-compiler`, `@glimmer/compiler-delegates`
  * [#60](https://github.com/glimmerjs/glimmer.js/pull/60) Add more tests for 3rd party builtins. ([@chadhietala](https://github.com/chadhietala))

#### Committers: 4
- Chad Hietala ([chadhietala](https://github.com/chadhietala))
- Tom Dale ([tomdale](https://github.com/tomdale))
- Toran Billups ([toranb](https://github.com/toranb))
- [OlmoDalco](https://github.com/OlmoDalco)


## v0.9.0-alpha.4 (2017-10-30)

#### :rocket: Enhancement
* `@glimmer/app-compiler`, `@glimmer/application`, `@glimmer/compiler-delegates`
  * [#59](https://github.com/glimmerjs/glimmer.js/pull/59) Allow for host to pass builtin names. ([@chadhietala](https://github.com/chadhietala))

#### Committers: 1
- Chad Hietala ([chadhietala](https://github.com/chadhietala))


## v0.9.0-alpha.3 (2017-10-30)

#### :house: Internal
* `@glimmer/application`
  * [#57](https://github.com/glimmerjs/glimmer.js/pull/57) Remove unused Component import. ([@chadhietala](https://github.com/chadhietala))
  * [#55](https://github.com/glimmerjs/glimmer.js/pull/55) Type Notifier. ([@chadhietala](https://github.com/chadhietala))

#### Committers: 1
- Chad Hietala ([chadhietala](https://github.com/chadhietala))


## v0.9.0-alpha.2 (2017-10-30)

#### :rocket: Enhancement
* `@glimmer/application`, `@glimmer/component`
  * [#51](https://github.com/glimmerjs/glimmer.js/pull/51) Optimize template-only components. ([@tomdale](https://github.com/tomdale))
  * [#47](https://github.com/glimmerjs/glimmer.js/pull/47) Adding guards to component manager. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`
  * [#50](https://github.com/glimmerjs/glimmer.js/pull/50) Update glimmer-vm packages to 0.29.9. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/component`, `@glimmer/test-utils`
  * [#46](https://github.com/glimmerjs/glimmer.js/pull/46) Async Boot. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/application`, `@glimmer/ssr`
  * [#45](https://github.com/glimmerjs/glimmer.js/pull/45) Introduce Builders. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/app-compiler`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`
  * [#39](https://github.com/glimmerjs/glimmer.js/pull/39) Broccoli bundle compiler. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/application`
  * [#34](https://github.com/glimmerjs/glimmer.js/pull/34) Separate Application responsibilities. ([@tomdale](https://github.com/tomdale))
* `@glimmer/compiler-delegates`
  * [#25](https://github.com/glimmerjs/glimmer.js/pull/25) Introduce @glimmer/compiler-delegates. ([@chadhietala](https://github.com/chadhietala))

#### :bug: Bug Fix
* `@glimmer/app-compiler`, `@glimmer/compiler-delegates`
  * [#54](https://github.com/glimmerjs/glimmer.js/pull/54) [BUGFIX] Fix data segment generation. ([@chadhietala](https://github.com/chadhietala))

#### :house: Internal
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/ssr`
  * [#52](https://github.com/glimmerjs/glimmer.js/pull/52) Bump Glimmer-VM deps to 0.29.10. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/app-compiler`, `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/compiler-delegates`, `@glimmer/component`, `@glimmer/test-utils`
  * [#44](https://github.com/glimmerjs/glimmer.js/pull/44) Fix publishing. ([@chadhietala](https://github.com/chadhietala))


## v0.8.0 (2017-10-22)

We've got some big changes in v0.8.0 of Glimmer.js! The most notable change is
that we have migrated from dasherized components (`x-profile`) to capitalized
components (`Profile`). Multi-word components should be capitalized too, so
`user-profile` becomes `UserProfile`.

To upgrade existing Glimmer.js applications to 0.8.0, perform the following steps:

1. Modify your application's `package.json`:
    1. `@glimmer/application` should be `^0.8.0`.
    2. `@glimmer/component` should be `^0.8.0` (you may need to add this
     dependency).
2. Rename component files from dasherized to CapitalCase. For example, the
     `src/ui/components/user-profile` directory should be renamed to
     `src/ui/components/UserProfile`.
3. Change all component invocations from dasherized to `CapitalCase`. For
   example, change `<user-profile @user={{user}} />` to
   `<UserProfile @user={{user}} />`.

These are all of the changes that should be necessary to migrate an existing
app.

We've also introduced a new feature that makes it easier to take control of HTML
attributes. In 0.8.0, you can add `...attributes` to an element in a component's template,
and any attributes passed to the component will be applied to that element.

For example, imagine you have a `ProfileImage` component whose template contains
an `img` tag. You want anyone using this component to be able to treat it just
like an `img` element, including being able to set standard HTML attributes on
it. We'll add `...attributes` to the target element, like this:

```hbs
{{! src/ui/components/ProfileImage/template.hbs }}
<img ...attributes>
```

Now when invoking the component, any HTML attributes (i.e. anything without a `@` prefix) will be
transferred to the element with `...attributes` on it:

```hbs
{{! src/ui/components/Main/template.hbs }}
<ProfileImage
  @isAdmin={{isAdmin}} {{! not an attribute! }}
  src={{user.imageUrl}}
  role="complementary"
  data-is-awesome="yes-is-awesome"
  />
```

The final DOM will look something like this:

```html
<img
  src="/images/profiles/chad.jpg"
  role="complementary"
  data-is-awesome="yes-is-awesome">
```

For more information on these and other changes in Glimmer.js, make sure to
read the [Glimmer.js Progress
Report](https://emberjs.com/blog/2017/10/10/glimmer-progress-report.html) blog
post.

Note that 0.8.0 lays the foundation for compiling to binary bytecode, but does
not yet enable it. Expect this functionality to be enabled in a future release,
now that the requisite version of the underlying Glimmer compiler and VM have
been upgraded.

#### :bug: Bug Fix
* `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/component`
  * [#26](https://github.com/glimmerjs/glimmer.js/pull/26) Fix incompatibility with {{each}} and frozen objects. ([@tomdale](https://github.com/tomdale))

#### :house: Internal
* Other
  * [#32](https://github.com/glimmerjs/glimmer.js/pull/32) Update "lerna-changelog" to v0.7.0. ([@Turbo87](https://github.com/Turbo87))
  * [#27](https://github.com/glimmerjs/glimmer.js/pull/27) Add Changelog. ([@Turbo87](https://github.com/Turbo87))
* `@glimmer/application`, `@glimmer/component`
  * [#30](https://github.com/glimmerjs/glimmer.js/pull/30) Support running tests in the browser, Node, or both. ([@tomdale](https://github.com/tomdale))
* `@glimmer/application`, `@glimmer/component`, `@glimmer/local-debug-flags`
  * [#29](https://github.com/glimmerjs/glimmer.js/pull/29) Run tests in production and development modes. ([@tomdale](https://github.com/tomdale))

#### Committers: 2
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
- Tom Dale ([tomdale](https://github.com/tomdale))


## v0.8.0-alpha.10 (2017-10-17)

#### :house: Internal
* `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/component`, `@glimmer/test-utils`
  * [#24](https://github.com/glimmerjs/glimmer.js/pull/24) Use Rollup to build test suite. ([@tomdale](https://github.com/tomdale))

#### Committers: 1
- Tom Dale ([tomdale](https://github.com/tomdale))


## v0.8.0-alpha.9 (2017-10-12)

#### :bug: Bug Fix
* `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/component`, `@glimmer/test-utils`
  * [#23](https://github.com/glimmerjs/glimmer.js/pull/23) Fix dependencies and add failing tests for block params and user helpers. ([@chadhietala](https://github.com/chadhietala))

#### :house: Internal
* [#15](https://github.com/glimmerjs/glimmer.js/pull/15) Use yarn to install package dependencies. ([@tomdale](https://github.com/tomdale))

#### Committers: 2
- Chad Hietala ([chadhietala](https://github.com/chadhietala))
- Tom Dale ([tomdale](https://github.com/tomdale))


## v0.8.0-alpha.8 (2017-10-06)

#### :bug: Bug Fix
* [#21](https://github.com/glimmerjs/glimmer.js/pull/21) Bump @glimmer/compiler dependency to 0.29.3. ([@tomdale](https://github.com/tomdale))

#### Committers: 1
- Tom Dale ([tomdale](https://github.com/tomdale))


## v0.8.0-alpha.7 (2017-09-29)

#### :rocket: Enhancement
* `@glimmer/application`
  * [#20](https://github.com/glimmerjs/glimmer.js/pull/20) Fix assertion error message. ([@tomdale](https://github.com/tomdale))

#### Committers: 1
- Tom Dale ([tomdale](https://github.com/tomdale))


## v0.8.0-alpha.6 (2017-09-28)

#### :rocket: Enhancement
* `@glimmer/component`
  * [#19](https://github.com/glimmerjs/glimmer.js/pull/19) Implement component `bounds` feature. ([@tomdale](https://github.com/tomdale))

#### Committers: 1
- Tom Dale ([tomdale](https://github.com/tomdale))


## v0.8.0-alpha.5 (2017-09-26)

#### :bug: Bug Fix
* `@glimmer/application`
  * [#17](https://github.com/glimmerjs/glimmer.js/pull/17) Fix issue with identifyComponent. ([@tomdale](https://github.com/tomdale))

#### Committers: 1
- Tom Dale ([tomdale](https://github.com/tomdale))


## v0.8.0-alpha.2 (2017-09-26)

#### :bug: Bug Fix
* `@glimmer/component`
  * [#16](https://github.com/glimmerjs/glimmer.js/pull/16) Break RuntimeResolver circular dependency. ([@tomdale](https://github.com/tomdale))

#### Committers: 1
- Tom Dale ([tomdale](https://github.com/tomdale))

## v0.8.0-alpha.1 (2017-10-17)

#### :rocket: Enhancement
* `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/component`
  * [#13](https://github.com/glimmerjs/glimmer.js/pull/13) Update glimmer-vm to 0.29.0. ([@chadhietala](https://github.com/chadhietala))
* `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/component`, `@glimmer/test-utils`
  * [#10](https://github.com/glimmerjs/glimmer.js/pull/10) Compatibility with Glimmer VM 0.28. ([@tomdale](https://github.com/tomdale))

#### :memo: Documentation
* [#2](https://github.com/glimmerjs/glimmer.js/pull/2) Add Glimmer VM link. ([@MaXFalstein](https://github.com/MaXFalstein))
* [#1](https://github.com/glimmerjs/glimmer.js/pull/1) Add description of subpackages to README. ([@tomdale](https://github.com/tomdale))

#### :house: Internal
* `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/component`, `@glimmer/test-utils`
  * [#24](https://github.com/glimmerjs/glimmer.js/pull/24) Use Rollup to build test suite. ([@tomdale](https://github.com/tomdale))
* `@glimmer/application-test-helpers`, `@glimmer/application`, `@glimmer/component`, `@glimmer/local-debug-flags`, `@glimmer/test-utils`
  * [#3](https://github.com/glimmerjs/glimmer.js/pull/3) [Monorepo] Adopt @glimmer/component and @glimmer/application. ([@tomdale](https://github.com/tomdale))

#### Committers: 3
- Chad Hietala ([chadhietala](https://github.com/chadhietala))
- MaX Falstein ([MaXFalstein](https://github.com/MaXFalstein))
- Tom Dale ([tomdale](https://github.com/tomdale))
