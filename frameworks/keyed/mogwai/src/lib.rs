use std::sync::atomic::{AtomicUsize, Ordering};

use mogwai_dom::prelude::*;
use mogwai_dom::{
    core::model::{ListPatchModel, Model},
    utils::document,
};
use rand::prelude::*;
use wasm_bindgen::prelude::*;
use web_sys::Document;

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

type Id = usize;
type Count = usize;
type Step = usize;

fn build_data(count: usize) -> Vec<Row> {
    let mut thread_rng = thread_rng();

    let mut data = Vec::new();
    data.reserve_exact(count);

    for _ in 0..count {
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

        data.push(Row {
            id: ID_COUNTER.load(Ordering::Relaxed),
            label: Model::new(label),
        });

        ID_COUNTER.store(ID_COUNTER.load(Ordering::Relaxed) + 1, Ordering::Relaxed);
    }

    data
}

// ------ ------
//     Model
// ------ ------

struct Mdl {
    selected: Model<Option<Id>>,
    rows: ListPatchModel<Row>,
}

impl Default for Mdl {
    fn default() -> Self {
        let selected: Model<Option<Id>> = Model::new(None);
        let rows: ListPatchModel<Row> = ListPatchModel::default();
        Self { rows, selected }
    }
}

impl Mdl {
    // ------ ------
    //    Update
    // ------ ------
    async fn update(&self, msg: Msg) {
        match msg {
            Msg::Create(cnt) => {
                self.selected.visit_mut(|s| *s = None).await;
                let new_rows = build_data(cnt);
                self.rows.splice(.., new_rows).await.expect("could not creat rows");
            }
            Msg::Append(cnt) => {
                let new_rows = build_data(cnt);
                let num_rows = self.rows.visit(Vec::len).await;
                self.rows.splice(num_rows.., new_rows).await.expect("could not creat rows");
            }
            Msg::Update(step_size) => {
                let rows = self.rows.read().await;
                for row in rows.iter().step_by(step_size) {
                    row.label.visit_mut(|l| l.push_str(" !!!")).await;
                }
            }
            Msg::Clear => {
                self.selected.visit_mut(|s| *s = None).await;
                self.rows.drain().await.expect("could not patch");
            }
            Msg::Swap => {
                let num_rows = self.rows.visit(Vec::len).await;
                if num_rows > 998 {
                    let row998 = self
                        .rows
                        .remove(998)
                        .await
                        .expect("can't remove row 998");
                    let row1 = self
                        .rows
                        .replace(1, row998)
                        .await
                        .expect("could not replace row 1 with previous 998");
                    self.rows
                        .insert(998, row1)
                        .await
                        .expect("could not insert row 1 into index 998");
                }
            }
            Msg::Select(id) => {
                self.selected.visit_mut(|s| *s = Some(id)).await;
            }
            Msg::Remove(remove_id) => {
                let rows = self.rows.read().await;
                let index = rows
                    .iter()
                    .enumerate()
                    .find_map(|(i, row)| if row.id == remove_id { Some(i) } else { None })
                    .unwrap();
                drop(rows);
                self.rows.remove(index).await.expect("could not patch");
            }
        }
    }

    // ------ ------
    //     View
    // ------ ------
    fn viewbuilder(self) -> ViewBuilder {
        // -- Menu -- //

        let menu = Output::default();
        let create_1_000 = menu.sink().contra_map(|_: JsDomEvent| Msg::Create(1_000));
        let create_10_000 = menu.sink().contra_map(|_: JsDomEvent| Msg::Create(10_000));
        let append_1_000 = menu.sink().contra_map(|_: JsDomEvent| Msg::Append(1_000));
        let update = menu.sink().contra_map(|_: JsDomEvent| Msg::Update(10));
        let clear = menu.sink().contra_map(|_: JsDomEvent| Msg::Clear);
        let swap_rows = menu.sink().contra_map(|_: JsDomEvent| Msg::Swap);

        // -- Row actions -- //

        let remove_row = Output::<Msg>::default();
        let select_row = Output::<Msg>::default();

        // -- Select state -- //

        let selected = self.selected.clone();

        // -- Streams -- //

        let menu_stream = menu.get_stream();
        let remove_stream = remove_row.get_stream();
        let select_stream = select_row.get_stream();

        let mut message_stream = menu_stream.boxed().or(remove_stream).or(select_stream);

        rsx! (
            div(class="container") {
                div(class="jumbotron") {
                    div(class="row") {
                        div(class="col-md-6") {
                            h1(){"mogwai"}
                        }
                        div(class="col-md-6") {
                            div(class="row") {
                                button(id="run",     on:click=create_1_000) { "Create 1,000 rows" }
                                button(id="runlots", on:click=create_10_000) { "Create 10,000 rows" }
                                button(id="add",     on:click=append_1_000) { "Append 1,000 rows" }
                                button(id="update",  on:click=update) { "Update every 10th row" }
                                button(id="clear",   on:click=clear) { "Clear" }
                                button(id="swaprows",on:click=swap_rows) { "Swap Rows" }
                            }
                        }
                    }
                }
                table( class="table table-hover table-striped test-data") {
                    tbody(patch:children = self.rows
                          .stream()
                          .map(move |patch|{
                              patch.map(|row| {
                                  let is_selected = selected.stream().map(move |selected| selected == Some(row.id));
                                  let select = select_row.clone().contra_map(move |_: JsDomEvent| Msg::Select(row.id));
                                  let remove = remove_row.clone().sink().contra_map(move|_: JsDomEvent| Msg::Remove(row.id));
                                  let select_class = ("", is_selected.map(|is_selected| if is_selected{ "danger"} else { "" }.to_string()));
                                  let label = ("",row.label.stream());
                                  rsx!(
                                      tr(key=row.id.to_string(), class = select_class) {
                                          td(class="col-md-1"){{ row.id.to_string() }}
                                          td(class="col-md-4"){
                                              a(on:click=select) {{ label }}
                                          }
                                          td(class="col-md-1"){
                                              a(on:click=remove) {
                                                  span(class="glyphicon glyphicon-remove", aria_hidden="true") {}
                                              }
                                          }
                                          td(class="col-md-6"){ }
                                      }
                                  )
                              })
                          })
                    ) {}
                }
            }
        ).with_task(async move {
            while let Some(msg) = message_stream.next().await {
                self.update(msg).await;
            }
        })
    }
}

#[derive(Clone)]
struct Row {
    id: usize,
    label: Model<String>,
}

static ID_COUNTER: AtomicUsize = AtomicUsize::new(1);

// ------ ------
//    Message
// ------ ------

#[derive(Clone)]
enum Msg {
    Create(Count),
    Append(Count),
    Update(Step),
    Clear,
    Swap,
    Select(Id),
    Remove(Id),
}

// ------ ------
//     Start
// ------ ------

#[wasm_bindgen(start)]
pub fn start() {
    let mdl = Mdl::default();
    let js_dom = JsDom::try_from(mdl.viewbuilder()).unwrap();
    let container = document()
        .visit_as::<Document, JsDom>(|doc| {
            JsDom::from_jscast(&doc.get_element_by_id("main").unwrap())
        })
        .unwrap();
    js_dom.run_in_container(container).unwrap();
}
