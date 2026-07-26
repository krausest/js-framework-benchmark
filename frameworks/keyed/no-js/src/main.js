const A = ["pretty","large","big","small","tall","short","long","handsome","plain","quaint","clean","elegant","easy","angry","crazy","helpful","mushy","odd","unsightly","adorable","important","inexpensive","cheap","expensive","fancy"];
const C = ["red","yellow","blue","green","pink","brown","purple","brown","white","black","orange"];
const N = ["table","chair","house","bbq","desk","car","pony","cookie","sandwich","burger","pizza","mouse","keyboard"];

let id = 1;

function random(max) {
  return (Math.random() * max) | 0;
}

function buildData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: id++,
      label: A[random(A.length)] + " " + C[random(C.length)] + " " + N[random(N.length)],
    });
  }
  return data;
}

function updateData(rows) {
  for (let i = 0; i < rows.length; i += 10) rows[i].label += " !!!";
  return rows.slice();
}

function swapRows(rows) {
  if (rows.length > 998) {
    const tmp = rows[1];
    rows[1] = rows[998];
    rows[998] = tmp;
  }
  return rows.slice();
}

NoJS.global("build", buildData);
NoJS.global("upd", updateData);
NoJS.global("swp", swapRows);
