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
    LOG_DEBUG: false,
    EXIT_ON_ERROR: false
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
    f("angular-v1.6.3-keyed", true),
    f("angular-v4.3.3-keyed", true),
    f("angular-v4.3.3-no-zone-keyed", true),
    f("angular-v4.3.3-non-keyed", false),
    f("aurelia-v1.1.2-non-keyed", false, {uri: "aurelia-v1.1.2-non-keyed/dist"}),
    f("binding.scala-v10.0.1-keyed", true, {uri: "binding.scala-v10.0.1-keyed/target/web/stage"}),
    f("bobril-v7.1.2-keyed", true),
    f("choo-v5.4.0-non-keyed", false),
    f("cyclejs-dom-v17.1.0-non-keyed", false),
    f("datum-v0.8.0-non-keyed", false),
    f("dio-v7.0.1-keyed", true),
    f("dio-v7.0.1-non-keyed", false),
    f("dojo2-v2.0.0.beta2.5-keyed", true, {uri: "dojo2-v2.0.0.beta2.5-keyed/dist"}),
    f("domvm-v3.0.5-non-keyed", false),
    f("domvm-v3.0.5-keyed", true),
    f("elm-v0.18.0-keyed", true),
    f("ember-v2.13.0-keyed", true, {uri: "ember-v2.13.0-keyed/dist"}),
    f("glimmer-v0.3.10-keyed", true, {uri: "glimmer-v0.3.10-keyed/dist"}),
    f("hyperapp-v0.9.1-non-keyed", false),
    f("halogen-v2.1.0-non-keyed", false),
    f("inferno-v3.1.2-non-keyed", false),
    f("inferno-v3.1.2-keyed", true),
    f("ivi-v0.8.0-keyed", true),
    f("knockout-v3.4.1-keyed", true),
    f("marionette-v3.4.0-domapi-keyed", true),
    f("marionette-v3.4.0-keyed", true),
    f("marko-v4.3.0-keyed", true),
    f("mithril-v1.1.1-keyed", true),
    f("moon-v0.11.0", false),
    f("nx-v1.0.0-beta.2.0.1-keyed", true),
    f("nx-v1.0.0-beta.2.0.1-non-keyed", false),
    f("petit-dom-v0.0.5-keyed", true),
    f("pico-dom-v1.0.0-keyed", true),
    f("plastiq-v1.33.0-keyed", true),
    f("polymer-v2.0.0-non-keyed", false, {uri: "polymer-v2.0.0-non-keyed", useShadowRoot: true}),
    f("preact-v7.1.0-keyed", true),
    f("ractive-v0.8.12-keyed", true),
    f("ractive-v0.8.12-non-keyed", false),
    f("ractive-edge-keyed", true),
    f("ractive-edge-non-keyed", false),
    f("react-lite-v0.15.30-keyed", true),
    f("react-v15.5.4-keyed", true),
    f("react-v15.5.4-non-keyed", false),
    f("react-v15.5.4-easy-state-v1.0.3-keyed", true),
    f("react-v15.5.4-mobX-v3.1.9-keyed", true),
    f("react-v15.5.4-redux-v3.6.0-keyed", true),
    f("react-v16.beta2-keyed", true),
    f("redom-v3.0.2-keyed", true),
    f("redom-v3.0.2-non-keyed", false),
    f("riot-v3.5.0-non-keyed", false),
    f("rx-domh-v0.0.2-rxjs-v5.3.0-keyed", true),
    f("simulacra-v2.1.5-non-keyed", false),
    f("slim-js-v2.9.1-non-keyed", false),
    f("stem-v0.2.70-non-keyed", false),
    f("surplus-v0.4.0-keyed", true),
    f("surplus-v0.4.0-non-keyed", false),
    f("svelte-v1.20.2-keyed", true),
    f("svelte-v1.20.2-non-keyed", false),
    f("tsers-v1.0.0-non-keyed", false),
    f("vanillajs-non-keyed", false),
    f("vanillajs-keyed", true),
    f("vidom-v0.9.8-keyed", true),
    f("vue-v2.3.3-keyed", true),
    f("vue-v2.3.3-non-keyed", false),
]
