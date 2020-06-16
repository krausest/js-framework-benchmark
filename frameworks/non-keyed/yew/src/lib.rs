#![recursion_limit = "1024"]

extern crate byteorder;
extern crate js_sys;
extern crate rand;
extern crate wasm_bindgen;
extern crate yew;

use byteorder::{ByteOrder, LittleEndian};
use js_sys::Date;
use rand::prng::XorShiftRng;
use rand::{Rng, SeedableRng};
use std::cmp::min;
use wasm_bindgen::prelude::*;
use yew::prelude::*;

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
    fn new<R>(id: usize, rng: &mut R) -> Row
    where
        R: Rng,
    {
        let mut label = String::new();
        label.push_str(rng.choose(ADJECTIVES).unwrap());
        label.push(' ');
        label.push_str(rng.choose(COLOURS).unwrap());
        label.push(' ');
        label.push_str(rng.choose(NOUNS).unwrap());

        Row { id, label }
    }
}

pub struct Model {
    link: ComponentLink<Self>,
    rows: Vec<Row>,
    next_id: usize,
    selected_id: Option<usize>,
    rng: XorShiftRng,
}

pub enum Msg {
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
        let mut seed = [0; 16];
        LittleEndian::write_u128(&mut seed, Date::now() as u128);
        Model {
            link,
            rows: Vec::new(),
            next_id: 1,
            selected_id: None,
            rng: XorShiftRng::from_seed([0; 16]),
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Run(amount) => {
                let next_id = self.next_id;
                let rng = &mut self.rng;
                let update_amount = min(amount, self.rows.len());
                for index in 0..update_amount {
                    self.rows[index] = Row::new(next_id + index, rng);
                }
                self.next_id += update_amount;
                self.rows.extend(
                    (update_amount..amount)
                        .map(|index| Row::new(next_id + index, rng))
                        .collect::<Vec<_>>(),
                );
                self.next_id += amount - update_amount;
            }
            Msg::Add(amount) => {
                let next_id = self.next_id;
                let rng = &mut self.rng;
                self.rows.extend(
                    (0..amount)
                        .map(|index| Row::new(next_id + index, rng))
                        .collect::<Vec<_>>(),
                );
                self.next_id += amount;
            }
            Msg::Update(step) => {
                for index in (0..(self.rows.len() / step)).map(|x| x * step) {
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
                if let Some((index, _)) = self.rows.iter().enumerate().find(|(_, row)| row.id == id)
                {
                    self.rows.remove(index);
                }
            }
            Msg::Select(id) => {
                if self.selected_id == Some(id) {
                    self.selected_id = None;
                } else {
                    self.selected_id = Some(id);
                }
            }
        }
        true
    }

    fn change(&mut self, _: Self::Properties) -> ShouldRender {
        false
    }

    fn view(&self) -> Html {
        html! {
            <div class="container",>
                <div class="jumbotron",>
                    <div class="row",>
                        <div class="col-md-6",>
                            <h1>{ "Yew" }</h1>
                        </div>
                        <div class="col-md-6",>
                            <div class="row",>
                                <div class="col-sm-6 smallpad",>
                                    <button type="button", class="btn btn-primary btn-block", onclick=self.link.callback(|_| Msg::Run(1_000)), id="run",>{ "Create 1,000 rows" }</button>
                                </div>
                                <div class="col-sm-6 smallpad",>
                                    <button type="button", class="btn btn-primary btn-block", onclick=self.link.callback(|_| Msg::Run(10_000)), id="runlots",>{ "Create 10,000 rows" }</button>
                                </div>
                                <div class="col-sm-6 smallpad",>
                                    <button type="button", class="btn btn-primary btn-block", onclick=self.link.callback(|_| Msg::Add(1_000)), id="add",>{ "Append 1,000 rows" }</button>
                                </div>
                                <div class="col-sm-6 smallpad",>
                                    <button type="button", class="btn btn-primary btn-block", onclick=self.link.callback(|_| Msg::Update(10)), id="update",>{ "Update every 10th row" }</button>
                                </div>
                                <div class="col-sm-6 smallpad",>
                                    <button type="button", class="btn btn-primary btn-block", onclick=self.link.callback(|_| Msg::Clear), id="clear",>{ "Clear" }</button>
                                </div>
                                <div class="col-sm-6 smallpad",>
                                    <button type="button", class="btn btn-primary btn-block", onclick=self.link.callback(|_| Msg::Swap), id="swaprows",>{ "Swap Rows" }</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table class="table table-hover table-striped test-data",>
                    <tbody id="tbody",>
                        { for self.rows.iter().map(|row| {
                            let id = row.id.clone();
                            html! {
                                <tr class=if self.selected_id == Some(id) { "danger" } else  { "" },>
                                    <td class="col-md-1",>{ id.to_string() }</td>
                                    <td class="col-md-4", onclick=self.link.callback(move |_| Msg::Select(id)),>
                                        <a class="lbl",>{ row.label.clone() }</a>
                                    </td>
                                    <td class="col-md-1",>
                                        <a class="remove", onclick=self.link.callback(move |_| Msg::Remove(id)),>
                                            <span class="glyphicon glyphicon-remove remove", aria-hidden="true",></span>
                                        </a>
                                    </td>
                                    <td class="col-md-6",></td>
                                </tr>
                            }
                        } ) }
                    </tbody>
                </table>
                <span class="preloadicon glyphicon glyphicon-remove", aria-hidden="true",></span>
            </div>
        }
    }
}

#[wasm_bindgen(start)]
pub fn main() {
    yew::initialize();
    App::<Model>::new().mount_to_body();
}

