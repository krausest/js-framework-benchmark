use js_sys::Math;
use kobold::prelude::*;
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
struct RowData {
    id: usize,
    label: String,
}

struct State {
    rows: Vec<RowData>,
    selected: Option<usize>,
    last: usize,
}

impl State {
    fn new() -> Self {
        State {
            rows: Vec::new(),
            selected: None,
            last: 0,
        }
    }
    fn append_rows(&mut self, count: usize) {
        self.rows.reserve_exact(count);
        let d = self.last + 1;
        for i in 0..count {
            let adjective = ADJECTIVES[random(ADJECTIVES_LEN)];
            let colour = COLOURS[random(COLOURS_LEN)];
            let noun = NOUNS[random(NOUNS_LEN)];
            let mut label = String::with_capacity(adjective.len() + colour.len() + noun.len() + 2);
            label.push_str(adjective);
            label.push(' ');
            label.push_str(colour);
            label.push(' ');
            label.push_str(noun);
            self.rows.push(RowData {
                id: i + d,
                label,
            });
        }
        self.last += count;
    }

    fn remove(&mut self, id: usize) {
        self.rows.remove(id);
    }

    fn run(&mut self) {
        self.clear();
        self.append_rows(1_000)
    }
    fn run_lots(&mut self) {
        self.clear();
        self.append_rows(10_000)
    }
    fn add(&mut self) {
        self.append_rows(1_000)
    }
    fn update(&mut self) {
        self.rows.iter_mut().step_by(10).for_each(|row| {
            row.label.reserve_exact(4);
            row.label.push_str(" !!!")
        });
    }
    fn clear(&mut self) {
        self.rows = Vec::new();
        self.selected = None
    }
    fn swap(&mut self) {
        if self.rows.len() > 998 {
            self.rows.swap(1, 998);
        }
    }
    fn select(&mut self, id: usize) {
        self.selected = Some(id)
    }
}

#[component]
fn Row(num: usize, row: RowData, state: &Hook<State>) -> impl View {
    let is_in_danger = class!("danger" if state.selected == Some(row.id));

    bind! { state:
        let remove = move |_| state.remove(num);
        let select = move |_| state.select(row.id);
    }

    view! {
        <tr.{is_in_danger}>
            <td class="col-md-1">{row.id.to_string()}</td>
            <td class="col-md-4"><a onclick={select}>{row.label}</a></td>
            <td class="col-md-1"><a onclick={remove}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
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
            ButtonAction::Swap => state.swap(),
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
                { for state.rows.iter().enumerate().map(|(i,l)| view! { <Row {state}  num={i} row={l.to_owned()} />}) }
                </tbody>
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
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