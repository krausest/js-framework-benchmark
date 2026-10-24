use rand::prelude::*;
use seed::{prelude::*, *};
use std::iter;
use web_sys::Event;

static ADJECTIVES: &[&'static str] = &[
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

static COLOURS: &[&'static str] = &[
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];

static NOUNS: &[&'static str] = &[
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];

// ------ ------
//     Init
// ------ ------

fn init(_: Url, _: &mut impl Orders<Msg>) -> Model {
    Model::default()
}

// ------ ------
//     Model
// ------ ------

type ID = usize;
type Count = usize;
type Step = usize;
type Position = usize;

struct Model {
    rows: Vec<Row>,
    selected: Option<ID>,
    generator: ThreadRng,
    previous_id: ID,
}

impl Default for Model {
    fn default() -> Self {
        Self {
            rows: Vec::new(),
            selected: None,
            generator: thread_rng(),
            previous_id: 0,
        }
    }
}

struct Row {
    id: ID,
    label: String,
}

impl Row {
    fn new(previous_id: &mut ID, generator: &mut ThreadRng) -> Self {
        *previous_id += 1;
        Self {
            id: *previous_id,
            label: format!(
                "{} {} {}",
                ADJECTIVES.choose(generator).unwrap(),
                COLOURS.choose(generator).unwrap(),
                NOUNS.choose(generator).unwrap(),
            ),
        }
    }

    fn position(id: ID, rows: &[Row]) -> Position {
        rows.iter().position(|row| row.id == id).unwrap()
    }
}

// ------ ------
//    Update
// ------ ------

enum Msg {
    Create(Count),
    Append(Count),
    Update(Step),
    Clear,
    Swap,
    Select(ID),
    Remove(ID),
}

fn update(msg: Msg, model: &mut Model, orders: &mut impl Orders<Msg>) {
    match msg {
        Msg::Create(count) => {
            model.rows.clear();
            model.rows.reserve(count);
            for _ in take_units(count) {
                model
                    .rows
                    .push(Row::new(&mut model.previous_id, &mut model.generator));
            }
        }
        Msg::Append(count) => {
            model.rows.reserve(count);
            for _ in take_units(count) {
                model
                    .rows
                    .push(Row::new(&mut model.previous_id, &mut model.generator));
            }
        }
        Msg::Update(step) => {
            for position in (0..model.rows.len()).step_by(step) {
                model.rows.get_mut(position).unwrap().label += " !!!";
            }
        }
        Msg::Clear => {
            model.rows.clear();
        }
        Msg::Swap => {
            if model.rows.len() > 998 {
                model.rows.swap(1, 998);
            }
        }
        Msg::Select(id) => model.selected = Some(id),
        Msg::Remove(id) => {
            model.rows.remove(Row::position(id, &model.rows));
        }
    }
    orders.force_render_now();
}

fn take_units(count: Count) -> impl Iterator<Item = ()> {
    iter::repeat(()).take(count)
}

// ------ ------
//     View
// ------ ------

fn view(model: &Model) -> Node<Msg> {
    div![
        C!["container"],
        jumbotron(),
        table(model),
        span![
            C!["preloadicon", "glyphicon", "glyphicon-remove"],
            attrs! {At::from("aria-hidden") => true},
        ]
    ]
}

fn jumbotron() -> Node<Msg> {
    div![
        C!["jumbotron"],
        div![
            C!["row"],
            div![C!["col-md-6"], h1!["Seed"],],
            div![
                C!["col-sm-6"],
                div![
                    C!["raw"],
                    action_button("run", "Create 1,000 rows", |_| Msg::Create(1_000)),
                    action_button("runlots", "Create 10,000 rows", |_| Msg::Create(10_000)),
                    action_button("add", "Append 1,000 rows", |_| Msg::Append(1_000)),
                    action_button("update", "Update every 10th row", |_| Msg::Update(10)),
                    action_button("clear", "Clear", |_| Msg::Clear),
                    action_button("swaprows", "Swap Rows", |_| Msg::Swap),
                ]
            ]
        ]
    ]
}

fn action_button(
    id: &'static str,
    title: &'static str,
    on_click: impl FnOnce(Event) -> Msg + Clone + 'static,
) -> Node<Msg> {
    div![
        C!["col-sm-6", "smallpad"],
        button![
            C!["btn", "btn-primary", "btn-block"],
            id!(id),
            attrs! {At::Type => "button"},
            ev(Ev::Click, on_click),
            title,
        ]
    ]
}

fn table(model: &Model) -> Node<Msg> {
    table![
        C!["table", "table-hover", "table-striped", "test-data"],
        tbody![
            id!("tbody"),
            model
                .rows
                .iter()
                .map(|row| view_row(row, model.selected == Some(row.id)))
        ]
    ]
}

fn view_row(row: &Row, is_selected: bool) -> Node<Msg> {
    let id = row.id;
    tr![
        attrs! {At::Class => if is_selected { AtValue::Some("danger".into()) } else { AtValue::Ignored } },
        td![C!["col-md-1"], id.to_string()],
        td![
            C!["col-md-4"],
            ev(Ev::Click, move |_| Msg::Select(id)),
            a![C!["lbl"], &row.label],
        ],
        td![
            C!["col-md-1"],
            a![
                C!["remove"],
                ev(Ev::Click, move |_| Msg::Remove(id)),
                span![
                    C!["glyphicon", "glyphicon-remove", "remove"],
                    attrs! {At::from("aria-hidden") => true}
                ],
            ]
        ],
        td![C!["col-md-6"],],
    ]
}

// ------ ------
//     Start
// ------ ------

#[wasm_bindgen(start)]
pub fn start() {
    App::start("main", init, update, view);
}
