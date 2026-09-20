import { useState } from "react";
import { createRoot } from "react-dom/client";

interface BenchmarkRow {
  id: number;
  label: string;
}

const adjectives = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
] as const;
const colors = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange",
] as const;
const nouns = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
] as const;

let nextId = 1;

function random(maximum: number) {
  return Math.round(Math.random() * 1_000) % maximum;
}

function buildData(count: number): BenchmarkRow[] {
  const rows = Array<BenchmarkRow>(count);
  for (let index = 0; index < count; index += 1) {
    rows[index] = {
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`,
    };
  }
  return rows;
}

function Main() {
  const [rows, setRows] = useState<BenchmarkRow[]>([]);
  const [selected, setSelected] = useState(0);

  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>Farm React compiler keyed</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-sm-6 smallpad">
                <button
                  className="btn btn-primary btn-block"
                  id="run"
                  onClick={() => {
                    setRows(buildData(1_000));
                    setSelected(0);
                  }}
                  type="button"
                >
                  Create 1,000 rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button
                  className="btn btn-primary btn-block"
                  id="runlots"
                  onClick={() => {
                    setRows(buildData(10_000));
                    setSelected(0);
                  }}
                  type="button"
                >
                  Create 10,000 rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button
                  className="btn btn-primary btn-block"
                  id="add"
                  onClick={() => setRows((current) => current.concat(buildData(1_000)))}
                  type="button"
                >
                  Append 1,000 rows
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button
                  className="btn btn-primary btn-block"
                  id="update"
                  onClick={() =>
                    setRows((current) =>
                      current.map((row, index) =>
                        index % 10 === 0 ? { id: row.id, label: `${row.label} !!!` } : row,
                      ),
                    )
                  }
                  type="button"
                >
                  Update every 10th row
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button
                  className="btn btn-primary btn-block"
                  id="clear"
                  onClick={() => {
                    setRows([]);
                    setSelected(0);
                  }}
                  type="button"
                >
                  Clear
                </button>
              </div>
              <div className="col-sm-6 smallpad">
                <button
                  className="btn btn-primary btn-block"
                  id="swaprows"
                  onClick={() =>
                    setRows((current) => {
                      if (current.length < 999) return current;
                      const next = current.slice();
                      const second = next[1];
                      next[1] = next[998];
                      next[998] = second;
                      return next;
                    })
                  }
                  type="button"
                >
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
          {rows.map((row) => (
            <tr className={selected === row.id ? "danger" : ""} key={row.id}>
              <td className="col-md-1">{row.id}</td>
              <td className="col-md-4">
                <a onClick={() => setSelected(row.id)}>{row.label}</a>
              </td>
              <td className="col-md-1">
                <a
                  onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                >
                  <span aria-hidden="true" className="glyphicon glyphicon-remove" />
                </a>
              </td>
              <td className="col-md-6" />
            </tr>
          ))}
        </tbody>
      </table>
      <span aria-hidden="true" className="preloadicon glyphicon glyphicon-remove" />
    </div>
  );
}

const main = document.getElementById("main");
if (!main) throw new Error("Missing #main benchmark root.");

createRoot(main).render(<Main />);
