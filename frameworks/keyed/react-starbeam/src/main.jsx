import { useStarbeam } from "@starbeam/react";
import { createRoot } from "react-dom/client";

import { Jumbotron } from './jumbotron';
import { TableData } from './data';

function Row({ selected, item, table }) {
  return (
    <tr className={selected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => table.select(item.id)}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => table.remove(item.id)}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </a>
      </td>
      <td className="col-md-6" />
    </tr>
  );
}

function Main() {
  return useStarbeam(() => {
    const table = new TableData();

    return () => {
      <div className="container">
        <Jumbotron table={table} />
        <table className="table table-hover table-striped test-data">
          <tbody>
            {table.data.map((item) => (
              <Row
                key={item.id}
                item={item}
                selected={selected === item.id}
                table={table}
              />
            ))}
          </tbody>
        </table>
        <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
      </div>
    };
  });
}


let main = document.getElementById('main')

createRoot(main).render(<Main />);
