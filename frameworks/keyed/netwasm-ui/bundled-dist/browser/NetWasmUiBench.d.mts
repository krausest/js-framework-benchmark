export interface NetWasmPagePlatformHooks {
  now?: () => number;
  random?: (bytes: Uint8Array) => void;
}
export interface NetWasmPageOpenOptions {
  environment?: Record<string, string>;
  modules?: Record<string, object>;
  onNotification?: (value: { operation: string; arguments: unknown[] }) => void | Promise<void>;
  platform?: NetWasmPagePlatformHooks;
  stderr?: (line: string) => void;
  stdout?: (line: string) => void;
}
export interface NetWasmCallOptions {
  signal?: AbortSignal;
}
export interface NetWasmPageModule {
  "start"(): void;
  close(): Promise<void>;
  readonly failure: Promise<unknown>;
}
export declare function open(options?: NetWasmPageOpenOptions): Promise<NetWasmPageModule>;
