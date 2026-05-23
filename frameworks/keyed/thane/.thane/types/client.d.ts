declare module '*.css' {
  /** CSS content as a string (inlined at compile time by thane) */
  const css: string;
  export default css;
}
