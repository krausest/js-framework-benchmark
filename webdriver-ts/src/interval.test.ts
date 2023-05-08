import { Interval, isContained, newContainedInterval } from "./interval.js";
import {describe, expect, test} from '@jest/globals';

describe('isContained', () => {
    test('works for a contained interval', () => {
        expect(isContained({start:7, end:8, timingResult: 0}, {start:1, end:12, timingResult: 0})).toBe(true);
    })
    test('works for the same interval', () => {
        expect(isContained({start:7, end:8, timingResult: 0}, {start:7, end:8, timingResult: 1})).toBe(true);
    })
})

describe('is not contained', () => {
    //    ---
    //      ---
    test('works for a left shifed interval', () => {
        expect(!isContained({start:7, end:77, timingResult: 0}, {start:10, end:98, timingResult: 0})).toBe(true);
    })
    //    ------
    //      ---
    test('works for a left shifed interval (bigger)', () => {
        expect(!isContained({start:7, end:77, timingResult: 0}, {start:10, end:70, timingResult: 0})).toBe(true);
    })
    //    ---
    //  ---
    test('works for a right shifted interval', () => {
        expect(!isContained({start:17, end:87, timingResult: 0}, {start:10, end:85, timingResult: 0})).toBe(true);
    })
})

describe('newContainedInterval', () => {
    test('works for an empty interval', () => {
        expect(newContainedInterval({start:7, end:77, timingResult: 0}, [])).toEqual([{start:7, end:77, timingResult: 0}]);
    })
    test('works when new interval is contained', () => {
        expect(newContainedInterval({start:7, end:10, timingResult: 0}, [{start:5, end:12, timingResult: 1}]))
            .toEqual([{start:5, end:12, timingResult: 1}]);
    })
    test('works when new interval is not contained', () => {
        expect(newContainedInterval({start:5, end:12, timingResult: 1}, [{start:7, end:10, timingResult: 0}]))
            .toEqual([{start:5, end:12, timingResult: 1}]);
    })
    test('works when new interval contains all exisiting', () => {
        expect(newContainedInterval({start:5, end:20, timingResult: 1}, [
            {start:7, end:10, timingResult: 1},
            {start:12, end:14, timingResult: 2},
            {start:16, end:18, timingResult: 3},
        ]))
        .toEqual([{start:5, end:20, timingResult: 1}]);
    })
    test('works when new interval contains some exisiting', () => {
        let nr = newContainedInterval({start:5, end:17, timingResult: 1}, [
            {start:7, end:10, timingResult: 1},
            {start:12, end:14, timingResult: 2},
            {start:16, end:18, timingResult: 3},
        ]);
        console.log("nr", nr);
        expect(nr.length)
        .toEqual(2);
        expect(nr)
        .toEqual([{start:5, end:17, timingResult: 1}, {start:16, end:18, timingResult: 3}]);
    })
})