import { useReducer } from "better-react";
import { createRoot, getScheduleAskTime, useDom } from "better-react-dom";
import { useMap } from "better-react-helper";


const random = (max: number) => Math.round(Math.random() * 1000) % max;

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

const buildData = (count: number) => {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }

  return data;
};

const initialState: State = { data: [], selected: 0 };

type State = {
  data: {
    id: number
    label: string
  }[],
  selected: number
}
type Action = {
  type: "RUN"
} | {
  type: "RUN_LOTS"
} | {
  type: "ADD"
} | {
  type: "UPDATE"
} | {
  type: "CLEAR"
} | {
  type: "SWAP_ROWS"
} | {
  type: "REMOVE"
  id: number
} | {
  type: "SELECT"
  id: number
}
const listReducer = (state: State, action: Action) => {
  const { data, selected } = state;

  switch (action.type) {
    case 'RUN':
      return { data: buildData(1000), selected: 0 };
    case 'RUN_LOTS':
      return { data: buildData(10000), selected: 0 };
    case 'ADD':
      return { data: data.concat(buildData(1000)), selected };
    case 'UPDATE': {
      const newData = data.slice(0);

      for (let i = 0; i < newData.length; i += 10) {
        const r = newData[i];

        newData[i] = { id: r.id, label: r.label + " !!!" };
      }

      return { data: newData, selected };
    }
    case 'CLEAR':
      return { data: [], selected: 0 };
    case 'SWAP_ROWS':
      return data.length > 998 ? { data: [data[0], data[998], ...data.slice(2, 998), data[1], data[999]], selected } : state;
    case 'REMOVE': {
      const idx = data.findIndex((d) => d.id === action.id);

      return { data: [...data.slice(0, idx), ...data.slice(idx + 1)], selected };
    }
    case 'SELECT':
      return { data, selected: action.id };
    default:
      return state;
  }
};

function Button({
  id,
  onClick,
  title
}: {
  id: string
  onClick(): void
  title: string
}) {
  useDom("div", {
    className: "col-sm-6 smallpad",
    children() {
      useDom("div", {
        id,
        className: "btn btn-primary btn-block",
        onClick,
        textContent: title
      })
    }
  })
}

function getId(v: { id: number }) {
  return v.id
}
function Main() {
  const [{ data, selected }, dispatch] = useReducer(listReducer, initialState)
  useDom("div", {
    className: "container",
    children() {
      useDom("div", {
        className: "jumbotron",
        children() {
          useDom("div", {
            className: "row",
            children() {
              useDom("div", {
                className: "col-md-6",
                children() {
                  useDom("h1", {
                    textContent: "better react keyed"
                  })
                },
              })
              useDom("div", {
                className: "col-md-6",
                children() {
                  useDom("div", {
                    className: "row",
                    children() {
                      Button({
                        id: "run",
                        title: "Create 1,000 rows",
                        onClick() {
                          dispatch({ type: 'RUN' })
                        },
                      })
                      Button({
                        id: "runlots",
                        title: "Create 10,000 rows",
                        onClick() {
                          dispatch({ type: 'RUN_LOTS' })
                        },
                      })
                      Button({
                        id: "add",
                        title: "Append 1,000 rows",
                        onClick() {
                          dispatch({ type: 'ADD' })
                        },
                      })
                      Button({
                        id: "update",
                        title: "Update every 10th row",
                        onClick() {
                          dispatch({ type: 'UPDATE' })
                        },
                      })
                      Button({
                        id: "clear",
                        title: "Clear",
                        onClick() {
                          dispatch({ type: 'CLEAR' })
                        },
                      })
                      Button({
                        id: "swaprows",
                        title: "Swap",
                        onClick() {
                          dispatch({ type: 'SWAP_ROWS' })
                        },
                      })
                    }
                  })
                },
              })
            },
          })
        },
      }, [dispatch])

      useDom("table", {
        className: "table table-hover table-striped test-data",
        children() {
          useDom("tbody", {
            children() {
              useMap(data, getId, function (row, i) {
                useDom("tr", {
                  className: selected == row.id ? "danger" : "",
                  children() {
                    useDom("td", {
                      className: "col-md-1",
                      textContent: row.id + ''
                    })
                    useDom("td", {
                      className: "col-md-4",
                      children() {
                        useDom("a", {
                          onClick() {
                            dispatch({ type: 'SELECT', id: row.id })
                          },
                          textContent: row.label
                        })
                      },
                    })
                    useDom("td", {
                      className: "col-md-1",
                      children() {
                        useDom("a", {
                          onClick() {
                            dispatch({ type: 'REMOVE', id: row.id })
                          },
                          children() {
                            useDom("span", {
                              className: "glyphicon glyphicon-remove",
                              "aria-hidden": true
                            })
                          },
                        })
                      },
                    })
                    useDom("td", {
                      className: "col-md-6"
                    })
                  },
                }, [row])
              })
            },
          })
        },
      })
      useDom("span", {
        className: "preloadicon glyphicon glyphicon-remove",
        "aria-hidden": true
      })
    },
  })
}



createRoot(document.getElementById("main")!, Main, getScheduleAskTime)
