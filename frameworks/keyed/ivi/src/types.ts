export interface Entry {
  id: number,
  label: string,
}

export interface State {
  data: Entry[];
  selected: number,
}

export const enum ActionType {
  Run,
  RunLots,
  Add,
  Update,
  SwapRows,
  Select,
  Remove,
  Clear,
}

export interface Run { type: ActionType.Run; };
export interface RunLots { type: ActionType.RunLots; };
export interface Add { type: ActionType.Add; };
export interface Update { type: ActionType.Update; };
export interface SwapRows { type: ActionType.SwapRows; };
export interface Select { type: ActionType.Select; entry: Entry; };
export interface Remove { type: ActionType.Remove; entry: Entry; };
export interface Clear { type: ActionType.Clear; };
export type Action =
  | Run
  | RunLots
  | Add
  | Update
  | SwapRows
  | Select
  | Remove
  | Clear
  ;
