export function createResponseSizeDecorator() {
  return {
    use_compression: false,
    size_uncompressed: 0,
    size_compressed: 0,
    get() {
      return {
        use_compression: this.use_compression,
        size_uncompressed: this.size_uncompressed,
        size_compressed: this.size_compressed,
      };
    },
    reset() {
      this.size_uncompressed = 0;
      this.size_compressed = 0;
    },
    enableCompression() {
      this.use_compression = true;
    },
    disableCompression() {
      this.use_compression = false;
    },
    add(uncompressed: number, compressed: number) {
      this.size_uncompressed += uncompressed;
      this.size_compressed += compressed;
    },
  };
}
