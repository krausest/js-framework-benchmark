use std::sync::atomic::{AtomicUsize, Ordering};

use rand::prelude::*;
use wasm_bindgen::prelude::*;
use xilem_web::{
    document,
    elements::html,
    interfaces::{Element, HtmlDivElement},
    App,
};

static ADJECTIVES: &[&str] = &[
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
];

static COLOURS: &[&str] = &[
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];

static NOUNS: &[&str] = &[
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];

struct RowData {
    id: usize,
    label: String,
}

static ID_COUNTER: AtomicUsize = AtomicUsize::new(1);

fn build_data(count: usize) -> Vec<RowData> {
    let mut thread_rng = thread_rng();

    let mut data = Vec::new();
    data.reserve_exact(count);

    for _i in 0..count {
        let adjective = ADJECTIVES.choose(&mut thread_rng).unwrap();
        let colour = COLOURS.choose(&mut thread_rng).unwrap();
        let noun = NOUNS.choose(&mut thread_rng).unwrap();
        let capacity = adjective.len() + colour.len() + noun.len() + 2;
        let mut label = String::with_capacity(capacity);
        label.push_str(adjective);
        label.push(' ');
        label.push_str(colour);
        label.push(' ');
        label.push_str(noun);

        let id = ID_COUNTER.load(Ordering::Relaxed);
        data.push(RowData { id, label });

        ID_COUNTER.store(ID_COUNTER.load(Ordering::Relaxed) + 1, Ordering::Relaxed);
    }

    data
}

struct AppState {
    rows: Vec<RowData>,
    selected: Option<usize>,
}

impl AppState {
    const fn new() -> Self {
        Self {
            rows: Vec::new(),
            selected: None,
        }
    }
}

fn run(state: &mut AppState, _: web_sys::MouseEvent) {
    state.rows = build_data(1_000);
    state.selected = None;
}

fn run_lots(state: &mut AppState, _: web_sys::MouseEvent) {
    state.rows = build_data(10_000);
    state.selected = None;
}

fn add(state: &mut AppState, _: web_sys::MouseEvent) {
    state.rows.append(&mut build_data(1_000));
}

fn update(state: &mut AppState, _: web_sys::MouseEvent) {
    state.rows.iter_mut().step_by(10).for_each(|row| {
        row.label.push_str(" !!!");
    });
}

fn clear(state: &mut AppState, _: web_sys::MouseEvent) {
    state.rows.clear();
    state.selected = None;
}

fn swap_rows(state: &mut AppState, _: web_sys::MouseEvent) {
    if state.rows.len() > 998 {
        state.rows.swap(1, 998);
    }
}

fn remove(state: &mut AppState, id: usize) {
    state.rows.retain(|row| row.id != id);
}

fn select(state: &mut AppState, id: usize) {
    state.selected = Some(id);
}

fn app_logic(state: &mut AppState) -> impl HtmlDivElement<AppState> {
    let rows = state
        .rows
        .iter()
        .map(|row| {
            let id = row.id;
            html::tr((
                html::td(row.id).class("col-md-1"),
                html::td(html::a(row.label.clone()).on_click(move |state, _| select(state, id)))
                    .class("col-md-4"),
                html::td(
                    html::a(
                        html::span(())
                            .attr("aria-hidden", "true")
                            .class("glyphicon glyphicon-remove"),
                    )
                    .on_click(move |state, _| remove(state, id)),
                )
                .class("col-md-1"),
                html::td(()).class("col-md-6"),
            ))
            .class(if Some(id) == state.selected {
                "danger"
            } else {
                ""
            })
        })
        .collect::<Vec<_>>();

    html::div((
        html::div(
            html::div((
                html::div(html::h1("Xilem")).class("col-md-6"),
                html::div(
                    html::div((
                        btn("run", "Create 1,000 rows", run),
                        btn("runlots", "Create 10,000 rows", run_lots),
                        btn("add", "Append 1,000 rows", add),
                        btn("update", "Update every 10th row", update),
                        btn("clear", "Clear", clear),
                        btn("swaprows", "Swap Rows", swap_rows),
                    ))
                    .class("row"),
                )
                .class("col-md-6"),
            ))
            .class("row"),
        )
        .class("jumbotron"),
        html::table(html::tbody(rows)).class("table table-hover table-striped test-data"),
        html::span(())
            .attr("aria-hidden", "true")
            .class("preloadicon glyphicon glyphicon-remove"),
    ))
    .class("container")
}

fn btn(
    id: &'static str,
    label: &'static str,
    click_fn: impl Fn(&mut AppState, web_sys::MouseEvent) + 'static,
) -> impl HtmlDivElement<AppState> {
    html::div(
        html::button(label)
            .id(id)
            .on_click(click_fn)
            .class("btn btn-primary btn-block"),
    )
    .class("col-sm-6 smallpad")
}

#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
    let root = document().query_selector("#main").unwrap().unwrap();
    App::new(root, AppState::new(), app_logic).run();
}
