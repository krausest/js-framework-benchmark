use std::collections::BTreeMap;

use rand::seq::SliceRandom;
use ravel_web::{attr, collections::btree_map, el, event, format_text, run::run, text::text, View};

const ADJECTIVES: [&'static str; 25] = [
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
const COLORS: [&'static str; 11] = [
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];
const NOUNS: [&'static str; 13] = [
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];

#[derive(Clone)]
struct Item {
    id: usize,
    label: String,
}

struct Model {
    items: BTreeMap<usize, Item>,
    next_key: usize,
    selected_key: Option<usize>,
}

impl Model {
    fn clear(&mut self) {
        self.items.clear()
    }

    fn append(&mut self, nrows: usize) {
        let start = self.next_key;
        let end = start + nrows;
        self.next_key = end;

        self.items.extend((start..end).map(|i| {
            (
                i,
                Item {
                    id: i,
                    label: format!(
                        "{} {} {}",
                        ADJECTIVES.choose(&mut rand::thread_rng()).unwrap(),
                        COLORS.choose(&mut rand::thread_rng()).unwrap(),
                        NOUNS.choose(&mut rand::thread_rng()).unwrap(),
                    ),
                },
            )
        }))
    }

    fn update_every(&mut self, nrows: usize) {
        for item in self.items.values_mut().step_by(nrows) {
            item.label += " !!!";
        }
    }

    fn remove(&mut self, key: usize) {
        self.items.remove(&key);

        if self.selected_key == Some(key) {
            self.selected_key = None;
        }
    }

    fn swap_rows(&mut self, i: usize, j: usize) {
        if i == j || self.items.len() < i || self.items.len() < j {
            return;
        }

        let a = self.items.values().nth(i).unwrap().clone();
        let b = self.items.values().nth(j).unwrap().clone();

        *self.items.values_mut().nth(i).unwrap() = b;
        *self.items.values_mut().nth(j).unwrap() = a;
    }
}

fn row(key: usize, selected: bool, item: &Item) -> View!(Model, '_) {
    el::tr((
        attr::class(selected.then_some("danger")),
        el::td((attr::class("col-md-1"), format_text!("{}", item.id))),
        el::td((
            attr::class("col-md-4"),
            el::a((
                event::on_(event::Click, move |m: &mut Model| {
                    m.selected_key = Some(key)
                }),
                text(&item.label),
            )),
        )),
        el::td((
            attr::class("col-md-1"),
            el::a((
                event::on_(event::Click, move |m: &mut Model| m.remove(key)),
                el::span((
                    attr::class("glyphicon glyphicon-remove"),
                    attr::aria_hidden("true"),
                )),
            )),
        )),
        el::td(attr::class("col-md-6")),
    ))
}

fn action_button<F: 'static + FnMut(&mut Model)>(
    id_: &'static str,
    title: &'static str,
    on_click: F,
) -> View!(Model) {
    el::div((
        attr::class("col-sm-6 smallpad"),
        el::button((
            attr::type_("button"),
            attr::class("btn btn-primary btn-block"),
            attr::id(id_),
            event::on_(event::Click, on_click),
            title,
        )),
    ))
}

fn jumbotron() -> View!(Model) {
    el::div((
        attr::class("jumbotron"),
        el::div((
            attr::class("row"),
            el::div((attr::class("col-md-6"), el::h1("Ravel"))),
            el::div((
                attr::class("col-md-6"),
                el::div((
                    attr::class("row"),
                    action_button("run", "Create 1,000 rows", |m| {
                        m.clear();
                        m.append(1_000);
                    }),
                    action_button("runlots", "Create 10,000 rows", |m| {
                        m.clear();
                        m.append(10_000);
                    }),
                    action_button("add", "Append 1,000 rows", |m| {
                        m.append(1_000);
                    }),
                    action_button("update", "Update every 10th row", |m| {
                        m.update_every(10);
                    }),
                    action_button("clear", "Clear", |m| {
                        m.clear();
                    }),
                    action_button("swaprows", "Swap Rows", |m| {
                        m.swap_rows(1, 998);
                    }),
                )),
            )),
        )),
    ))
}

fn app(model: &Model) -> View!(Model, '_) {
    el::div((
        attr::class("container"),
        jumbotron(),
        el::table((
            attr::class("table table-hover table-striped test-data"),
            el::tbody(btree_map(&model.items, |cx, key, item| {
                cx.build(row(*key, model.selected_key == Some(*key), item))
            })),
        )),
        el::span((
            attr::class("preloadicon glyphicon glyphicon-remove"),
            attr::aria_hidden("true"),
        )),
    ))
}

fn main() {
    let mut model = Model {
        items: BTreeMap::new(),
        next_key: 1,
        selected_key: None,
    };

    let parent = gloo_utils::document().get_element_by_id("main").unwrap();

    wasm_bindgen_futures::spawn_local(async move {
        run(
            &parent,
            &mut model,
            |_| None,
            |cx, model| cx.build(app(model)),
        )
        .await
    });
}
