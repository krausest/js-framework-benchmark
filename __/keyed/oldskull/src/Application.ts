import { OsfApplication } from 'oldskull';

import { BenchmarkController } from './BenchmarkController';

export class Application extends OsfApplication {
  async init(): Promise<void> {
    const controller = new BenchmarkController();
    await this.mainRegion.show(controller);
  }
}
