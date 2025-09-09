import { app, createState, memo, A, BUTTON, DIV, H1, SPAN, TABLE, TBODY, TR, TD } from "@ryupold/vode";
import { buildData, DataEntry } from "./data";
import packageJson from "../package.json";

const s = createState({
    data: [] as DataEntry[],
    selected: null as string | null,
});

type State = typeof s;

app(document.body, s, (s: State) => [DIV, { class: "container", id: 'main' },
    [DIV, { class: "jumbotron" },
        [DIV, { class: "row" },
            [DIV, { class: "col-md-6" },
                [H1, `[V,{},d,e] ${packageJson.dependencies["@ryupold/vode"]} (non-keyed)`],
            ],
            [DIV, { class: "col-md-6" },
                [DIV, { class: "row" },
                    [DIV, { class: "col-sm-6 smallpad" },
                        [BUTTON, {
                            id: "run",
                            type: "button",
                            class: "btn btn-primary btn-block",
                            onclick: () => ({
                                data: buildData(1000),
                                selected: null,
                            })
                        }, "Create 1,000 rows"],
                    ],
                    [DIV, { class: "col-sm-6 smallpad" },
                        [BUTTON, {
                            id: "runlots",
                            type: "button",
                            class: "btn btn-primary btn-block",
                            onclick: () => ({
                                data: buildData(10000),
                                selected: null,
                            })
                        }, "Create 10,000 rows"],
                    ],
                    [DIV, { class: "col-sm-6 smallpad" },
                        [BUTTON, {
                            id: "add",
                            type: "button",
                            class: "btn btn-primary btn-block",
                            onclick: () => ({
                                data: s.data.concat(buildData(1000)),
                            })
                        }, "Append 1,000 rows"],
                    ],
                    [DIV, { class: "col-sm-6 smallpad" },
                        [BUTTON, {
                            id: "update",
                            type: "button",
                            class: "btn btn-primary btn-block",
                            onclick: () => ({
                                data: s.data.map((d, i) => i % 10 === 0 ? { id: d.id, label: d.label + " !!!" } : d),
                            }),
                        }, "Update every 10th row"],
                    ],
                    [DIV, { class: "col-sm-6 smallpad" },
                        [BUTTON, {
                            id: "clear",
                            type: "button",
                            class: "btn btn-primary btn-block",
                            onclick: { data: [], selected: null },
                        }, "Clear"],
                    ],
                    [DIV, { class: "col-sm-6 smallpad" },
                        [BUTTON, {
                            id: "swaprows",
                            type: "button",
                            class: "btn btn-primary btn-block",
                            onclick: () => {
                                if (s.data.length > 998) {
                                    const tmp = s.data[998];
                                    s.data[998] = s.data[1];
                                    s.data[1] = tmp;
                                }
                                return {};
                            }
                        }, "Swap Rows"],
                    ],
                ],
            ],
        ],
    ],

    [TABLE, { class: 'table table-hover table-striped test-data' },
        [TBODY,
            ...s.data.map(d => memo([d.id, d.label, s.selected === d.id], (s: State) => [TR,
                { class: { danger: s.selected === d.id } },
                [TD, { class: "col-md-1" }, d.id],
                [TD, { class: "col-md-4" },
                    [A, { onclick: { selected: d.id } }, d.label]
                ],
                [TD, { class: "col-md-1" },
                    [A, {
                        onclick: () => ({
                            data: s.data.filter(x => x.id !== d.id),
                            selected: s.selected === d.id ? null : s.selected,
                        })
                    },
                        [SPAN, { class: "glyphicon glyphicon-remove", "aria-hidden": "true" }]
                    ],
                ],
                [TD, { class: "col-md-6" }]
            ]))
        ],
    ],

    [SPAN, { class: "preloadicon glyphicon glyphicon-remove", "aria-hidden": "true" }]
]);