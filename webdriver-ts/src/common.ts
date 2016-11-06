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
    f("angular-v2.0.0"),
    f("aurelia-v1.0.3", "aurelia-v1.0.3/dist"),
    f("bobril-v4.44.1"),
    f("cyclejs-v7.0.0"),
    f("dio-v2.1.0"),
    f("domvm-v1.2.10"),
    f("domvm-v2.0.0-beta"),
    f("ember-v2.6.1", "ember-v2.6.1/dist"),
    f("ember-v2.10.0-beta.2", "ember-v2.10.0-beta.2/dist"),
    f("elm-v0.17.1"),
    f("inferno-v1.0.0-beta5"),
    f("kivi-v1.0.0-rc0"),
    f("knockout-v3.4.0fastForEach"),
    f("knockout-v3.4.0"),
    f("mithril-v0.2.5"),
    f("mithril-v1.0.0-alpha"),
    f("plastiq-v1.33.0"),
    f("polymer-v1.7.0", "polymer-v1.7.0", true),
    f("preact-v6.0.2"),
    f("ractive-v0.7.3"),
    f("ractive-edge"),
    f("react-lite-v0.15.17"),
    f("react-v15.3.1"),
    f("react-v15.3.1-mobX-v2.5.0"),
    f("react-v15.3.2-redux-v3.6.0"),
    f("riot-v2.6.1"),
    f("tsers-v1.0.0"),
    f("vanillajs"),
    f("vidom-v0.3.18"),
    f("vue-v1.0.26"),
    f("vue-v2.0.0-beta1")        
];
