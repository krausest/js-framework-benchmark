import React from "react";
import { Row } from "./Row";
import { useApp } from "./app";

export function Rows() {
  const { state } = useApp();

  return (
    <table className="table table-hover table-striped test-data">
      <tbody>
        {state.data.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </tbody>
    </table>
  );
}
