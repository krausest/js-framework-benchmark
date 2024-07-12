use std::sync::atomic::{AtomicUsize, Ordering};

use rand::prelude::*;
use wasm_bindgen::prelude::*;
use xilem_web::{
    core::memoize,
    elements::html::*,
    get_element_by_id,
    interfaces::{Element as _, HtmlDivElement, HtmlTableRowElement},
    App, DomView,
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

struct Row {
    id: usize,
    label: String,
}

static ID_COUNTER: AtomicUsize = AtomicUsize::new(1);

fn generate_label() -> String {
    let mut thread_rng = thread_rng();
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
    label
}

fn create_rows(count: usize) -> impl ExactSizeIterator<Item = Row> {
    let id = ID_COUNTER.load(Ordering::Relaxed);
    ID_COUNTER.store(id + count, Ordering::Relaxed);

    (id..(id + count)).map(move |id| Row {
        id,
        label: generate_label(),
    })
}

struct AppState {
    rows: Vec<Row>,
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

fn run(state: &mut AppState) {
    state.rows.clear();
    state.rows.extend(create_rows(1_000));
}

fn run_lots(state: &mut AppState) {
    state.rows.clear();
    state.rows.extend(create_rows(10_000));
}

fn add(state: &mut AppState) {
    state.rows.extend(create_rows(1_000));
}

fn update(state: &mut AppState) {
    state.rows.iter_mut().step_by(10).for_each(|row| {
        row.label.push_str(" !!!");
    });
}

fn clear(state: &mut AppState) {
    state.rows.clear();
    state.selected = None;
}

fn swap_rows(state: &mut AppState) {
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

fn app_logic(state: &mut AppState) -> impl DomView<AppState> {
    let rows = state
        .rows
        .iter()
        .map(|r| memoized_row(r, state.selected))
        .collect::<Vec<_>>();

    div((
        control_buttons(),
        table(tbody(rows)).class(["table", "table-hover", "table-striped", "test-data"]),
        span(()).attr("aria-hidden", "true").class([
            "preloadicon",
            "glyphicon",
            "glyphicon-remove",
        ]),
    ))
    .class("container")
}

fn control_buttons() -> impl HtmlDivElement<AppState> {
    memoize((), |_| {
        div(div((
            div(h1("Xilem (non-keyed)")).class("col-md-6"),
            div(div((
                control_button("run", "Create 1,000 rows", run),
                control_button("runlots", "Create 10,000 rows", run_lots),
                control_button("add", "Append 1,000 rows", add),
                control_button("update", "Update every 10th row", update),
                control_button("clear", "Clear", clear),
                control_button("swaprows", "Swap Rows", swap_rows),
            ))
            .class("row"))
            .class("col-md-6"),
        ))
        .class("row"))
        .class("jumbotron")
    })
}

fn control_button(
    id: &'static str,
    label: &'static str,
    click_fn: impl Fn(&mut AppState) + 'static,
) -> impl HtmlDivElement<AppState> {
    div(button(label)
        .attr("type", "button")
        .id(id)
        .on_click(move |state, _| click_fn(state))
        .class(["btn", "btn-primary", "btn-block"]))
    .class("col-sm-6 smallpad")
}

fn memoized_row(r: &Row, selected: Option<usize>) -> impl HtmlTableRowElement<AppState> {
    memoize(
        (r.id, r.label.clone(), selected == Some(r.id)),
        |(id, label, selected)| row(label.clone(), *id, *selected),
    )
}

fn row(label: String, id: usize, selected: bool) -> impl HtmlTableRowElement<AppState> {
    tr((
        td(id.to_string()).class("col-md-1"),
        td(a(label.clone()).on_click(move |state, _| select(state, id))).class("col-md-4"),
        td(a(span(())
            .class(["glyphicon", "glyphicon-remove"])
            .attr("aria-hidden", "true"))
        .on_click(move |state, _| remove(state, id)))
        .class("col-md-1"),
        td(()).class("col-md-6"),
    ))
    .class(selected.then_some("danger"))
}

#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
    App::new(get_element_by_id("main"), AppState::new(), app_logic).run();
}
