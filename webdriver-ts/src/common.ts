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
    LOG_DETAILS: true,
    LOG_DEBUG: false
}

export interface FrameworkData {
    name: string;
    uri: string;
    useShadowRoot: boolean;
}

function f(name: string, uri: string = null, useShadowRoot = false): FrameworkData {
    return {name, uri: uri ? uri : name, useShadowRoot};
}

export let frameworks = [
    f("angular-v1.5.8"),
    f("angular-v2.2.1"),
    f("aurelia-v1.0.7", "aurelia-v1.0.7/dist"),
    f("bobril-v4.44.1"),
    f("cyclejs-dom-v14.1.0"),
    f("dio-v2.1.0"),
    f("domvm-v1.2.10"),
    f("domvm-v2.0.0-beta"),
    f("ember-v2.6.1", "ember-v2.6.1/dist"),
    f("ember-v2.10.0-beta.2", "ember-v2.10.0-beta.2/dist"),
    f("elm-v0.17.1"),
    f("inferno-v1.0.0-beta9"),
    f("kivi-v1.0.0-rc2"),
    f("knockout-v3.4.1"),
    f("mithril-v0.2.5"),
    f("mithril-v1.0.0-alpha"),
    f("plastiq-v1.33.0"),
    f("polymer-v1.7.0", "polymer-v1.7.0", true),
    f("preact-v6.4.0"),
    f("simulacra-v1.5.5"),
    f("ractive-v0.8.5"),
    f("ractive-edge"),
    f("react-lite-v0.15.27"),
    f("react-v15.4.0"),
    f("react-v15.4.0-mobX-v2.6.3"),
    f("react-v15.4.0-redux-v3.6.0"),
    f("riot-v2.6.7"),
    f("tsers-v1.0.0"),
    f("vanillajs"),
    f("vidom-v0.5.3"),
    f("vue-v2.0.7")        
];
