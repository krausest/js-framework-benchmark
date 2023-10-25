use std::sync::atomic::{AtomicUsize, Ordering};

use futures_util::StreamExt;
use korvin::core::{
    element_builder::{AsElementBuilder, ElementBuilder},
    flavors::elm_like::Communicator,
    Runtime,
};
use rand::{seq::SliceRandom, thread_rng};
use web_sys::MouseEvent;

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

fn button<F: FnOnce(ElementBuilder) -> ElementBuilder>(
    id: &str,
    text: &str,
    button: F,
) -> ElementBuilder {
    "div".attribute("class", "col-sm-6 smallpad").child(button(
        "button"
            .attribute("id", id)
            .attribute("class", "btn btn-primary btn-block")
            .attribute("type", "button")
            .text(text),
    ))
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
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

        data.push(RowData {
            id: ID_COUNTER.fetch_add(1, Ordering::Relaxed),
            label,
        });
    }

    data
}

#[derive(Default)]
struct App {
    data: Vec<RowData>,
    selected: Option<usize>,
}

impl App {
    fn handle(&mut self, message: AppMessage) {
        match message {
            AppMessage::Create1000Rows => self.data = build_data(1000),
            AppMessage::Create10000Rows => self.data = build_data(10000),
            AppMessage::Append1000Rows => self.data.append(&mut build_data(1000)),
            AppMessage::UpdateEvery10thRow => self
                .data
                .iter_mut()
                .step_by(10)
                .for_each(|row| row.label.push_str(" !!!")),
            AppMessage::Clear => {
                self.selected = None;
                self.data.clear();
            }
            AppMessage::SwapRows => {
                if self.data.len() > 998 {
                    self.data.swap(1, 998)
                }
            }
            AppMessage::SetSelected(id) => self.selected = Some(id),
            AppMessage::Remove(id) => self.data.retain(|row| row.id != id),
        }
    }
}

#[derive(Clone, Copy, Hash)]
enum AppMessage {
    Create1000Rows,
    Create10000Rows,
    Append1000Rows,
    UpdateEvery10thRow,
    Clear,
    SwapRows,
    SetSelected(usize),
    Remove(usize),
}

fn app(communicator: Communicator<AppMessage>, App { data, selected }: &App) -> ElementBuilder {
    let div = |class: &str| "div".attribute("class", class);
    let click_send = move |message| move |_: MouseEvent| communicator.send(message);
    let element_click_send =
        |element: ElementBuilder, message| element.event(message, "click", click_send(message));

    let message_button =
        |id, text, message| button(id, text, |button| element_click_send(button, message));
    let jumbotron = div("jumbotron")
        .child(div("col-md-6").child("h1".text("Korvin")))
        .child(div("col-md-6"))
        .child(
            div("row")
                .child(message_button(
                    "run",
                    "Create 1,000 rows",
                    AppMessage::Create1000Rows,
                ))
                .child(message_button(
                    "runlots",
                    "Create 10,000 rows",
                    AppMessage::Create10000Rows,
                ))
                .child(message_button(
                    "add",
                    "Append 1,000 rows",
                    AppMessage::Append1000Rows,
                ))
                .child(message_button(
                    "update",
                    "Update every 10th row",
                    AppMessage::UpdateEvery10thRow,
                ))
                .child(message_button("clear", "Clear", AppMessage::Clear))
                .child(message_button(
                    "swaprows",
                    "Swap Rows",
                    AppMessage::SwapRows,
                )),
        );
    let table = "table"
        .attribute("class", "table table-hover table-striped test-data")
        .child("tbody".children(data.iter().map(|RowData { id, label }| {
            let mut tr = "tr".into_builder();
            if selected
                .as_ref()
                .map(|selected| selected.eq(id))
                .unwrap_or_default()
            {
                tr = tr.attribute("class", "danger");
            }
            let td = |class: &str| "td".attribute("class", class);
            let row = {
                td("col-md-4").child(element_click_send(
                    "a".text(label.as_str()),
                    AppMessage::SetSelected(*id),
                ))
            };
            tr.child(td("col-md-1").text(id.to_string().as_str()))
                .child(row)
                .child(
                    td("col-md-1").child(element_click_send(
                        "a".child(
                            "span"
                                .attribute("class", "glyphicon glyphicon-remove")
                                .attribute("aria-hidden", "true"),
                        ),
                        AppMessage::Remove(*id),
                    )),
                )
                .child(td("col-md-6"))
        })));
    div("container").child(jumbotron).child(table).child(
        "span"
            .attribute("class", "preloadicon glyphicon glyphicon-remove")
            .attribute("aria-hidden", "true"),
    )
}

fn main() {
    console_error_panic_hook::set_once();
    let main = web_sys::window()
        .and_then(|w| w.document())
        .map(|d| d.query_selector("#main").unwrap().unwrap())
        .unwrap();

    wasm_bindgen_futures::spawn_local(async move {
        let mut runtime = Runtime::new(main);
        let (mut rx, communicator) = Communicator::create();
        let mut state = App::default();

        runtime
            .dom_executor
            .rebuild(app(communicator, &state).build())
            .unwrap();
        while let Some(message) = rx.next().await {
            state.handle(message);
            runtime
                .dom_executor
                .rebuild(app(communicator, &state).build())
                .unwrap()
        }
    });
}
