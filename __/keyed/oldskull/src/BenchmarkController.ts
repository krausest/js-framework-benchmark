import {
  OsfModel,
  OsfCollection,
  OsfPresenter,
} from 'oldskull';

import { ItemModel } from './ItemModel';
import { BenchmarkView } from './BenchmarkView';

export interface IData {
  items: OsfCollection<ItemModel>,
}

export class BenchmarkController extends OsfPresenter<OsfModel<IData>, BenchmarkView> {
  model = new OsfModel({
    items: new OsfCollection<ItemModel>(),
  });
  view = new BenchmarkView(this.model);
}
