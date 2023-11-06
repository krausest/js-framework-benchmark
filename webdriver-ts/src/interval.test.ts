import { isContained, newContainedInterval } from "./interval.js";
import { describe, expect, test } from "vitest";

describe("isContained Function", () => {
  test("When the smaller interval is fully contained within the larger one, should return true", () => {
    const interval1 = { start: 7, end: 8, timingResult: 0 };
    const interval2 = { start: 1, end: 12, timingResult: 0 };

    const result = isContained(interval1, interval2);

    expect(result).toBe(true);
  });

  test("When the smaller interval is the same as the larger one, should return true", () => {
    const interval1 = { start: 7, end: 8, timingResult: 0 };
    const interval2 = { start: 7, end: 8, timingResult: 1 };

    const result = isContained(interval1, interval2);

    expect(result).toBe(true);
  });

  test("When the smaller interval is completely to the left, should return false", () => {
    const interval1 = { start: 7, end: 77, timingResult: 0 };
    const interval2 = { start: 10, end: 98, timingResult: 0 };

    const result = isContained(interval1, interval2);

    expect(result).toBe(false);
  });

  test("When the smaller interval is not contained within the larger one, should return false", () => {
    const interval1 = { start: 7, end: 77, timingResult: 0 };
    const interval2 = { start: 10, end: 70, timingResult: 0 };

    const result = isContained(interval1, interval2);

    expect(result).toBe(false);
  });

  test("When the larger interval is completely to the right, should return false", () => {
    const interval1 = { start: 17, end: 87, timingResult: 0 };
    const interval2 = { start: 10, end: 85, timingResult: 0 };

    const result = isContained(interval1, interval2);

    expect(result).toBe(false);
  });
});

describe("newContainedInterval Function", () => {
  test("When new interval is empty, should return an array with the same interval", () => {
    const existingInterval = { start: 7, end: 77, timingResult: 0 };
    const newIntervals = [];

    const result = newContainedInterval(existingInterval, newIntervals);

    expect(result).toEqual([existingInterval]);
  });

  test("When new interval is contained, should return an array with the new interval", () => {
    const existingInterval = { start: 7, end: 10, timingResult: 0 };
    const newIntervals = [{ start: 5, end: 12, timingResult: 1 }];

    const result = newContainedInterval(existingInterval, newIntervals);

    expect(result).toEqual(newIntervals);
  });

  test("When new interval is not contained, should return an array with the existing interval", () => {
    const existingInterval = { start: 5, end: 12, timingResult: 1 };
    const newIntervals = [{ start: 7, end: 10, timingResult: 0 }];

    const result = newContainedInterval(existingInterval, newIntervals);

    expect(result).toEqual([existingInterval]);
  });

  test("When new interval contains all existing, should return an array with the new interval", () => {
    const newInterval = { start: 5, end: 20, timingResult: 1 };
    const existingIntervals = [
      { start: 7, end: 10, timingResult: 1 },
      { start: 12, end: 14, timingResult: 2 },
      { start: 16, end: 18, timingResult: 3 },
    ];

    const result = newContainedInterval(newInterval, existingIntervals);

    expect(result).toEqual([newInterval]);
  });

  test("When new interval contains some existing, should return an array with the new and some existing intervals", () => {
    const newInterval = { start: 5, end: 17, timingResult: 1 };
    const existingIntervals = [
      { start: 7, end: 10, timingResult: 1 },
      { start: 12, end: 14, timingResult: 2 },
      { start: 16, end: 18, timingResult: 3 },
    ];

    const result = newContainedInterval(newInterval, existingIntervals);

    expect(result).toEqual([
      { start: 5, end: 17, timingResult: 1 },
      { start: 16, end: 18, timingResult: 3 },
    ]);
  });
});
