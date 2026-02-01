import { describe, test, expect } from 'bun:test';
import { signal } from './signal.js';

const flushMicrotasks = () => new Promise((resolve) => queueMicrotask(resolve));

describe('Signal Core', () => {
  test('signal returns initial value', () => {
    const s = signal(42);
    expect(s()).toBe(42);
  });

  test('signal updates value', () => {
    const s = signal(1);
    s(2);
    expect(s()).toBe(2);
  });

  test('signal with string value', () => {
    const s = signal('hello');
    expect(s()).toBe('hello');
    s('world');
    expect(s()).toBe('world');
  });

  test('signal with boolean value', () => {
    const s = signal(true);
    expect(s()).toBe(true);
    s(false);
    expect(s()).toBe(false);
  });

  test('signal with object value', () => {
    const s = signal({ name: 'test', count: 0 });
    expect(s().name).toBe('test');
    expect(s().count).toBe(0);

    s({ name: 'updated', count: 5 });
    expect(s().name).toBe('updated');
    expect(s().count).toBe(5);
  });

  test('signal with array value', () => {
    const s = signal([1, 2, 3]);
    expect(s()).toEqual([1, 2, 3]);

    s([4, 5, 6]);
    expect(s()).toEqual([4, 5, 6]);
  });

  test('signal with null value', () => {
    const s = signal<string | null>('initial');
    expect(s()).toBe('initial');

    s(null);
    expect(s()).toBe(null);
  });

  test('signal with undefined value', () => {
    const s = signal<number | undefined>(42);
    expect(s()).toBe(42);

    s(undefined);
    expect(s()).toBe(undefined);
  });
});

describe('Signal Subscriptions', () => {
  test('subscribe receives initial value immediately', () => {
    const s = signal('initial');
    let received = '';

    s.subscribe((val) => {
      received = val;
    });

    expect(received).toBe('initial');
  });

  test('subscribe with skipInitial does not receive initial', () => {
    const s = signal('initial');
    let received: string | null = null;

    s.subscribe((val) => {
      received = val;
    }, true); // skipInitial = true

    expect(received).toBe(null);
  });

  test('subscribe receives updates after initial', async () => {
    const s = signal('initial');
    const received: string[] = [];

    s.subscribe((val) => {
      received.push(val);
    });

    expect(received).toEqual(['initial']);

    s('updated');
    await flushMicrotasks();

    expect(received).toEqual(['initial', 'updated']);
  });

  test('multiple subscribers all receive updates', async () => {
    const s = signal(0);
    let sub1Value = -1;
    let sub2Value = -1;
    let sub3Value = -1;

    s.subscribe((val) => {
      sub1Value = val;
    });
    s.subscribe((val) => {
      sub2Value = val;
    });
    s.subscribe((val) => {
      sub3Value = val;
    });

    expect(sub1Value).toBe(0);
    expect(sub2Value).toBe(0);
    expect(sub3Value).toBe(0);

    s(42);
    await flushMicrotasks();

    expect(sub1Value).toBe(42);
    expect(sub2Value).toBe(42);
    expect(sub3Value).toBe(42);
  });

  test('unsubscribe stops receiving updates', async () => {
    const s = signal(0);
    let value = -1;

    const unsub = s.subscribe((val) => {
      value = val;
    });

    expect(value).toBe(0);

    s(1);
    await flushMicrotasks();
    expect(value).toBe(1);

    unsub(); // Unsubscribe

    s(2);
    await flushMicrotasks();
    expect(value).toBe(1); // Should not have changed
  });

  test('multiple subscribe/unsubscribe cycles work correctly', async () => {
    const s = signal('a');
    let count = 0;

    // First subscription
    const unsub1 = s.subscribe(() => {
      count++;
    });
    expect(count).toBe(1);

    // Second subscription
    const unsub2 = s.subscribe(() => {
      count++;
    });
    expect(count).toBe(2);

    // Update triggers both
    s('b');
    await flushMicrotasks();
    expect(count).toBe(4);

    // Unsubscribe first
    unsub1();

    // Update triggers only second
    s('c');
    await flushMicrotasks();
    expect(count).toBe(5);

    // Re-subscribe
    const unsub3 = s.subscribe(() => {
      count++;
    });
    expect(count).toBe(6);

    // Update triggers second and third
    s('d');
    await flushMicrotasks();
    expect(count).toBe(8);

    // Clean up
    unsub2();
    unsub3();
  });
});

