use js_sys::Date;
use rand::{rngs::SmallRng, SeedableRng};
use serde_json::from_str;
use wasm_bindgen::{prelude::*, JsCast, UnwrapThrowExt};
use web_sys::{Element, Event};
use yarte_wasm_app::*;

use crate::{
    handler::*,
    hydrate_row, new_row,
    row::{row_element, Row, RowDOM},
    update_row,
};

#[wasm_bindgen]
extern "C" {
    fn get_state() -> String;
}

pub struct NonKeyed {
    pub id: usize,
    pub data: Vec<Row>,
    pub selected: Option<usize>,
    pub rng: SmallRng,
    // Black box
    pub t_root: u8,
    pub old_selected: Option<usize>,
    pub tbody: Element,
    pub tbody_children: Vec<RowDOM>,
    //
    tr: Element,
}

#[inline]
fn each_render(app: &mut NonKeyed, mb: &'static Addr<NonKeyed>) {
    if app.t_root & 0b0000_0001 == 0 {
        return;
    }
    let dom_len = app.tbody_children.len();
    let row_len = app.data.len();
    if row_len == 0 {
        // Clear
        app.tbody.set_text_content(None);
        app.tbody_children.clear()
    } else {
        // Update
        for (dom, row) in app
            .tbody_children
            .iter_mut()
            .zip(app.data.iter())
            .filter(|(dom, _)| dom.t_root != 0)
        {
            update_row!(dom, row, mb);
        }

        if dom_len < row_len {
            // Add
            for row in app.data.iter().skip(dom_len) {
                app.tbody_children
                    .push(new_row!(row, app.tr, mb, app.tbody));
            }
        } else {
            // Remove
            for dom in app.tbody_children.drain(row_len..) {
                dom.root.remove()
            }
        }
    }
}

#[inline]
fn select_render(app: &mut NonKeyed) {
    if app.t_root & 0b0000_0011 == 0 {
        return;
    }
    if let Some(old) = app
        .old_selected
        .take()
        .and_then(|x| app.tbody_children.get(x))
    {
        old.root.set_class_name("");
    }

    if let Some(new) = app.selected {
        if let Some((dom, i)) = app
            .data
            .iter()
            .position(|x| x.id == new)
            .and_then(|x| app.tbody_children.get(x).map(|dom| (dom, x)))
        {
            dom.root.set_class_name("danger");
            app.old_selected = Some(i);
        } else {
            app.selected = None;
        }
    }
}

impl App for NonKeyed {
    type BlackBox = ();
    type Message = Msg;

    fn __render(&mut self, mb: &'static Addr<Self>) {
        if self.t_root == 0 {
            return;
        }

        each_render(self, mb);
        select_render(self);

        self.t_root = 0;
    }

