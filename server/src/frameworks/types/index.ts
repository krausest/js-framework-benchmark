export interface BenchmarkData {
  issues: string;
  customURL: string;
  frameworkHomeURL: string;
  useShadowRoot: string;
  useRowShadowRoot: string;
  shadowRootName?: string;
  buttonsInShadowRoot?: string | boolean;
  frameworkVersionFromPackage?: string;
  frameworkVersion?: string;
}

export interface Result {
  type: string;
  directory: string;
  error?: string;
  version?: string;
  versions?: Record<string, string>;
  frameworkVersionString?: string;
  customURL?: string;
  useShadowRoot?: string;
  uri?: string;
}
