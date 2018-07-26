import Application, { DOMBuilder, BytecodeLoader, SyncRenderer } from '@glimmer/application';
import Resolver, { BasicModuleRegistry } from '@glimmer/resolver';
import resolverConfiguration from '../config/resolver-configuration';
import data from './data-segment';

export default class App extends Application {
  constructor() {
    let moduleRegistry = new BasicModuleRegistry(data.meta);
    let resolver = new Resolver(resolverConfiguration, moduleRegistry);
    const element = document.body;
    const bytecode = fetch('./templates.gbx', { credentials: 'include' })
      .then((r) => r.arrayBuffer());

    super({
      builder: new DOMBuilder({ element, nextSibling: null }),
      loader: new BytecodeLoader({ bytecode, data }),
      renderer: new SyncRenderer(),
      resolver,
      rootName: resolverConfiguration.app.rootName
    });
  }
}