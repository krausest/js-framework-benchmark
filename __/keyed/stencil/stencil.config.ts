import { Config } from "@stencil/core";

// https://stenciljs.com/docs/config

export const config: Config = {
  namespace: "JS-Framework-Benchmark",
  taskQueue: "immediate",
  outputTargets: [
    {
      type: "www",
      dir: "dist",
      serviceWorker: null
    },
  ],
};
