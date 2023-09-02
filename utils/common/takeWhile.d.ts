type Predicate<T> = (value: T, index: number, array: T[]) => boolean;

export function takeWhile<T>(array: T[], predicate: Predicate<T>): T[];
