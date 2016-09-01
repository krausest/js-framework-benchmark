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