describe('Signal Batching', () => {
  test('same value does not trigger update', async () => {
    const s = signal(5);
    let updateCount = 0;

    s.subscribe(
      () => {
        updateCount++;
      },
      true
    ); // skipInitial

    expect(updateCount).toBe(0);

    s(5); // Same value
    await flushMicrotasks();

    expect(updateCount).toBe(0); // Should not have triggered
  });

  test('multiple rapid updates are batched', async () => {
    const s = signal(0);
    const values: number[] = [];

    s.subscribe(
      (val) => {
        values.push(val);
      },
      true
    );

    // Rapid updates
    s(1);
    s(2);
    s(3);

    await flushMicrotasks();

    // All three updates should be recorded (synchronous notification)
    expect(values).toEqual([1, 2, 3]);
    expect(s()).toBe(3);
  });

  test('100 rapid updates complete correctly', async () => {
    const s = signal(0);
    let lastValue = 0;

    s.subscribe(
      (val) => {
        lastValue = val;
      },
      true
    );

    for (let i = 1; i <= 100; i++) {
      s(i);
    }

    await flushMicrotasks();

    expect(s()).toBe(100);
    expect(lastValue).toBe(100);
  });
});

describe('Signal Array Operations', () => {
  test('array push equivalent', () => {
    const s = signal([1, 2, 3]);

    s([...s(), 4]);

    expect(s()).toEqual([1, 2, 3, 4]);
  });

  test('array splice equivalent (remove)', () => {
    const s = signal([1, 2, 3, 4, 5]);

    // Remove element at index 2
    const arr = [...s()];
    arr.splice(2, 1);
    s(arr);

    expect(s()).toEqual([1, 2, 4, 5]);
  });

  test('array splice equivalent (insert)', () => {
    const s = signal([1, 2, 4, 5]);

    // Insert 3 at index 2
    const arr = [...s()];
    arr.splice(2, 0, 3);
    s(arr);

    expect(s()).toEqual([1, 2, 3, 4, 5]);
  });

  test('array update at index', () => {
    const s = signal([1, 2, 3]);

    // Update element at index 1
    const arr = [...s()];
    arr[1] = 10;
    s(arr);

    expect(s()).toEqual([1, 10, 3]);
  });

  test('array swap elements', () => {
    const s = signal(['a', 'b', 'c']);

    const arr = [...s()];
    [arr[0], arr[2]] = [arr[2]!, arr[0]!];
    s(arr);

    expect(s()).toEqual(['c', 'b', 'a']);
  });

  test('array filter', () => {
    const s = signal([1, 2, 3, 4, 5]);

    s(s().filter((x) => x % 2 === 0));

    expect(s()).toEqual([2, 4]);
  });

  test('array map', () => {
    const s = signal([1, 2, 3]);

    s(s().map((x) => x * 2));

    expect(s()).toEqual([2, 4, 6]);
  });

  test('array reverse', () => {
    const s = signal([1, 2, 3]);

    s([...s()].reverse());

    expect(s()).toEqual([3, 2, 1]);
  });

  test('array sort', () => {
    const s = signal([3, 1, 4, 1, 5, 9, 2, 6]);

    s([...s()].sort((a, b) => a - b));

    expect(s()).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
  });

  test('array clear', () => {
    const s = signal([1, 2, 3, 4, 5]);

    s([]);

    expect(s()).toEqual([]);
  });
});

describe('Signal Object Operations', () => {
  test('object property update', () => {
    const s = signal({ name: 'test', count: 0 });

    s({ ...s(), count: 5 });

    expect(s().count).toBe(5);
    expect(s().name).toBe('test');
  });

  test('object add property', () => {
    const s = signal<{ name: string; extra?: string }>({ name: 'test' });

    s({ ...s(), extra: 'new' });

    expect(s().extra).toBe('new');
  });

  test('object remove property', () => {
    const s = signal<{ name: string; extra?: string }>({
      name: 'test',
      extra: 'remove',
    });

    const { extra, ...rest } = s();
    s(rest as typeof s extends () => infer T ? T : never);

    expect(s().extra).toBe(undefined);
    expect(s().name).toBe('test');
  });

  test('deeply nested object update', () => {
    const s = signal({
      level1: {
        level2: {
          level3: {
            value: 1,
          },
        },
      },
    });

    s({
      level1: {
        level2: {
          level3: {
            value: 42,
          },
        },
      },
    });

    expect(s().level1.level2.level3.value).toBe(42);
  });
});

describe('Chained Signal Updates', () => {
  test('signal update triggers dependent subscription', async () => {
    const s1 = signal(1);
    const s2 = signal(0);

    s1.subscribe(
      (val) => {
        s2(val * 2);
      },
      true
    );

    s1(5);
    await flushMicrotasks();

    expect(s2()).toBe(10);
  });

  test('multiple dependent signals', async () => {
    const source = signal(1);
    const doubled = signal(0);
    const tripled = signal(0);

    source.subscribe(
      (val) => {
        doubled(val * 2);
        tripled(val * 3);
      },
      true
    );

    source(5);
    await flushMicrotasks();

    expect(doubled()).toBe(10);
    expect(tripled()).toBe(15);
  });
});

