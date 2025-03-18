/* eslint-disable @typescript-eslint/no-explicit-any */
//
// PR: https://github.com/glimmerjs/glimmer-vm/pull/1713
//
//
// Unfortunately, TypeScript's ability to do inference *or* type-checking in a
// `Proxy`'s body is very limited, so we have to use a number of casts `as any`
// to make the internal accesses work. The type safety of these is guaranteed at
// the *call site* instead of within the body: you cannot do `Array.blah` in TS,
// and it will blow up in JS in exactly the same way, so it is safe to assume
// that properties within the getter have the correct type in TS.

// @ts-expect-error
import { consumeTag, createUpdatableTag, dirtyTag } from '@glimmer/validator';

const ARRAY_GETTER_METHODS = new Set([
  Symbol.iterator,
  'concat',
  'entries',
  'every',
  'filter',
  'find',
  'findIndex',
  'flat',
  'flatMap',
  'forEach',
  'includes',
  'indexOf',
  'join',
  'keys',
  'lastIndexOf',
  'map',
  'reduce',
  'reduceRight',
  'slice',
  'some',
  'values',
]);

// For these methods, `Array` itself immediately gets the `.length` to return
// after invoking them.
const ARRAY_WRITE_THEN_READ_METHODS =
  new Set(['fill', 'push', 'unshift']);

function convertToInt(prop) {
  if (typeof prop === 'symbol') return null;

  const num = Number(prop);

  if (isNaN(num)) return null;

  return num % 1 === 0 ? num : null;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class TrackedArray {
  constructor(arr = []) {
    const clone = arr.slice();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    const boundFns = new Map();

    /**
      Flag to track whether we have *just* intercepted a call to `.push()` or
      `.unshift()`, since in those cases (and only those cases!) the `Array`
      itself checks `.length` to return from the function call.
     */
    let nativelyAccessingLengthFromPushOrUnshift = false;

    return new Proxy(clone, {
      get(target, prop /*, _receiver */) {
        const index = convertToInt(prop);

        if (index !== null) {
          self.#readStorageFor(index);
          consumeTag(self.#collection);

          return target[index];
        }

        if (prop === 'length') {
          // If we are reading `.length`, it may be a normal user-triggered
          // read, or it may be a read triggered by Array itself. In the latter
          // case, it is because we have just done `.push()` or `.unshift()`; in
          // that case it is safe not to mark this as a *read* operation, since
          // calling `.push()` or `.unshift()` cannot otherwise be part of a
          // "read" operation safely, and if done during an *existing* read
          // (e.g. if the user has already checked `.length` *prior* to this),
          // that will still trigger the mutation-after-consumption assertion.
          if (nativelyAccessingLengthFromPushOrUnshift) {
            nativelyAccessingLengthFromPushOrUnshift = false;
          } else {
            consumeTag(self.#collection);
          }

          return target[prop];
        }

        // Here, track that we are doing a `.push()` or `.unshift()` by setting
        // the flag to `true` so that when the `.length` is read by `Array` (see
        // immediately above), it knows not to dirty the collection.
        if (ARRAY_WRITE_THEN_READ_METHODS.has(prop)) {
          nativelyAccessingLengthFromPushOrUnshift = true;
        }

        if (ARRAY_GETTER_METHODS.has(prop)) {
          let fn = boundFns.get(prop);

          if (fn === undefined) {
            fn = (...args) => {
              consumeTag(self.#collection);
              return target[prop](...args);
            };

            boundFns.set(prop, fn);
          }

          return fn;
        }

        return target[prop];
      },

      set(target, prop, value /*, _receiver */) {
        target[prop] = value;

        const index = convertToInt(prop);

        if (index !== null) {
          self.#dirtyStorageFor(index);
          self.#dirtyCollection();
        } else if (prop === 'length') {
          self.#dirtyCollection();
        }

        return true;
      },

      getPrototypeOf() {
        return TrackedArray.prototype;
      },
    });
  }

  #collection = createUpdatableTag();

  #storages = new Map();

  #readStorageFor(index) {
    let storage = this.#storages.get(index);

    if (storage === undefined) {
      storage = createUpdatableTag();
      this.#storages.set(index, storage);
    }

    consumeTag(storage);
  }

  #dirtyStorageFor(index) {
    const storage = this.#storages.get(index);

    if (storage) {
      dirtyTag(storage);
    }
  }

  #dirtyCollection() {
    dirtyTag(this.#collection);
    this.#storages.clear();
  }
}

// Ensure instanceof works correctly
Object.setPrototypeOf(TrackedArray.prototype, Array.prototype);
