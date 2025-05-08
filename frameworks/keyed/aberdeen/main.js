/**
 * This implementation uses a sprinkle of non-idiomatic optimization, as the 
 * delete-row operation doesn't combine well with the row-position based
 * operations (swap and update) in Aberdeen.
 * 
 * Aberdeen excels at showing changing list of things in some specified
 * sort order (which would be just as fast as sorting by array index, as
 * demonstrated by the sort-by-label bonus feature), and doing modifications
 * by id. (Which seems a lot more common than what js-framework-benchmark
 * wants?) 
 * 
 * The idiomatic implementation (with very slow deletes) is in `idiomatic.js`.
 */

import {$, copy, ref, proxy, onEach} from "./dist/aberdeen.js";
import { buildData } from "./build-dummy-data.js";

const unproxiedData = []; // [{id, label}, ...]
const data = proxy(unproxiedData); // [{id, label}, ...]
const selected = proxy({}); // {[selectedId]: true} or {}
const sortByLabel = proxy(false);

// Aberdeen mounts on document.body by default.
$('div', {id: "main"}, 'div.container', () => {

    // The buttons
    $('div.jumbotron', 'div.row', () => {
        $('div.col-md-6', () => {
            $('h1:Aberdeen-"keyed"');
            $('div.checkbox', 'label', () => {
                $('input', {type: 'checkbox'}, {bind: sortByLabel})
                $(":Sort by label");
            });
        })
        $('div.col-md-6', 'div.row', () => {
            $('div.col-sm-6.smallpad', 'button.btn.btn-primary.btn-block:Create 1,000 rows', {
                type: "button",
                id: "run",
                click: () => copy(data, buildData())
            });
            $('div.col-sm-6.smallpad', 'button.btn.btn-primary.btn-block:Create 10,000 rows', {
                type: "button",
                id: "runlots",
                click: () => copy(data, buildData(10000))
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
                    // We need to iterate, because our array can be sparse due to deletes.
                    // For performance, we're scanning through the unproxied version of our data.
                    let cnt = 0;
                    for(let i=0; i<unproxiedData.length; i++) {
                        if (unproxiedData[i]) {
                            if (!(cnt++ % 10)) data[i].label += ' !!!';
                        }
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
                    // We need to iterate, because our array can be sparse due to deletes.
                    // For performance, we're scanning through the unproxied version of our data.
                    let cnt = 0, first, second;
                    for(let i=0; i<unproxiedData.length; i++) {
                        if (unproxiedData[i]) {
                            if (cnt === 1) first = i;
                            else if (cnt === 998) {
                                second = i;
                                [data[first], data[second]] = [data[second], data[first]];
                                break;
                            }
                            cnt++;
                        }
                    }
                }
            });
        });
    });

    // The table
    $('table.table.table-hover.table-striped.test-data', 'tbody', () => {
        onEach(data, (item, index) => {
            $('tr', () => {
                $(() => {
                    if (selected[item.id]) $('.danger');
                })
                $('td.col-md-1:'+item.id);
                $('td.col-md-4', 'a', {text: ref(item,'label')}, {
                    click: function() {
                        copy(selected, {[item.id]: true})
                    }
                });
                $('td.col-md-1', 'a', 'span.glyphicon.glyphicon-remove', {
                    "aria-hidden": "true",
                    click: () => delete data[index]
                });
                $('td.col-md-6');
            });
        }, sortByLabel.value ? item=>item.label : undefined);
    });
});
