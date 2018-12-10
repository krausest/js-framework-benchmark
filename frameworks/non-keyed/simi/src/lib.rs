#![feature(proc_macro_hygiene)]
use rand::rngs::ThreadRng;
use rand::seq::SliceRandom;
use simi::prelude::*;
use wasm_bindgen::prelude::*;
use simi::interop::element_events::MouseEvent;

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

struct Row {
    id: usize,
    label: String,
}

impl Row {
    fn new(id: usize, rng: &mut ThreadRng) -> Self {
        let mut label = String::new();
        label.push_str(ADJECTIVES.choose(rng).unwrap());
        label.push(' ');
        label.push_str(COLOURS.choose(rng).unwrap());
        label.push(' ');
        label.push_str(NOUNS.choose(rng).unwrap());
        Self { id, label }
    }
}

#[simi_app(main)]
pub struct AppState {
    rows: Vec<Row>,
    next_id: usize,
    selected_id: Option<usize>,
    rng: ThreadRng,
}

pub enum Msg {
    Create(usize),
    Append(usize),
    UpdateEvery(usize),
    Clear,
    Swap,
    TableClick(MouseEvent),
}

impl Application for AppState {
    type Message = Msg;
    type Context = ();
    type Parent = ();

    fn init()-> Self {
        Self {
            rows: Vec::new(),
            next_id: 1,
            selected_id: None,
            rng: rand::thread_rng(),
        }
    }

    fn update(&mut self, msg: Self::Message, _cp: ContextPlus<Self>) -> UpdateView {
        match msg {
            Msg::Create(count) => self.create(count),
            Msg::Append(count) => self.append(count),
            Msg::UpdateEvery(step) => self.update_every_10(step),
            Msg::Clear => self.rows.clear(),
            Msg::Swap => if self.rows.len() > 998 {
                self.rows.swap(1, 998);
            }
            Msg::TableClick(event) => return self.table_click(event)
        }
        true
    }

    fn render(&self, context: RenderContext<Self>) {
        application! {
            div (class="container") {
                #div (class="jumbotron") {
                    div (class="row") {
                        div (class="col-md-6") {
                            h1 { "Simi v0.2.0 non-keyed" }
                        }
                        div (class="col-md-6") {
                            div (class="row") {
                                div (class="col-sm-6 smallpad") {
                                    button (id="run" type="button" class="btn btn-primary btn-block" onclick=Msg::Create(1_000)) { "Create 1,000 rows" }
                                }
                                div (class="col-sm-6 smallpad") {
                                    button (id="runlots" type="button" class="btn btn-primary btn-block" onclick=Msg::Create(10_000)) { "Create 10,000 rows" }
                                }
                                div (class="col-sm-6 smallpad") {
                                    button (id="add" type="button" class="btn btn-primary btn-block" onclick=Msg::Append(1_000)) { "Append 1,000 rows" }
                                }
                                div (class="col-sm-6 smallpad") {
                                    button (id="update" type="button" class="btn btn-primary btn-block" onclick=Msg::UpdateEvery(10)) { "Update every 10th row" }
                                }
                                div (class="col-sm-6 smallpad") {
                                    button (id="clear" type="button" class="btn btn-primary btn-block" onclick=Msg::Clear) { "Clear" }
                                }
                                div (class="col-sm-6 smallpad") {
                                    button (id="swaprows" type="button" class="btn btn-primary btn-block" onclick=Msg::Swap) { "Swap Rows" }
                                }
                            }
                        }
                    }
                }
                table (class="table table-hover table-striped test-data" onclick=Msg::TableClick(?)) {
                    tbody (id="tbody") {
                        for data_row in self.rows.iter() {
                            @for_setup={
                                let id = data_row.id;
                            }
                            tr ("danger"=self.is_danger(id)) {
                                td (class="col-md-1") {  id }
                                td (class="col-md-4") {
                                    a (class="lbl" ) { data_row.label }
                                }
                                td (class="col-md-1") {
                                    a (class="remove") {
                                        span (class="glyphicon glyphicon-remove remove" aria-hidden="true")
                                    }
                                }
                                td (class="col-md-6")
                            }
                        }
                    }
                }
                span (class="preloadicon glyphicon glyphicon-remove" aria-hidden="true")
            }
        }
    }
}

impl AppState {
    fn is_danger(&self, id: usize) -> bool {
        if let Some(sid) = self.selected_id {
            sid == id
        } else {
            false
        }
    }

    fn create(&mut self, count: usize) {
        let next_id = self.next_id;
        // Borrow here to avoid borrowing of self in closure
        let rng = &mut self.rng;
        self.rows.clear();
        self.rows
            .extend((0..count).map(|index| Row::new(next_id + index, rng)));
        self.next_id += count;
    }

    fn append(&mut self, count: usize) {
        let next_id = self.next_id;
        let rng = &mut self.rng;
        self.rows
            .extend((0..count).map(|index| Row::new(next_id + index, rng)));
        self.next_id += count;
    }

    fn update_every_10(&mut self, step: usize) {
        self.rows.iter_mut().step_by(step).for_each(|row| row.label += " !!!");
    }

    fn remove(&mut self, id: usize) {
        if let Some((index, _)) = self.rows.iter().enumerate().find(|(_, row)| row.id == id) {
            self.rows.remove(index);
        }
    }

    fn select(&mut self, id: usize) {
        if self.selected_id == Some(id) {
            self.selected_id = None;
        } else {
            self.selected_id = Some(id);
        }
    }

    fn table_click(&mut self, event: MouseEvent) -> UpdateView {
        use wasm_bindgen::JsCast;
        let target = event.target().unwrap();
        let target: simi::interop::Element = target.dyn_into().unwrap();
        if target.matches(".remove").unwrap() || target.matches(".lbl").unwrap() {
            let td: simi::interop::Node = target
                .closest("tr")
                .unwrap()
                .unwrap()
                .query_selector("td")
                .unwrap()
                .unwrap()
                .into();
            let id = td.text_content().unwrap().parse().unwrap();
            if target.matches(".remove").unwrap() {
                self.remove(id);
            } else {
                self.select(id);
            }
        } else {
            return false;
        }
        true
    }
}
