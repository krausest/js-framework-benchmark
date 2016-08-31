import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration();

  await aurelia.start();
  aurelia.setRoot('app');
}