export interface Table {
  data: {id: number, label: string}[];
  selected: number;
  select: (id: number) => void;
  remove: (idToRemove: number) => void;
  run: () => void;
  runLots: () => void;
  add: () => void;
  update: () => void;
  clear: () => void;
  swapRows: () => void;
}

export type Item = Table['data'][number]
