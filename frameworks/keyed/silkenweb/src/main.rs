use std::{
    cell::{Cell, RefCell},
    ops::DerefMut,
    rc::Rc,
};

use futures_signals::{
    signal::{Mutable, SignalExt},
    signal_vec::{MutableVec, SignalVecExt},
};
use rand::{
    prelude::{SliceRandom, SmallRng},
    Rng, SeedableRng,
};
use silkenweb::{
    clone,
    dom::Template,
    elements::{
        html::{a, button, div, h1, span, table, tbody, td, tr, Div, Table, Tr},
        AriaElement, ElementEvents, HtmlElement,
    },
    mount,
    node::element::{Const, Element, ParentElement},
    value::Sig,
};
use wasm_bindgen::UnwrapThrowExt;

const ADJECTIVES: &[&str] = &[
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

const COLOURS: &[&str] = &[
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];
const NOUNS: &[&str] = &[
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];

#[derive(Clone)]
struct Row {
    id: usize,
    label: Mutable<String>,
}

impl Row {
    fn new(id: usize, rng: &mut impl Rng) -> Rc<Self> {
        Rc::new(Self {
            id,
            label: Mutable::new(format!(
                "{} {} {}",
                ADJECTIVES.choose(rng).unwrap_throw(),
                COLOURS.choose(rng).unwrap_throw(),
                NOUNS.choose(rng).unwrap_throw()
            )),
        })
    }

    fn render(&self, app: Rc<App>) -> Tr {
        app.row_template.instantiate(&RowParams {
            app: app.clone(),
            row: self.clone(),
        })
    }
}

struct RowParams {
    app: Rc<App>,
    row: Row,
}

struct App {
    data: MutableVec<Rc<Row>>,
    selected_row: Mutable<Option<usize>>,
    next_row_id: Cell<usize>,
    rng: RefCell<SmallRng>,
    row_template: Tr<Template<RowParams>, Const>,
}

impl App {
    fn new() -> Rc<Self> {
        let id_cell = td()
            .class("col-md-1")
            .on_instantiate(|td, RowParams { row, .. }| td.text(row.id.to_string()));
        let label_cell =
            td().class("col-md-4")
                .child(a().on_instantiate(|a, RowParams { app, row }| {
                    clone!(app);
                    let id = row.id;

                    a.text(Sig(row.label.signal_cloned()))
                        .on_click(move |_, _| app.select_row(id))
                }));
        let remove_cell = td().class("col-md-1").child(
            a().child(
                span()
                    .classes(["glyphicon", "glyphicon-remove"])
                    .aria_hidden("true"),
            )
            .on_instantiate(|a, RowParams { app, row }| {
                clone!(app);
                let id = row.id;
                a.on_click(move |_, _| app.remove_row(id))
            }),
        );
        let row_template = tr()
            .on_instantiate(|tr, RowParams { app, row }| {
                let row_id = row.id;
                tr.classes(Sig(app
                    .selected_row
                    .signal_cloned()
                    .map(move |selected_row| selected_row == Some(row_id))
                    .dedupe()
                    .map(|selected| selected.then_some("danger"))))
            })
            .children([id_cell, label_cell, remove_cell, td().class("col-md-6")])
            .freeze();

        Rc::new(Self {
            data: MutableVec::new(),
            selected_row: Mutable::new(None),
            next_row_id: Cell::new(1),
            rng: RefCell::new(SmallRng::seed_from_u64(0)),
            row_template,
        })
    }

    fn clear(&self) {
        self.data.lock_mut().clear();
        self.selected_row.replace(None);
    }

    fn append(&self, count: usize) {
        let mut rows = self.data.lock_mut();

        for _ in 0..count {
            rows.push_cloned(self.new_row());
        }
    }

    fn create(&self, count: usize) {
        let new_rows = (0..count).map(|_| self.new_row()).collect();
        self.data.lock_mut().replace_cloned(new_rows);
    }

    fn update(&self) {
        for row in self.data.lock_ref().iter().step_by(10) {
            row.label.lock_mut().push_str(" !!!");
        }
    }

    fn swap(&self) {
        self.data.lock_mut().swap(1, 998);
    }

    fn select_row(&self, row_id: usize) {
        self.selected_row.set(Some(row_id));
    }

    fn remove_row(&self, row_id: usize) {
        self.data.lock_mut().retain(|row| row.id != row_id);
    }

    fn new_row(&self) -> Rc<Row> {
        let next_row_id = self.next_row_id.get();
        self.next_row_id.set(next_row_id + 1);
        Row::new(next_row_id, self.rng.borrow_mut().deref_mut())
    }

    fn render(self: Rc<Self>) -> Div {
        div()
            .class("container")
            .child(self.clone().render_jumbotron())
            .child(self.render_table())
            .child(
                span()
                    .classes(["preloadicon", "glyphicon", "glyphicon-remove"])
                    .attribute("aria-hidden", "true"),
            )
    }

    fn render_jumbotron(self: Rc<Self>) -> Div {
        div().class("jumbotron").child(div().class("row").children([
            div().class("col-md-6").child(h1().text("Silkenweb keyed")),
            div().class("col-md-6").child(self.render_action_buttons()),
        ]))
    }

    fn render_action_buttons(self: &Rc<Self>) -> Div {
        div().class("row").children([
            self.render_button("run", "Create 1,000 rows", |app| app.create(1_000)),
            self.render_button("runlots", "Create 10,000 rows", |app| app.create(10_000)),
            self.render_button("add", "Append 1,000 rows", |app| app.append(1_000)),
            self.render_button("update", "Update every 10th row", |app| app.update()),
            self.render_button("clear", "Clear", |app| app.clear()),
            self.render_button("swaprows", "Swap Rows", |app| app.swap()),
        ])
    }

    fn render_button<F>(self: &Rc<Self>, id: &str, title: &str, mut on_click: F) -> Div
    where
        F: FnMut(&Self) + 'static,
    {
        let app = self.clone();

        div().classes(["col-sm-6", "smallpad"]).child(
            button()
                .classes(["btn", "btn-primary", "btn-block"])
                .r#type("button")
                .id(id)
                .text(title)
                .on_click(move |_, _| on_click(&app)),
        )
    }

    fn render_table(self: Rc<Self>) -> Table {
        table()
            .classes(["table", "table-hover", "table-striped", "test-data"])
            .child(
                tbody().children_signal(
                    self.data
                        .signal_vec_cloned()
                        .map(move |row| row.render(self.clone())),
                ),
            )
    }
}

pub fn main() {
    mount("app", App::new().render());
}
