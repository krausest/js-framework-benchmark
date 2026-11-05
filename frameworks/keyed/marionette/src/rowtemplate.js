import { html } from "lit-html";

export default ({ id, label }) => html`
  <td class="col-md-1">${id}</td>
  <td class="col-md-4"><a class="js-link">${label}</a></td>
  <td class="col-md-1">
    <a class="js-del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
  </td>
  <td class="col-md-6"></td>
`;
