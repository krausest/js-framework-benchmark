import { useSetup, useReactive } from "@starbeam/react";
import ReactDOM from "react-dom/client";
import React, { StrictMode } from 'react';

import { Jumbotron } from './jumbotron';
import { TableData } from './data';

function Row({ table, datum }) {
  return useReactive(() => {
    let { id, label, isSelected } = datum;

    return (
      <tr className={isSelected ? "danger" : ""}>
        <td className="col-md-1">{id}</td>
        <td className="col-md-4">
          <a onClick={() => table.select(id)}>{label}</a>
        </td>
        <td className="col-md-1">
          <a onClick={() => table.remove(id)}>
            <span className="glyphicon glyphicon-remove" aria-hidden="true" />
          </a>
        </td>
        <td className="col-md-6" />
      </tr>
    )
  });
}

function Rows({ table }) {
  return useReactive(() => {
    return table.dataArray.map(datum => {
      return <Row key={datum.id} datum={datum} table={table} />
    });
  });
}


function Main() {
  const table = useSetup(() => new TableData());

  return <div className="container">
    <Jumbotron table={table} />

    <table className="table table-hover table-striped test-data">
      <tbody>
        <Rows table={table} />
      </tbody>
    </table>

    <Preload />
  </div>
}

function Preload() {
  return <span
    className="preloadicon glyphicon glyphicon-remove"
    aria-hidden="true"
  />;
}


let main = document.getElementById('main')


let root = ReactDOM.createRoot(main);
root.render(
  <StrictMode>
    <Main />
  </StrictMode>
);
