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
  capabilities = helperCapabilities('3.23', { hasValue: true });

  createHelper(fn: helperFunc, args: any): HelperBucket {
    return { fn, args: args.positional };
  }

  getValue(instance: HelperBucket): unknown {
    return instance.fn(instance.args);
  }
}

const Factory = new HelperWithServicesManager();

const HelperWithServicesManagerFactory = (): HelperWithServicesManager => Factory;

export function helper<T extends Function>(fn: T): T {
  setHelperManager(HelperWithServicesManagerFactory, fn);
  return fn;
}
