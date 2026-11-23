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
/** What the user picked: a File or Blob mounts read-only; a handle mounts read-write. */
export type NetWasmMountSource = Blob | FileSystemFileHandle | FileSystemDirectoryHandle;
/** Mounts a picked file or directory at an absolute path the program's File APIs see. */
export declare function mount(guestPath: string, source: NetWasmMountSource): Promise<void>;
export declare function unmount(guestPath: string): void;
/** Writes a handle mount's changes back to what the user picked. */
export declare function sync(guestPath: string): Promise<void>;
