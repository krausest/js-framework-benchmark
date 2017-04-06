export interface JSONResult {
    framework: string, benchmark: string, type: string, min: number,
        max: number, mean: number, geometricMean: number,
        standardDeviation: number
}

export let config = {
    REPEAT_RUN: 10,
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
    f("angular-v2.4.9-keyed", false),
    f("angular-v2.4.9-non-keyed", true),
    f("angular-v4.0.0-keyed", false),
    f("angular-v4.0.0-non-keyed", true),
    f("aurelia-v1.1.0", true, {uri: "aurelia-v1.1.0/dist"}),
    f("binding.scala-v10.0.1", false, {uri: "binding.scala-v10.0.1/target/web/stage"}),
    f("bobril-v6.2.0", false),
    f("choo-v4.1.0", true),
    f("cyclejs-dom-v14.1.0", true),
    f("dio-v3.0.5", true),
    f("domvm-v2.1.3-non-keyed", true),
    f("domvm-v2.1.3-keyed", false),
    f("ember-v2.6.1", false, {uri: "ember-v2.6.1/dist"}),
    f("ember-v2.10.0-beta.3", false, {uri: "ember-v2.10.0-beta.3/dist"}),
    f("elm-v0.18.0", false),
    f("hyperapp-v0.6.0", true),
    f("inferno-v1.3.0-rc3-non-keyed", true),
    f("inferno-v1.3.0-rc3-keyed", false),
    f("ivi-v0.5.0", false),
    f("kivi-v1.0.0-rc2", false),
    f("knockout-v3.4.1", false),
    f("marko-v4.2.0", false),
    f("marionette-v3.1.0", false),
    f("mithril-v0.2.5", false),
    f("mithril-v1.0.1", false),
    f("nx-v1.0.0-beta.1.1.0-keyed", false),
    f("nx-v1.0.0-beta.1.1.0-non-keyed", true),
    f("pico-dom-v0.18.0", false),
    f("plastiq-v1.33.0", false),
    f("polymer-v1.7.0", true, {uri: "polymer-v1.7.0", useShadowRoot: true}),
    f("preact-v7.1.0", false),
    f("svelte-v1.0.1", true),
    f("ractive-v0.8.9-keyed", false),
    f("ractive-v0.8.9-non-keyed", true),
    f("ractive-edge", true),
    f("react-lite-v0.15.30", false),
    f("react-v15.4.2-keyed", false),
    f("react-v15.4.2-non-keyed", true),
    f("react-v15.4.2-mobX-v3.0.1", false),
    f("react-v15.4.2-redux-v3.6.0", false),
    f("riot-v3.0.7", true),
    f("simulacra-v1.5.5", true),
    f("stem-v0.2.60", true),
    f("surplus-v0.4.0-keyed", false, { uri: "surplus-v0.4.0?keyed" }),
    f("surplus-v0.4.0-nonkeyed", true, { uri: "surplus-v0.4.0" }),
    f("tsers-v1.0.0", true),
    f("vanillajs-non-keyed", true),
    f("vanillajs-keyed", false),
    f("vidom-v0.7.1", false),
    f("vue-v2.2.4-keyed", false),
    f("vue-v2.2.4-non-keyed", true),
]