    fn __hydrate(&mut self, mb: &'static Addr<Self>) {
        let document = web_sys::window().unwrap_throw().document().unwrap_throw();
        let f = document
            .body()
            .unwrap_throw()
            .first_child()
            .unwrap_throw()
            .first_child()
            .unwrap_throw(); // div.jumbotron

        let f_0 = f.first_child().unwrap_throw(); // div.row
        let f_0_0 = f_0.first_child().unwrap_throw(); // div.col-md-6
        let f_0_1 = f_0_0.next_sibling().unwrap_throw(); // div.col-md-6
        let f_0_1_0 = f_0_1.first_child().unwrap_throw(); // div.row

        let f_0_1_0_0 = f_0_1_0.first_child().unwrap_throw(); // div.col-sm-6 smallpad
        let button_create = f_0_1_0_0.first_child().unwrap_throw(); // button CREATE 1_000
        let cloned = mb.clone();
        let cl = Closure::wrap(Box::new(move |event: Event| {
            event.prevent_default();
            cloned.send(Msg::Create);
        }) as Box<dyn Fn(Event)>);
        button_create
            .add_event_listener_with_callback("click", cl.as_ref().unchecked_ref())
            .unwrap_throw();
        cl.forget();

        let f_0_1_0_1 = f_0_1_0_0.next_sibling().unwrap_throw(); // div.col-sm-6 smallpad
        let button_create_10 = f_0_1_0_1.first_child().unwrap_throw(); // button CREATE 10_000
        let cloned = mb.clone();
        let cl = Closure::wrap(Box::new(move |event: Event| {
            event.prevent_default();
            cloned.send(Msg::Create10);
        }) as Box<dyn Fn(Event)>);
        button_create_10
            .add_event_listener_with_callback("click", cl.as_ref().unchecked_ref())
            .unwrap_throw();
        cl.forget();

        let f_0_1_0_2 = f_0_1_0_1.next_sibling().unwrap_throw(); // div.col-sm-6 smallpad
        let button_append = f_0_1_0_2.first_child().unwrap_throw(); // button  APPEND 1_000
        let cloned = mb.clone();
        let cl = Closure::wrap(Box::new(move |event: Event| {
            event.prevent_default();
            cloned.send(Msg::Append)
        }) as Box<dyn Fn(Event)>);
        button_append
            .add_event_listener_with_callback("click", cl.as_ref().unchecked_ref())
            .unwrap_throw();
        cl.forget();

        let f_0_1_0_3 = f_0_1_0_2.next_sibling().unwrap_throw(); // div.col-sm-6 smallpad
        let button_update = f_0_1_0_3.first_child().unwrap_throw(); // button  UPDATE
        let cloned = mb.clone();
        let cl = Closure::wrap(Box::new(move |event: Event| {
            event.prevent_default();
            cloned.send(Msg::Update);
        }) as Box<dyn Fn(Event)>);
        button_update
            .add_event_listener_with_callback("click", cl.as_ref().unchecked_ref())
            .unwrap_throw();
        cl.forget();

        let f_0_1_0_4 = f_0_1_0_3.next_sibling().unwrap_throw(); // div.col-sm-6 smallpad
        let button_clear = f_0_1_0_4.first_child().unwrap_throw(); // button CLEAR
        let cloned = mb.clone();
        let cl = Closure::wrap(Box::new(move |event: Event| {
            event.prevent_default();
            cloned.send(Msg::Clear);
        }) as Box<dyn Fn(Event)>);
        button_clear
            .add_event_listener_with_callback("click", cl.as_ref().unchecked_ref())
            .unwrap_throw();
        cl.forget();

        let f_0_1_0_5 = f_0_1_0_4.next_sibling().unwrap_throw(); // div.col-sm-6 smallpad
        let button_swap = f_0_1_0_5.first_child().unwrap_throw(); // button SWAP
        let cloned = mb.clone();
        let cl = Closure::wrap(Box::new(move |event: Event| {
            event.prevent_default();
            cloned.send(Msg::Swap)
        }) as Box<dyn Fn(Event)>);
        button_swap
            .add_event_listener_with_callback("click", cl.as_ref().unchecked_ref())
            .unwrap_throw();
        cl.forget();

        assert_eq!(self.tbody_children.len(), self.data.len());

        // hydrate Each
        for (dom, row) in self.tbody_children.iter_mut().zip(self.data.iter()) {
            hydrate_row!(dom, row, mb);
        }
    }

    fn __dispatch(&mut self, msg: <Self as App>::Message, addr: &'static Addr<Self>) {
        match msg {
            Msg::Append => append(self, addr),
            Msg::Clear => clear(self, addr),
            Msg::Create => create(self, addr),
            Msg::Create10 => create_10(self, addr),
            Msg::Delete(i) => delete(self, i, addr),
            Msg::Select(i) => select(self, i, addr),
            Msg::Swap => swap(self, addr),
            Msg::Update => update(self, addr),
        }
    }
}

#[derive(Debug, Default, Deserialize)]
struct InitialState {
    #[serde(default)]
    data: Vec<Row>,
    #[serde(default)]
    id: usize,
    #[serde(default)]
    selected: Option<usize>,
}

// Construct pre hydrate App
impl Default for NonKeyed {
    fn default() -> Self {
        let state = get_state();
        let InitialState { data, id, selected }: InitialState =
            from_str(&state).unwrap_or_default();
        let doc = web_sys::window().unwrap_throw().document().unwrap_throw();
        let body = doc.body().unwrap_throw();
        let node = body.first_element_child().unwrap_throw();
        let f = node.first_element_child().unwrap_throw(); // div.jumbotron
        let n1 = f.next_element_sibling().unwrap_throw(); // table.table table-hover table-striped test-data
        let tbody = n1.first_element_child().unwrap_throw(); // tbody

        let mut tbody_children = vec![];
        if let Some(mut curr) = tbody.first_element_child() {
            loop {
                let id_node = curr.first_element_child().unwrap_throw();
                let label_parent = id_node.next_element_sibling().unwrap_throw();
                let label_node = label_parent.first_element_child().unwrap_throw();
                let delete_parent = label_parent.next_element_sibling().unwrap_throw();
                let delete_node = delete_parent.first_element_child().unwrap_throw();

                curr = if let Some(new) = curr.next_element_sibling() {
                    tbody_children.push(RowDOM {
                        t_root: 0,
                        root: curr,
                        id_node,
                        label_node,
                        delete_node,
                        closure_select: None,
                        closure_delete: None,
                    });

                    new
                } else {
                    tbody_children.push(RowDOM {
                        t_root: 0,
                        root: curr,
                        id_node,
                        label_node,
                        delete_node,
                        closure_select: None,
                        closure_delete: None,
                    });

                    break;
                }
            }
        }

        Self {
            // state template variables
            id,
            data,
            selected,
            // state variable
            rng: SmallRng::seed_from_u64(Date::now() as u64),
            // Black box
            t_root: 0,
            old_selected: None,
            tbody,
            tbody_children,
            tr: row_element(),
        }
    }
}
