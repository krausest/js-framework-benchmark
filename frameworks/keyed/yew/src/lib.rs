#![recursion_limit = "1024"]

use rand::prelude::*;
use std::cmp::min;
use wasm_bindgen::prelude::wasm_bindgen;
use yew::prelude::*;
use yew::web_sys::window;

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

#[derive(Clone, PartialEq)]
struct RowData {
    id: usize,
    label: String,
}

impl RowData {
    fn new(id: usize, rng: &mut SmallRng) -> Self {
        let mut label = String::new();
        label.push_str(ADJECTIVES.choose(rng).unwrap());
        label.push(' ');
        label.push_str(COLOURS.choose(rng).unwrap());
        label.push(' ');
        label.push_str(NOUNS.choose(rng).unwrap());

        Self { id, label }
    }
}

struct Model {
    rows: Vec<RowData>,
    next_id: usize,
    selected_id: Option<usize>,
    rng: SmallRng,
    link: ComponentLink<Self>,
    on_select: Callback<usize>,
    on_remove: Callback<usize>,
}

enum Msg {
    Run(usize),
    Add(usize),
    Update(usize),
    Clear,
    Swap,
    Remove(usize),
    Select(usize),
}

impl Component for Model {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
        Model {
            rows: Vec::new(),
            next_id: 1,
            selected_id: None,
            rng: SmallRng::from_entropy(),
            on_select: link.callback(|id| Msg::Select(id)),
            on_remove: link.callback(|id| Msg::Remove(id)),
            link,
        }
    }

    fn change(&mut self, _: ()) -> ShouldRender {
        false
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Run(amount) => {
                let rng = &mut self.rng;
                let next_id = self.next_id;
                let update_amount = min(amount, self.rows.len());
                for index in 0..update_amount {
                    self.rows[index] = RowData::new(next_id + index, rng);
                }
                self.rows.extend(
                    (update_amount..amount).map(|index| RowData::new(next_id + index, rng)),
                );
                self.next_id += amount;
            }
            Msg::Add(amount) => {
                let rng = &mut self.rng;
                let next_id = self.next_id;
                self.rows
                    .extend((0..amount).map(|index| RowData::new(next_id + index, rng)));
                self.next_id += amount;
            }
            Msg::Update(step) => {
                for index in (0..self.rows.len()).step_by(step) {
                    self.rows[index].label += " !!!";
                }
            }
            Msg::Clear => {
                self.rows.clear();
            }
            Msg::Swap => {
                if self.rows.len() > 998 {
                    self.rows.swap(1, 998);
                }
            }
            Msg::Remove(id) => {
                if let Some(index) = self.rows.iter().position(|row| row.id == id) {
                    self.rows.remove(index);
                }
            }
            Msg::Select(id) => {
                self.selected_id = Some(id);
            }
        }
        true
    }

    fn view(&self) -> Html {
        let rows: Html = self
            .rows
            .iter()
            .map(|row| {
                html! {
                    <Row key=row.id
                        data=row.clone()
                        selected=self.selected_id == Some(row.id)
                        on_select=self.on_select.clone()
                        on_remove=self.on_remove.clone() />
                }
            })
            .collect();

        html! {
            <div class="container">
                <Jumbotron link=self.link.clone() />
                <table class="table table-hover table-striped test-data">
                    <tbody id="tbody">
                        { rows }
                    </tbody>
                </table>
                <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
            </div>
        }
    }
}

#[derive(Properties, Clone)]
struct JumbotronProps {
    link: ComponentLink<Model>,
}

struct Jumbotron {
    link: ComponentLink<Model>,
}

impl Component for Jumbotron {
    type Properties = JumbotronProps;
    type Message = ();

    fn create(props: Self::Properties, _: ComponentLink<Self>) -> Self {
        Self { link: props.link }
    }

    fn change(&mut self, _: Self::Properties) -> ShouldRender {
        false
    }

    fn update(&mut self, _: Self::Message) -> ShouldRender {
        false
    }

    fn view(&self) -> Html {
        html! {
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>{ "Yew" }</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-sm-6 smallpad">
                                <button type="button" id="run" class="btn btn-primary btn-block" onclick=self.link.callback(|_| Msg::Run(1_000))>{ "Create 1,000 rows" }</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" onclick=self.link.callback(|_| Msg::Run(10_000)) id="runlots">{ "Create 10,000 rows" }</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" onclick=self.link.callback(|_| Msg::Add(1_000)) id="add">{ "Append 1,000 rows" }</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" onclick=self.link.callback(|_| Msg::Update(10)) id="update">{ "Update every 10th row" }</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" onclick=self.link.callback(|_| Msg::Clear) id="clear">{ "Clear" }</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" onclick=self.link.callback(|_| Msg::Swap) id="swaprows">{ "Swap Rows" }</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    }
}

#[derive(Properties, Clone, PartialEq)]
struct RowProps {
    on_select: Callback<usize>,
    on_remove: Callback<usize>,
    selected: bool,
    data: RowData,
}

struct RowState {
    on_select: Callback<MouseEvent>,
    on_remove: Callback<MouseEvent>,
}

struct Row {
    state: RowState,
    props: RowProps,
}

impl RowState {
    fn from_props(props: &RowProps) -> Self {
        let id = props.data.id;
        Self {
            on_select: props.on_select.reform(move |_| id),
            on_remove: props.on_remove.reform(move |_| id),
        }
    }
}

impl Component for Row {
    type Message = ();
    type Properties = RowProps;

    fn create(props: Self::Properties, _: ComponentLink<Self>) -> Self {
        Self {
            state: RowState::from_props(&props),
            props,
        }
    }

    fn change(&mut self, props: RowProps) -> ShouldRender {
        if self.props != props {
            self.state = RowState::from_props(&props);
            self.props = props;
            true
        } else {
            false
        }
    }

    fn update(&mut self, _: ()) -> ShouldRender {
        false
    }

    fn view(&self) -> Html {
        html! {
            <tr class=if self.props.selected { "danger" } else  { "" }>
                <td class="col-md-1">{ self.props.data.id }</td>
                <td class="col-md-4" onclick=self.state.on_select.clone()>
                    <a class="lbl">{ self.props.data.label.clone() }</a>
                </td>
                <td class="col-md-1">
                    <a class="remove" onclick=self.state.on_remove.clone()>
                        <span class="glyphicon glyphicon-remove remove" aria-hidden="true"></span>
                    </a>
                </td>
                <td class="col-md-6"></td>
            </tr>
        }
    }
}

#[wasm_bindgen(start)]
pub fn start() {
    let document = window().unwrap().document().unwrap();
    let mount_el = document.query_selector("#main").unwrap().unwrap();
    App::<Model>::new().mount(mount_el);
}
