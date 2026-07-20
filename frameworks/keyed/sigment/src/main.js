import {createTemplate, gve, batch, paintFinish, MyApp} from "sigment";
MyApp.cleanHtml(false);

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'],
      colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'white', 'black', 'orange'],
      nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = (d) => d[Math.floor(Math.random() * d.length)];
const labels = Array.from({ length: 1000 }, () => `${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`);
let rowCounter = 0;

const myRowTmpl = createTemplate(tr(
    td({ class: "col-md-1" }, "?"), 
    td({ class: "col-md-4" }, a("?")), 
    td({ class: "col-md-1" }, a(span({ class: "glyphicon glyphicon-remove", "aria-hidden": "true" }))),
    td({ class: "col-md-6" })
));

function Benchmarktest() {
	let selectedRow = null; 
    paintFinish(() => {
            const tb = gve("tbody");
          

            tb.onclick = ({target: t}) => {
                const rowEl = t.closest('tr');
                if (!rowEl) return;
                const row = gve(rowEl);

                if (t.classList.contains('glyphicon-remove')) {
                    if (selectedRow === rowEl) selectedRow = null;
                    return row.destroy();
                }
                
                if (t.nodeName === 'A') {
                    if (selectedRow === rowEl) return;

                    if (selectedRow) {
                        selectedRow.classList.remove('danger');
                    }
                    
                    rowEl.classList.add('danger');
                    selectedRow = rowEl;
                }
            };
    });

    const runBenchmark = (count, mode = false) => {
		if (!mode) selectedRow = null;
        const data = Array.from({ length: count }, () => [++rowCounter, labels[rowCounter % 1000]]);
        batch(data, myRowTmpl, "tbody", count, mode);
    };

    const btns = [
        ["run", "Create 1,000", () => runBenchmark(1000)],
        ["runlots", "Create 10,000", () => runBenchmark(10000)],
        ["add", "Append 1,000", () => runBenchmark(1000, true)],
        ["update", "Update 10th", () => { const b = gve("tbody"); for(let i=0; i<b.childElementCount; i+=10) b.get(i).addVal(1, " !!!") }],
        ["clear", "Clear", () => { 
            selectedRow = null; 
            gve("tbody").clear(); 
        }],
        ["swaprows", "Swap Rows", () => gve("tbody").get(1).swapWith(998)]
    ];

    return div({ class: "container" },
        div({ class: "jumbotron" }, div({ class: "row" },
            div({ class: "col-md-6" }, h1("Sigment-keyed")),
            div({ class: "col-md-6" }, div({ class: "row" }, 
                btns.map(([i, t, fn]) => div({ class: "col-sm-6 smallpad" }, 
                    button({ id: i, class: "btn btn-primary btn-block", onclick: fn }, t)))
            ))
        )),
        table({ class: "table table-hover table-striped test-data" }, tbody({ id: "tbody" })),
        span({ class: "preloadicon glyphicon glyphicon-remove" })
    );
}
document.getElementById("root")?.appendChild(Benchmarktest());
