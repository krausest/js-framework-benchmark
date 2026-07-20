import { signal, For } from "sigwork";
import { buildData } from "./data.js";

export default () => {
   const selected = signal(null);
   const rows = signal([]);
   
   const run = () => rows.value = buildData(1000);
   const runlots = () => rows.value = buildData(10000);
   const add = () => rows.value = [...rows.value, ...buildData(1000)];
   const update = () => {
      const _rows = rows.value;
      for(let i=0; i<_rows.length; i+=10){
         _rows[i].label.value += " !!!";
      }
   }
   const clear = () => rows.value = [];
   const swaprows = () => {
      const _rows = rows.value;
      if( _rows.length > 998 ){
         const tmp = _rows[1];
         _rows[1] = _rows[998];
         _rows[998] = tmp;
      }
      rows.value = [..._rows];
   }
   const remove = (id) => {
      rows.value = rows.value.filter(row => row.id !== id);
   }
   
   const select = id => selected.value = id;

   return (
      <div class="container">
         <div class="jumbotron">
            <div class="row">
               <div class="col-md-6">
                  <h1>Sigwork</h1>
               </div>
               <div class="col-md-6">
                  <div class="row">
                     <div class="col-sm-6 smallpad"><button id="run" class="btn btn-primary btn-block" onClick={run}>Create 1,000 rows</button></div>
                     <div class="col-sm-6 smallpad"><button id="runlots" class="btn btn-primary btn-block" onClick={runlots}>Create 10,000 rows</button></div>
                     <div class="col-sm-6 smallpad"><button id="add" class="btn btn-primary btn-block" onClick={add}>Append 1,000 rows</button></div>
                     <div class="col-sm-6 smallpad"><button id="update" class="btn btn-primary btn-block" onClick={update}>Update every 10th row</button></div>
                     <div class="col-sm-6 smallpad"><button id="clear" class="btn btn-primary btn-block" onClick={clear}>Clear</button></div>
                     <div class="col-sm-6 smallpad"><button id="swaprows" class="btn btn-primary btn-block" onClick={swaprows}>Swap Rows</button></div>
                  </div>
               </div>
            </div>
         </div>
         <table class="table table-hover table-striped test-data">
            <tbody>
               {For(rows, "id", (row) => 
                  <tr class={() => selected.value === row.id ? "danger" : ""}>
                     <td class="col-md-1">{() => row.id}</td>
                     <td class="col-md-4">
                        <a onClick={() => select(row.id)}>{() => row.label.value}</a>
                     </td>
                     <td class="col-md-1">
                        <a onClick={() => remove(row.id)}>
                           <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </a>
                     </td>
                     <td class="col-md-6"></td>
                  </tr>
               )}
            </tbody>
         </table>
         <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>
   )
}