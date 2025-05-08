import {$, copy, ref, proxy, onEach} from "./dist-min/aberdeen.js";
import { buildData } from "./build-dummy-data.js";

const data = proxy([]); // [{id, label}, ...]
const selected = proxy({}); // {[selectedId]: true} or {}

// Aberdeen mounts on document.body by default.
$('div', {id: "main"}, 'div.container', () => {

    // The buttons
    $('div.jumbotron', 'div.row', () => {
        $('div.col-md-6', 'h1:Aberdeen-"keyed"');
        $('div.col-md-6', 'div.row', () => {
            $('div.col-sm-6.smallpad', 'button.btn.btn-primary.btn-block:Create 1,000 rows', {
                type: "button",
                id: "run",
                click: () => data.splice(0, data.length, ...buildData())
            });
            $('div.col-sm-6.smallpad', 'button.btn.btn-primary.btn-block:Create 10,000 rows', {
                type: "button",
                id: "runlots",
                click: () => data.splice(0, data.length, ...buildData(10000))
            });
            $('div.col-sm-6.smallpad', 'button.btn.btn-primary.btn-block:Append 1,000 rows', {
                type: "button",
                id: "add",
                click: () => data.push(...buildData())
            });
            $('div.col-sm-6.smallpad', 'button.btn.btn-primary.btn-block:Update every 10th row', {
                type: "button",
                id: "update",
                click: () => {
                    for(let i=0; i<data.length; i+=10) {
                        data[i].label += ' !!!';
                    }
                }
            });
            $('div.col-sm-6.smallpad', 'button.btn.btn-primary.btn-block:Clear', {
                type: "button",
                id: "clear",
                click: () => data.length = 0
            });
            $('div.col-sm-6.smallpad', 'button.btn.btn-primary.btn-block:Swap Rows', {
                type: "button",
                id: "swaprows",
                click: () => {
                    if (data.length > 998) [data[1], data[998]] = [data[998], data[1]];
                }
            });
        });
    });

    // The table
    $('table.table.table-hover.table-striped.test-data', 'tbody', () => {
        onEach(data, (item, index) => {
            $('tr', () => {
                $({".danger": selected[item.id]})
                $('td.col-md-1:'+item.id);
                $('td.col-md-4', 'a', {text: ref(item,'label')}, {
                    click: function() {
                        copy(selected, {[item.id]: true})
                    }
                });
                $('td.col-md-1', 'a', 'span.glyphicon.glyphicon-remove', {
                    "aria-hidden": "true",
                    click: () => {
                        // This is very slow, as all later items need to be recreated.
                        data.splice(index, 1);
                    }
                });
                $('td.col-md-6');
            });
        })
    });
});
