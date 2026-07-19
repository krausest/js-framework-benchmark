// @wcstack/signals ships no JSX namespace (classic runtime, factory `h`), so
// declare a minimal one: every element is a real DOM Node and any prop is
// allowed (h validates at runtime).
declare global {
  namespace JSX {
    type Element = Node;
    interface IntrinsicElements {
      [tagName: string]: Record<string, unknown>;
    }
  }
}
export {};
