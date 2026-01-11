import { buildData } from './data';
import { Observable } from "native-document";


const data = Observable.array([]);
const selected = Observable(0);

const AppService = {
  data,
  selected,
  clean: Observable(false),
  resetSelected() {
    selected.disconnectAll();
    selected.set(0);
  },
  add() {
    data.merge(buildData(1000));
  },
  clear() {
    data.clear();
    AppService.resetSelected();
  },
  update() {
    for (let i = 0; i < data.$value.length; i += 10) {
      data.$value[i].label.set((val) => val + ' !!!');
    }
  },
  remove(id) {
    const idx = data.$value.findIndex(d => d.id === id);
    data.remove(idx);
  },
  init(nb ) {
    AppService.resetSelected();
    data.set(buildData(nb));
  },
  run() {
    AppService.init(1000);
  },
  runLots() {
    AppService.init(10000);
  },
  select(id) {
    selected.set(id);
  },
  swapRows() {
    data.swap(1, 998);
  }
};

export default AppService;