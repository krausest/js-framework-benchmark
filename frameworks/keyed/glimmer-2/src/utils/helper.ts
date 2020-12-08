import { helperCapabilities, HelperManager, setHelperManager } from '@glimmer/core';

type helperFunc<
  Positional extends unknown[] = unknown[],
  Result = unknown
> = (positional: Positional) => Result;

interface HelperBucket<
  Positional extends unknown[] = unknown[],
  Result = unknown
> {
  fn: helperFunc<Positional, Result>;
  args: any;
}

class HelperWithServicesManager implements HelperManager<HelperBucket> {
  capabilities = helperCapabilities('glimmerjs-2.0.0');

  createHelper(fn: helperFunc, args: any): HelperBucket {
    return { fn, args };
  }

  getValue(instance: HelperBucket): unknown {
    const { args } = instance;
    return instance.fn(args.positional);
  }
}

const HelperWithServicesManagerFactory = (): HelperWithServicesManager => new HelperWithServicesManager();

export function helper<T extends Function>(fn: T): T {
  setHelperManager(HelperWithServicesManagerFactory, fn);
  return fn;
}
