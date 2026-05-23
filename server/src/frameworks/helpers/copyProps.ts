import { BenchmarkData, Result } from "../types/index.js";

export function copyProps(result: Partial<Result & BenchmarkData>, benchmarkData: Partial<BenchmarkData>) {
  const { issues, customURL, frameworkHomeURL, language, useShadowRoot, useRowShadowRoot, shadowRootName, buttonsInShadowRoot, startLogicEventName } =
    benchmarkData;

  result.issues = issues;
  result.customURL = customURL;
  result.frameworkHomeURL = frameworkHomeURL;
  result.language = language;
  result.useShadowRoot = useShadowRoot;
  result.useRowShadowRoot = useRowShadowRoot;
  result.shadowRootName = useShadowRoot ? shadowRootName ?? "main-element" : undefined;
  result.buttonsInShadowRoot = useShadowRoot ? buttonsInShadowRoot ?? true : undefined;
  result.startLogicEventName = startLogicEventName ?? "click";
}
