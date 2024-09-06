export function createCSPDecorator() {
  return {
    isEnabled: false,
    violations: [] as string[],
  };
}