describe('Signal Edge Cases', () => {
  test('signal with empty string', () => {
    const s = signal('');
    expect(s()).toBe('');

    s('not empty');
    expect(s()).toBe('not empty');

    s('');
    expect(s()).toBe('');
  });

  test('signal with zero', () => {
    const s = signal(0);
    expect(s()).toBe(0);

    s(1);
    expect(s()).toBe(1);

    s(0);
    expect(s()).toBe(0);
  });

  test('signal with empty array', () => {
    const s = signal<number[]>([]);
    expect(s()).toEqual([]);

    s([1]);
    expect(s()).toEqual([1]);

    s([]);
    expect(s()).toEqual([]);
  });

  test('signal with empty object', () => {
    const s = signal<Record<string, any>>({});
    expect(s()).toEqual({});

    s({ key: 'value' });
    expect(s().key).toBe('value');

    s({});
    expect(s()).toEqual({});
  });

  test('signal toggles boolean correctly', async () => {
    const s = signal(false);
    const states: boolean[] = [];

    s.subscribe((val) => {
      states.push(val);
    });

    for (let i = 0; i < 5; i++) {
      s(!s());
    }

    await flushMicrotasks();

    expect(states).toEqual([false, true, false, true, false, true]);
    expect(s()).toBe(true);
  });

  test('signal handles NaN', () => {
    const s = signal(NaN);
    expect(Number.isNaN(s())).toBe(true);

    s(42);
    expect(s()).toBe(42);
  });

  test('signal handles Infinity', () => {
    const s = signal(Infinity);
    expect(s()).toBe(Infinity);

    s(-Infinity);
    expect(s()).toBe(-Infinity);

    s(0);
    expect(s()).toBe(0);
  });

  test('signal handles Date object', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-12-31');

    const s = signal(date1);
    expect(s().getTime()).toBe(date1.getTime());

    s(date2);
    expect(s().getTime()).toBe(date2.getTime());
  });

  test('signal handles function value', () => {
    const fn1 = () => 'hello';
    const fn2 = () => 'world';

    const s = signal(fn1);
    expect(s()()).toBe('hello');

    s(fn2);
    expect(s()()).toBe('world');
  });
});

describe('Signal Performance', () => {
  test('handles 1000 signal updates', async () => {
    const s = signal(0);
    let updateCount = 0;

    s.subscribe(
      () => {
        updateCount++;
      },
      true
    );

    for (let i = 1; i <= 1000; i++) {
      s(i);
    }

    await flushMicrotasks();

    expect(s()).toBe(1000);
    expect(updateCount).toBe(1000);
  });

  test('handles 100 concurrent signals', async () => {
    const signals = Array.from({ length: 100 }, (_, i) => signal(i));
    const results: number[] = [];

    signals.forEach((s, i) => {
      s.subscribe(
        (val) => {
          results[i] = val;
        },
        true
      );
    });

    signals.forEach((s, i) => s(i * 2));

    await flushMicrotasks();

    expect(results.length).toBe(100);
    expect(results[50]).toBe(100);
    expect(results[99]).toBe(198);
  });

  test('handles large array in signal', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
    const s = signal(largeArray);

    expect(s().length).toBe(10000);
    expect(s()[5000]).toBe(5000);

    s(s().map((x) => x * 2));

    expect(s()[5000]).toBe(10000);
  });

  test('rapid toggle does not cause issues', async () => {
    const s = signal(false);
    let lastValue = false;

    s.subscribe(
      (val) => {
        lastValue = val;
      },
      true
    );

    for (let i = 0; i < 1000; i++) {
      s(!s());
    }

    await flushMicrotasks();

    expect(s()).toBe(false); // 1000 toggles = back to false
    expect(lastValue).toBe(false);
  });
});

describe('Signal Type Safety', () => {
  test('generic signal preserves type', () => {
    interface User {
      name: string;
      age: number;
    }

    const userSignal = signal<User>({ name: 'John', age: 30 });

    expect(userSignal().name).toBe('John');
    expect(userSignal().age).toBe(30);

    userSignal({ name: 'Jane', age: 25 });

    expect(userSignal().name).toBe('Jane');
    expect(userSignal().age).toBe(25);
  });

  test('union type signal', () => {
    const s = signal<string | number>('hello');

    expect(s()).toBe('hello');

    s(42);

    expect(s()).toBe(42);
  });

  test('array of objects signal', () => {
    interface Item {
      id: number;
      text: string;
    }

    const s = signal<Item[]>([
      { id: 1, text: 'one' },
      { id: 2, text: 'two' },
    ]);

    expect(s().length).toBe(2);
    expect(s()[0]!.text).toBe('one');

    s([...s(), { id: 3, text: 'three' }]);

    expect(s().length).toBe(3);
    expect(s()[2]!.text).toBe('three');
  });
});
