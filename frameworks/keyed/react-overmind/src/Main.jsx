import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "overmind-react";
import { app } from "./app";
import { Jumbotron } from "./Jumbotron";
import { Rows } from "./Rows";

function App() {
  return (
    <div className="container">
      <Jumbotron />
      <Rows />
      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      />
    </div>
  );
}

ReactDOM.render(
  <Provider value={app}>
    <App />
  </Provider>,
  document.getElementById("main")
);
