export interface JSONResult {
    framework: string, benchmark: string, type: string, min: number,
        max: number, mean: number, geometricMean: number,
        standardDeviation: number
}

export let config = {
    REPEAT_RUN: 10,
    DROP_WORST_RUN: 4,
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
    f("angular-v1.5.8", false),
    f("angular-v2.2.1", false), // REMOVED
    f("angular-v2.4.3-keyed", false),
    f("angular-v2.4.3-non-keyed", true),
    f("aurelia-v1.0.7", true, {uri: "aurelia-v1.0.7/dist"}),
    f("binding.scala-v10.0.1", true, {uri: "binding.scala-v10.0.1/target/web/stage"}),
    f("bobril-v4.49.2", false),
    f("cyclejs-dom-v14.1.0", true),
    f("dio-v3.0.5", true),
    f("domvm-v1.2.10", true),
    f("domvm-v2.0.0-beta", false),
    f("ember-v2.6.1", false, {uri: "ember-v2.6.1/dist"}),    // TODO: Copy CSS and check
    f("ember-v2.10.0-beta.2", false, {uri: "ember-v2.10.0-beta.2/dist"}),
    f("elm-v0.18.0", false),
    f("inferno-v1.0.0-beta9", true),
    f("kivi-v1.0.0-rc2", false),
    f("knockout-v3.4.1", false),
    f("mithril-v0.2.5", false),
    f("mithril-v1.0.0-alpha", false),
    f("nx-v1.0.0-alpha.4.0.0", true),
    f("plastiq-v1.33.0", false),
    f("polymer-v1.7.0", true, {uri: "polymer-v1.7.0", useShadowRoot: true}),
    f("preact-v6.4.0", false),  // REMOVED
    f("preact-v7.1.0", false),
    f("svelte-v1.0.1", true),
    f("ractive-v0.8.5", true),
    f("ractive-edge", true),
    f("react-lite-v0.15.27", false),
    f("react-v15.4.0", false),
    f("react-v15.4.0-mobX-v2.6.3", false),
    f("react-v15.4.0-redux-v3.6.0", false),
    f("riot-v2.6.7", true),
    f("riot-v3.0.7", true),
    f("simulacra-v1.5.5", true),
    f("tsers-v1.0.0", true),
    f("vanillajs", true),
//    // f("vanillajs-nocss"),
//    // f("vanillajs-slimcss"),
//    // f("vanillajs-small-css"),
    f("vanillajs-keyed", false),
    f("vidom-v0.5.3", false),
    f("vue-v2.1.3", false)
];
