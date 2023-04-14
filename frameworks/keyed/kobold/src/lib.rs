use js_sys::Math;
use kobold::prelude::*;
use std::sync::atomic::{AtomicUsize, Ordering};
use wasm_bindgen::prelude::*;

const ADJECTIVES_LEN: usize = 25;
static ADJECTIVES: &[&str; ADJECTIVES_LEN] = &[
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

const COLOURS_LEN: usize = 11;
static COLOURS: &[&str; COLOURS_LEN] = &[
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];

const NOUNS_LEN: usize = 13;
const NOUNS: [&str; NOUNS_LEN] = [
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];

fn random(max: usize) -> usize {
    (Math::random() * 1000.0) as usize % max
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Label {
    key: usize,
    label: String,
}

struct State {
    labels: Vec<Label>,
    selected: Option<usize>,
}

impl State {
    fn new() -> Self {
        State {
            labels: Vec::new(),
            selected: None,
        }
    }
    fn remove(&mut self, key: usize) {
        self.labels.retain(|row| row.key != key)
    }
    fn run(&mut self) {
        self.labels = build_data(1_000);
        self.selected = None;
    }
    fn run_lots(&mut self) {
        self.labels = build_data(10_000);
        self.selected = None;
    }
    fn add(&mut self) {
        self.labels.append(&mut build_data(1_000))
    }
    fn update(&mut self) {
        for i in 0..(self.labels.len() / 10) {
            self.labels[i * 10].label += " !!!";
        }
    }
    fn clear(&mut self) {
        self.labels.clear();
        self.selected = None;
    }
    fn swap(&mut self, a: usize, b: usize) {
        if self.labels.len() > a + 1 && self.labels.len() > b {
            self.labels.swap(a, b);
        }
    }

    fn select(&mut self, id: usize) {
        self.selected = Some(id)
    }
}

static ID_COUNTER: AtomicUsize = AtomicUsize::new(1);

fn build_data(count: usize) -> Vec<Label> {
    let mut list = Vec::with_capacity(count);
    for _i in 0..count {
        let adjective = ADJECTIVES[random(ADJECTIVES_LEN)];
        let colour = COLOURS[random(COLOURS_LEN)];
        let noun = NOUNS[random(NOUNS_LEN)];
        let mut label = String::with_capacity(adjective.len() + colour.len() + noun.len() + 2);
        label.push_str(adjective);
        label.push(' ');
        label.push_str(colour);
        label.push(' ');
        label.push_str(noun);
        list.push(Label {
            key: ID_COUNTER.load(Ordering::Relaxed),
            label,
        });
        ID_COUNTER.store(ID_COUNTER.load(Ordering::Relaxed) + 1, Ordering::Relaxed);
    }
    list
}

#[component]
fn Row(label: Label, state: &Hook<State>) -> impl View {
    let is_in_danger = class!("danger" if state.selected == Some(label.key));
    bind! { state:
        let remove = move |_| state.remove(label.key);
        let select = move |_| state.select(label.key);
    }

    view! {
        <tr.{is_in_danger}>
            <td class="col-md-1">{label.key.to_string()}</td>
            <td class="col-md-4"><a onclick={select}>{label.label}</a></td>
            <td class="col-md-1"><a onclick={remove}><span class="glyphicon glyphicon-remove" aria_hidden="true"></span></a></td>
            <td class="col-md-6"/>
        </tr>
    }
}

enum ButtonAction {
    Run,
    RunLots,
    Add,
    Update,
    Clear,
    Swap,
}

#[component]
fn Button(action: ButtonAction, state: &Hook<State>) -> impl View {
    let (id, text) = match action {
        ButtonAction::Run => ("run", "Create 1,000 rows"),
        ButtonAction::RunLots => ("runlots", "Create 10,000 rows"),
        ButtonAction::Add => ("add", "Append 1,000 rows"),
        ButtonAction::Update => ("update", "Update every 10th row"),
        ButtonAction::Clear => ("clear", "Clear"),
        ButtonAction::Swap => ("swaprows", "Swap Rows"),
    };

    bind! { state:
        let onclick = move |_| match action {
            ButtonAction::Run => state.run(),
            ButtonAction::RunLots => state.run_lots(),
            ButtonAction::Add => state.add(),
            ButtonAction::Update => state.update(),
            ButtonAction::Clear => state.clear(),
            ButtonAction::Swap => state.swap(1,998),
        };
    }

    view! {
        <div class="col-sm-6 smallpad">
        <button
            id={id}
            class="btn btn-primary btn-block"
            type="button"
            {onclick}
        >
            { text }
        </button>
    </div>
    }
}

#[component]
fn App() -> impl View {
    stateful(State::new, |state| {
        view! {
            <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6"><h1>"Kobold"</h1></div>
                    <div class="col-md-6">
                        <div class="row">
                            <Button {state} action={ButtonAction::Run} />
                            <Button {state} action={ButtonAction::RunLots} />
                            <Button {state} action={ButtonAction::Add} />
                            <Button {state} action={ButtonAction::Update} />
                            <Button {state} action={ButtonAction::Clear} />
                            <Button {state} action={ButtonAction::Swap} />
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                { for state.labels.iter().map(|l| view! { <Row {state} label={l.to_owned()} />}) }
                </tbody>
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria_hidden="true" />
        </div>
        }
    })
}

#[wasm_bindgen(start)]
pub fn start() {
    kobold::start(view! {
        <App />
    });
}
