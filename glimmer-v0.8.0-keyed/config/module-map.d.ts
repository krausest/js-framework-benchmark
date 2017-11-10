/**
 * This is just a placeholder file to keep TypeScript aware editors happy. At build time,
 * it will be replaced with a complete map of resolvable module paths => rolled up contents.
 */

export interface Dict<T> {
  [index: string]: T;
}

declare let map: Dict<any>;
export default map;
