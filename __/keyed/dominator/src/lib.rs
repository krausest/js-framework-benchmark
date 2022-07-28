use wasm_bindgen::prelude::*;
use std::rc::Rc;
use std::sync::atomic::{AtomicUsize, Ordering};
use js_sys::Math;
use web_sys::window;
use futures_signals::signal::Mutable;
use futures_signals::signal_vec::{MutableVec, SignalVecExt};
use dominator::{Dom, html, clone, events};


const ADJECTIVES_LEN: usize = 25;
const ADJECTIVES_LEN_F64: f64 = ADJECTIVES_LEN as f64;
const ADJECTIVES: [&str; ADJECTIVES_LEN] = [
    "pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain",
    "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd",
    "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy",
];

const COLOURS_LEN: usize = 11;
const COLOURS_LEN_F64: f64 = COLOURS_LEN as f64;
const COLOURS: [&str; COLOURS_LEN] = [
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];

const NOUNS_LEN: usize = 13;
const NOUNS_LEN_F64: f64 = NOUNS_LEN as f64;
const NOUNS: [&str; NOUNS_LEN] = [
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];

fn random(max: f64) -> usize {
    ((Math::random() * 1000.0) % max) as usize
}


#[inline]
fn col_md_6(children: &mut [Dom]) -> Dom {
    html!("div", {
        .class("col-md-6")
        .children(children)
    })
}

#[inline]
fn row(children: &mut [Dom]) -> Dom {
    html!("div", {
        .class("row")
        .children(children)
    })
}

#[inline]
fn button<F>(id: &str, title: &str, mut on_click: F) -> Dom where F: FnMut() + 'static {
    html!("div", {
        .class(["col-sm-6", "smallpad"])
        .children(&mut [
            html!("button", {
                .class(["btn", "btn-primary", "btn-block"])
                .attribute("type", "button")
                .attribute("id", id)
                .text(title)
                .event(move |_: events::Click| {
                    on_click();
                })
            }),
        ])
    })
}


struct Row {
    id: usize,
    label: Mutable<String>,
}

impl Row {
    fn new() -> Rc<Self> {
        static ID_COUNTER: AtomicUsize = AtomicUsize::new(1);

        let adjective = ADJECTIVES[random(ADJECTIVES_LEN_F64)];
        let colour = COLOURS[random(COLOURS_LEN_F64)];
        let noun = NOUNS[random(NOUNS_LEN_F64)];

        Rc::new(Self {
            id: ID_COUNTER.fetch_add(1, Ordering::SeqCst),
            label: Mutable::new(format!("{} {} {}", adjective, colour, noun)),
        })
    }

    fn render(row: Rc<Self>, state: Rc<State>) -> Dom {
        let id = row.id;

        html!("tr", {
            .class_signal("danger", state.selected_row.signal_ref(move |selected| {
                if let Some(selected) = selected {
                    *selected == id

                } else {
                    false
                }
            }))

            .children(&mut [
                html!("td", {
                    .class("col-md-1")
                    .text(&id.to_string())
                }),

                html!("td", {
                    .class("col-md-4")
                    .children(&mut [
                        html!("a", {
                            .text_signal(row.label.signal_cloned())
                            .event(clone!(state => move |_: events::Click| {
                                state.select_row(id);
                            }))
                        }),
                    ])
                }),

                html!("td", {
                    .class("col-md-1")
                    .children(&mut [
                        html!("a", {
                            .children(&mut [
                                html!("span", {
                                    .class(["glyphicon", "glyphicon-remove"])
                                    .attribute("aria-hidden", "true")
                                }),
                            ])
                            .event(move |_: events::Click| {
                                state.remove_row(id);
                            })
                        }),
                    ])
                }),

                html!("td", {
                    .class("col-md-6")
                }),
            ])
        })
    }
}


struct State {
    rows: MutableVec<Rc<Row>>,
    selected_row: Mutable<Option<usize>>,
}

impl State {
    fn new() -> Rc<Self> {
        Rc::new(Self {
            rows: MutableVec::new(),
            selected_row: Mutable::new(None),
        })
    }

    fn clear(&self) {
        self.rows.lock_mut().clear();
        self.selected_row.set(None);
    }

    fn append(&self, count: usize) {
        let mut rows = self.rows.lock_mut();

        for _ in 0..count {
            rows.push_cloned(Row::new());
        }
    }

    fn create(&self, count: usize) {
        let new_rows = (0..count).map(|_| Row::new()).collect();
        self.rows.lock_mut().replace_cloned(new_rows);
    }

    fn update(&self) {
        for row in self.rows.lock_ref().iter().step_by(10) {
            row.label.lock_mut().push_str(" !!!");
        }
    }

    fn swap(&self) {
        let mut rows = self.rows.lock_mut();

        if rows.len() > 998 {
            rows.move_from_to(1, 998);
            rows.move_from_to(998 - 1, 1);
        }
    }

    fn select_row(&self, row_id: usize) {
        self.selected_row.set(Some(row_id));
    }

    fn remove_row(&self, row_id: usize) {
        self.rows.lock_mut().retain(|row| {
            row.id != row_id
        });
    }

    fn render_jumbotron(state: Rc<Self>) -> Dom {
        html!("div", {
            .class("jumbotron")
            .children(&mut [
                row(&mut [
                    col_md_6(&mut [
                        html!("h1", {
                            .text("Dominator keyed")
                        }),
                    ]),

                    col_md_6(&mut [
                        row(&mut [
                            button("run", "Create 1,000 rows", clone!(state => move || {
                                state.create(1_000);
                            })),

                            button("runlots", "Create 10,000 rows", clone!(state => move || {
                                state.create(10_000);
                            })),

                            button("add", "Append 1,000 rows", clone!(state => move || {
                                state.append(1_000);
                            })),

                            button("update", "Update every 10th row", clone!(state => move || {
                                state.update();
                            })),

                            button("clear", "Clear", clone!(state => move || {
                                state.clear();
                            })),

                            button("swaprows", "Swap Rows", move || {
                                state.swap();
                            }),
                        ]),
                    ]),
                ]),
            ])
        })
    }

    fn render_table(state: Rc<Self>) -> Dom {
        html!("table", {
            .class(["table", "table-hover", "table-striped", "test-data"])
            .children(&mut [
                html!("tbody", {
                    .children_signal_vec(state.rows.signal_vec_cloned().map(move |row| {
                        Row::render(row, state.clone())
                    }))
                })
            ])
        })
    }

    fn render(state: Rc<Self>) -> Dom {
        html!("div", {
            .class("container")
            .children(&mut [
                State::render_jumbotron(state.clone()),

                State::render_table(state),

                html!("span", {
                    .class(["preloadicon", "glyphicon", "glyphicon-remove"])
                    .attribute("aria-hidden", "true")
                }),
            ])
        })
    }
}


#[wasm_bindgen(start)]
pub fn main_js() {
    let state = State::new();

    let element = window()
        .unwrap_throw()
        .document()
        .unwrap_throw()
        .get_element_by_id("main")
        .unwrap_throw();

    dominator::append_dom(&element, State::render(state));
}
