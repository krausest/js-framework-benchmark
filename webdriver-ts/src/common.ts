export interface JSONResult {
    framework: string,
    benchmark: string,
    type: string,
    min: number,
    max: number,
    mean: number,
    geometricMean: number,
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
}

function f(name: string, uri: string = null): FrameworkData 
{
    return {name, uri: uri? uri : name};
}

export let frameworks = [
    f("angular-v1.5.8"),
    f("angular-v2.0.0-rc5"),
    f("aurelia-v1.0.0", "aurelia-v1.0.0/dist"),
    f("bobril-v4.44.1"),
    f("cyclejs-v7.0.0"),
    f("domvm-v1.2.10"),
    f("inferno-v0.7.26"),
    f("inferno-v1.0.0-alpha7"),
    f("kivi-v1.0.0-rc0"),
    f("mithril-v0.2.5"),
    f("mithril-v1.0.0-alpha"),
    f("plastiq-v1.33.0"),
    f("preact-v5.7.0"),
    f("ractive-v0.7.3"),
    f("ractive-edge"),
    f("react-lite-v0.15.17"),
    f("react-v15.3.1"),
    f("react-v15.3.1-mobX-v2.5.0"),
    f("riot-v2.6.1"),
    f("tsers-v1.0.0"),
    f("vanillajs"),
    f("vidom-v0.3.18"),
    f("vue-v1.0.26"),
    f("vue-v2.0.0-beta1")        
];