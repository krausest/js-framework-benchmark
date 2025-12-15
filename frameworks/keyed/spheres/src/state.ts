import { value, Value } from "spheres/store";
import { GetState, update, StoreMessage, batch, container, write } from "spheres/store";

function random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

export interface AddRowsMessage {
  type: "add"
  count: number
}

export interface SetRowsMessage {
  type: "set"
  count: number
}

export interface ClearRowsMessage {
  type: "clear"
}

export interface RemoveRowMessage {
  type: "remove"
  rowData: RowData
}

export interface SwapRowsMessage {
  type: "swap"
}

export interface UpdateRowsMessage {
  type: "update"
}

type RowsUpdateMessage =
  SetRowsMessage |
  AddRowsMessage |
  UpdateRowsMessage |
  ClearRowsMessage |
  RemoveRowMessage |
  SwapRowsMessage

export interface RowData {
  id: string;
  label: Value<string>;
  isSelected: Value<boolean>;
}

export const rows = container<Array<RowData>, RowsUpdateMessage>({
  initialValue: [],
  name: "rows",
  update: (message, current) => {
    switch (message.type) {
      case "set":
        return { value: buildRows(message.count) }
      case "add":
        return { value: current.concat(buildRows(message.count)) }
      case "update":
        let updates: Array<StoreMessage<any>> = []
        for (let i = 0; i < current.length; i += 10) {
          updates.push(update(current[i].label, (label) => `${label} !!!`))
        }
        return {
          value: current,
          message: batch(updates)
        }
      case "swap":
        if (current.length > 998) {
          return { value: [current[0], current[998], ...current.slice(2, 998), current[1], current[999]] }
        } else {
          return { value: current }
        }
      case "remove":
        return { value: current.filter(row => row.id !== message.rowData.id) }
      case "clear":
        return { value: [] }
    }
  }
})

export const selectedRow = container<Value<boolean> | undefined>({
  initialValue: undefined
})

export const selectRow = (rowData: RowData, get: GetState) => {
  let messages: Array<StoreMessage<any>> = []
  messages.push(write(rowData.isSelected, true))
  const oldSelected = get(selectedRow)
  if (oldSelected !== undefined) {
    messages.push(write(oldSelected, false))
  }
  messages.push(write(selectedRow, rowData.isSelected))
  return batch(messages)
}

let nextId = 1

function buildRows(count: number): Array<RowData> {
  const data = new Array<RowData>(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: `${nextId++}`,
      label: value(`${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`),
      isSelected: value(false)
    }
  }
  return data;
}
