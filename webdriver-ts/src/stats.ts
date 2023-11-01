export function stats(values: number[]) {
  let sorted = [...values].sort((a, b) => a - b);
  let median = 0;
  if (sorted.length % 2 == 0) {
    let h = sorted.length / 2;
    median = 0.5 * (sorted[h - 1] + sorted[h]);
  } else {
    median = sorted[Math.trunc(sorted.length / 2)];
  }

  let mean = sorted.reduce((p, c) => p + c, 0) / sorted.length;

  let variance = sorted.reduce((p, c) => p + Math.pow(c - mean, 2), 0) / (sorted.length - 1);
  let stddev = Math.sqrt(variance);

  return {
    min: sorted[0],
    max: sorted.at(-1),
    median,
    mean,
    stddev,
    values,
  };
}
