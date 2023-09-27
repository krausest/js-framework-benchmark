export interface Interval<T> {
  start: number;
  end: number;
  timingResult: T;
}
export function isContained<T>(testIv: Interval<T>, otherIv: Interval<T>) {
  return testIv.start >= otherIv.start && testIv.end <= otherIv.end;
}
export function newContainedInterval<T>(
  outerIv: Interval<T>,
  intervals: Array<Interval<T>>,
) {
  const cleanedUp: Array<Interval<T>> = [];
  const isContainedRes = intervals.some((iv) => isContained(outerIv, iv));
  if (!isContainedRes) {
    cleanedUp.push(outerIv);
  }
  for (const iv of intervals) {
    const isContainedIv = isContained(iv, outerIv);
    if (!isContainedIv) {
      cleanedUp.push(iv);
    }
  }
  return cleanedUp;
}
