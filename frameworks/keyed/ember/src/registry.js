import Router from './router.js';

function formatAsResolverEntries(imports) {
  return Object.fromEntries(
    Object.entries(imports).map(([k, v]) => [
      k.replace(/\.g?(j|t)s$/, '').replace(/^\.\//, 'results/'),
      v,
    ])
  );
}

/**
 * A global registry is needed until:
 * - Services can be referenced via import paths (rather than strings)
 * - we design a new routing system
 */
export const registry = {
  ...formatAsResolverEntries(
    import.meta.glob('./templates/**/*.{gjs,gts,js,ts}', { eager: true })
  ),
  ...formatAsResolverEntries(
    import.meta.glob('./services/**/*.{js,ts}', { eager: true })
  ),
  ...formatAsResolverEntries(
    import.meta.glob('./routes/**/*.{js,ts}', { eager: true })
  ),
  'results/router': Router,
};
