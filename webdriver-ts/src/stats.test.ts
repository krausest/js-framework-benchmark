import { stats } from "./stats.js";

import { describe, expect, test } from "vitest";

describe("stats", () => {
  test("works correctly for even count", () => {
    let values = [2, 1, 3, 6];
    let s = stats(values);
    expect(s.min).toBe(1);
    expect(s.max).toBe(6);
    expect(s.mean).toBe(3);
    expect(s.stddev).toBeCloseTo(2.160246899469287, 8);
    expect(s.median).toBe(2.5);
  });

  test("works correctly for odd count", () => {
    let values = [2, 1, 5, 4, 13];
    let s = stats(values);
    expect(s.min).toBe(1);
    expect(s.max).toBe(13);
    expect(s.mean).toBe(5);
    expect(s.stddev).toBeCloseTo(4.743416490252569, 8);
    expect(s.median).toBe(4);
  });

  test("works correctly for real example", () => {
    let values = [
      987.247, 984.973, 982.673, 975.732, 975.119, 979.086, 969.717, 978.866, 991.374, 979.591, 973.684, 972.252,
    ];
    let s = stats(values);
    expect(s.min).toBe(969.717);
    expect(s.max).toBe(991.374);
    expect(s.mean).toBeCloseTo(979.1928333333332, 8);
    expect(s.stddev).toBeCloseTo(6.438071377408464, 8);
    expect(s.median).toBe(978.976);
  });

  test("works correctly for second real example", () => {
    let values = [987.247, 982.673, 975.732, 975.119, 979.086, 969.717, 978.866, 991.374, 979.591, 973.684, 972.252];
    let s = stats(values);
    expect(s.min).toBe(969.717);
    expect(s.max).toBe(991.374);
    expect(s.mean).toBeCloseTo(978.6673636363635, 8);
    expect(s.stddev).toBeCloseTo(6.476795230246634, 8);
    expect(s.median).toBe(978.866);
  });
});
