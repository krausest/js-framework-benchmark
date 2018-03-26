export interface JSONResult {
    framework: string, benchmark: string, type: string, min: number,
        max: number, mean: number, geometricMean: number,
        standardDeviation: number, median: number, values: Array<number>
}

export let config = {
    PORT: 8080,
    REPEAT_RUN: 10,
    DROP_WORST_RUN: 0,
    WARMUP_COUNT: 5,
    TIMEOUT: 60 * 1000,
    LOG_PROGRESS: true,
    LOG_DETAILS: false,
    LOG_DEBUG: false,
    EXIT_ON_ERROR: false,
    STARTUP_DURATION_FROM_EVENTLOG: true,
    STARTUP_SLEEP_DURATION: 1000
}

export interface FrameworkData {
    name: string;
    uri: string;
    keyed: boolean;
    useShadowRoot: boolean;
}

interface Options {
    uri: string;
    useShadowRoot? : boolean;
}

function f(name: string, keyed: boolean, options: Options = {uri: null, useShadowRoot: false}): FrameworkData {
    let ret = {name, keyed, uri: options.uri ? options.uri : name, useShadowRoot: options.useShadowRoot};
    return ret;
}

export let frameworks = [
    f("angular-light-v0.14.1-keyed", true),
    f("angular-v1.6.3-keyed", true),
    f("angular-v5.2.2-keyed", true),
    f("angular-v5.2.2-no-zone-keyed", true),
    f("angular-v5.2.2-non-keyed", false),
    f("aurelia-v1.1.5-non-keyed", false),
    f("apprun-v1.8.3-keyed", true),
    f("apprun-v1.8.3-non-keyed", false),
    f("attodom-v0.5.2-keyed", true),
    f("binding.scala-v10.0.1-keyed", true, {uri: "binding.scala-v10.0.1-keyed/target/web/stage"}),
    f("bobril-v8.0.1-keyed", true),
    f("choo-v6.5.0-keyed", true),
    f("cyclejs-dom-v19.3.0-non-keyed", false),
    f("datum-v0.10.0-keyed", true),
    f("dio-v8.1.1-keyed", true),
    f("dio-v8.1.1-non-keyed", false),
    f("dojo2-rc-keyed", true, {uri: "dojo2-rc-keyed/output/dist"}),
    f("dojo2-rc-non-keyed", false, {uri: "dojo2-rc-non-keyed/output/dist"}),
    f("domvm-v3.2.4-non-keyed", false),
    f("domvm-v3.2.4-keyed", true),
    f("elm-v0.18.0-keyed", true),
    f("ember-v3.0.0-keyed", true, {uri: "ember-v3.0.0-keyed/dist"}),
    f("etch-v0.12.5-keyed", true),
    f("etch-v0.12.5-non-keyed", false),
    f("glimmer-v0.9.1-keyed", true, {uri: "glimmer-v0.9.1-keyed/dist"}),
    f("gruu-v1.7.3-non-keyed", false),
    f("halogen-v2.1.0-non-keyed", false),
    f("hyperapp-v1.2.0-non-keyed", false),
    f("hyperapp-v1.2.0-keyed", true),
    f("hyperhtml-v2.4.0-keyed", true),
    f("inferno-v4.0.6-keyed", true),
    f("inferno-v4.0.6-non-keyed", false),
    f("ivi-v0.9.1-keyed", true),
    f("knockout-v3.4.1-keyed", true),
    f("lit-html-v0.9.0-keyed", true),
    f("lit-html-v0.9.0-non-keyed", false),
    f("maik-h-v2.5.2-keyed", true),
    f("maik-h-v2.5.2-non-keyed", false),
    f("marionette-v3.5.1-domapi-keyed", true),
    f("marionette-v3.5.1-keyed", true),
    f("marko-v4.5.6-keyed", true),
    f("maquette-v3.0.1-keyed", true),
    f("mithril-v1.1.1-keyed", true),
    f("moon-v0.11.0", false),
    f("nervjs-v1.2.8-keyed", true),
    f("nx-v1.0.0-beta.2.0.1-keyed", true),
    f("nx-v1.0.0-beta.2.0.1-non-keyed", false),
    f("petit-dom-v0.0.12-keyed", true),
    f("plastiq-v1.33.0-keyed", true),
    f("polymer-v2.0.0-non-keyed", false, {uri: "polymer-v2.0.0-non-keyed/build/es6-bundled", useShadowRoot: true}),
    f("preact-v8.2.6-keyed", true),
    f("pux-v11.0.0-non-keyed", false),
    f("ractive-v0.9.9-keyed", true),
    f("ractive-v0.9.9-non-keyed", false),
    f("ractive-edge-keyed", true),
    f("ractive-edge-non-keyed", false),
    f("react-lite-v0.15.30-keyed", true),
    f("react-v16.1.0-keyed", true),
    f("react-v16.1.0-non-keyed", false),
    f("react-v16.1.0-easy-state-v5.0.0-keyed", true),
    f("react-v16.1.0-mobX-v3.3.1-keyed", true),
    f("react-v16.1.0-redux-v3.7.2-keyed", true),
    f("redom-v3.10.1-keyed", true),
    f("redom-v3.10.1-non-keyed", false),
    f("reflex-dom-v0.4-keyed", true, {uri: "reflex-dom-v0.4-keyed/bundled-dist"}),
    f("riot-v3.7.4-non-keyed", false),
    f("rivets-v0.9.6-non-keyed", false),
    f("rx-domh-v0.0.2-rxjs-v5.3.0-keyed", true),
    f("simulacra-v2.1.5-non-keyed", false),
    f("slim-js-v3.0.2-non-keyed", false),
    f("stem-v0.2.70-non-keyed", false),
    f("surplus-v0.5.0-keyed", true),
    f("surplus-v0.5.0-non-keyed", false),
    f("svelte-v1.58.2-keyed", true),
    f("svelte-v1.58.2-non-keyed", false),
    f("tsers-v1.0.0-non-keyed", false),
    f("thermite-v4.0.0-non-keyed", false),
    f("vanillajs-non-keyed", false),
    f("vanillajs-keyed", true),
    f("vidom-v0.9.8-keyed", true),
    f("san-v3.2.6-non-keyed", false),
    f("vue-v2.5.3-keyed", true),
    f("vue-v2.5.3-non-keyed", false),
    f("vuera-v0.1.3-non-keyed", false),
    f("reagent-v0.8-keyed", true)
]
