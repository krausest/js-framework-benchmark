export interface JSONResult {
    framework: string, benchmark: string, type: string, min: number,
        max: number, mean: number, geometricMean: number,
        standardDeviation: number, median: number, values: Array<number>
}

export let config = {
    REPEAT_RUN: 20,
    DROP_WORST_RUN: 0,
    WARMUP_COUNT: 5,
    TIMEOUT: 60 * 1000,
    LOG_PROGRESS: true,
    LOG_DETAILS: false,
    LOG_DEBUG: false
}

export interface FrameworkData {
    name: string;
    uri: string;
    nonKeyed: boolean;
    useShadowRoot: boolean;
}

interface Options {
    uri: string;
    useShadowRoot? : boolean;
}

function f(name: string, nonKeyed: boolean, options: Options = {uri: null, useShadowRoot: false}): FrameworkData {
    let ret = {name, nonKeyed, uri: options.uri ? options.uri : name, useShadowRoot: options.useShadowRoot};
    return ret;
}

export let frameworks = [
    f("angular-v1.6.3-keyed", false),
    f("angular-v4.1.2-keyed", false),
    f("angular-v4.1.2-non-keyed", true),
    f("aurelia-v1.1.2", true, {uri: "aurelia-v1.1.2/dist"}),
    f("binding.scala-v10.0.1", false, {uri: "binding.scala-v10.0.1/target/web/stage"}),
    f("bobril-v7.1.2", false),
    f("choo-v5.4.0", true),
    f("cyclejs-dom-v17.1.0", true),
    f("datum-v0.8.0", true),
    f("dio-v7.0.1-keyed", false),
    f("dio-v7.0.1-non-keyed", true),
    f("domvm-v3.0.1-non-keyed", true),
    f("domvm-v3.0.1-keyed", false),
    f("ember-v2.13.0", false, {uri: "ember-v2.13.0/dist"}),
    f("elm-v0.18.0", false),
    f("glimmer-v0.3.10", false, {uri: "glimmer-v0.3.10/dist"}),
    f("hyperapp-v0.9.1", true),
    f("inferno-v3.1.2-non-keyed", true),
    f("inferno-v3.1.2-keyed", false),
    f("ivi-v0.7.0", false),
    f("kivi-v1.0.0-rc2", false),
    f("knockout-v3.4.1", false),
    f("marionette-v3.3.1", false),
    f("marko-v4.3.0", false),
    f("mithril-v1.1.1", false),
    f("nx-v1.0.0-beta.2.0.1-keyed", false),
    f("nx-v1.0.0-beta.2.0.1-non-keyed", true),
    f("pico-dom-v1.0.0", false),
    f("plastiq-v1.33.0", false),
    f("polymer-v2.0.0", true, {uri: "polymer-v2.0.0", useShadowRoot: true}),
    f("preact-v7.1.0", false),
    f("ractive-v0.8.12-keyed", false),
    f("ractive-v0.8.12-non-keyed", true),
    f("ractive-edge-keyed", false),
    f("ractive-edge-non-keyed", true),
    f("react-lite-v0.15.30", false),
    f("react-v15.5.4-keyed", false),
    f("react-v15.5.4-non-keyed", true),
    f("react-v15.5.4-easy-state-v1.0.3", false),
    f("react-v15.5.4-mobX-v3.1.9", false),
    f("react-v15.5.4-redux-v3.6.0", false),
    f("react-v16.alpha.13-keyed", false),
    f("redom-v3.0.2-keyed", false),
    f("redom-v3.0.2-non-keyed", true),
    f("riot-v3.5.0", true),
    f("rx-domh-v0.0.2-rxjs-v5.3.0", false),
    f("simulacra-v2.1.1", true),
    f("slim-js-v2.9.1", true),
    f("stem-v0.2.70", true),
    f("surplus-v0.4.0-keyed", false),
    f("surplus-v0.4.0-nonkeyed", true),
    f("svelte-v1.20.2-keyed", false),
    f("svelte-v1.20.2-non-keyed", true),
    f("tsers-v1.0.0", true),
    f("vanillajs-non-keyed", true),
    f("vanillajs-keyed", false),
    f("vidom-v0.9.8", false),
    f("vue-v2.3.3-keyed", false),
    f("vue-v2.3.3-non-keyed", true),
]
