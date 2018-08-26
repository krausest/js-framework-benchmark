import environment from './environment'

export function configure(aurelia) {
  aurelia.use
    .defaultBindingLanguage()
    .defaultResources();

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  aurelia.start().then(() => {
    aurelia.setRoot('app');
  });
}