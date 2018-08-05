extern crate byteorder;
extern crate rand;
#[macro_use]
extern crate stdweb;

use byteorder::{ByteOrder, LittleEndian};
use rand::prng::XorShiftRng;
use rand::{Rng, SeedableRng};
use std::cell::{RefCell, RefMut};
use std::cmp::min;
use std::rc::Rc;
use std::str::FromStr;
use stdweb::traits::IEvent;
use stdweb::web::event::ClickEvent;
use stdweb::web::{
    document, CloneKind, Date, Element, IChildNode, IElement, IEventTarget, INode,
    INonElementParentNode, Node,
};
use stdweb::Reference;

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

struct Stopwatch {
    name: String,
    start: f64,
}

impl Stopwatch {
    fn start(name: &str) -> Stopwatch {
        console!(log, format!("start {}", name));
        Stopwatch {
            name: name.to_owned(),
            start: Date::now(),
        }
    }
}

impl Drop for Stopwatch {
    fn drop(&mut self) {
        let stop = Date::now();
        console!(
            log,
            format!("stop {}: {}ms", self.name, (stop - self.start) as i64)
        );
    }
}

struct Row {
    id: usize,
    label: String,
    id_node: Node,
    label_node: Node,
    root_element: Element,
}

impl Row {
    fn generate_label<R>(rng: &mut R) -> String
    where
        R: Rng,
    {
        let mut label = String::new();
        label.push_str(rng.choose(ADJECTIVES).unwrap());
        label.push(' ');
        label.push_str(rng.choose(COLOURS).unwrap());
        label.push(' ');
        label.push_str(rng.choose(NOUNS).unwrap());
        label
    }

    fn td(class_name: &str) -> Element {
        let td = document().create_element("td").unwrap();
        td.set_attribute("class", class_name).unwrap();
        td
    }

    fn get_id(mut element: Element) -> Option<usize> {
        loop {
            if element.node_name() == "TR" {
                if let Some(id) = element.get_attribute("data-id") {
                    return usize::from_str(id.as_ref()).ok();
                }
            }

            if let Some(parent_element) = element.parent_element() {
                element = parent_element;
            } else {
                return None;
            }
        }
    }

    fn row_element() -> Element {
        let tr = document().create_element("tr").unwrap();
        let td1 = Self::td("col-md-1");
        tr.append_child(&td1);

        let td2 = Self::td("col-md-4");
        tr.append_child(&td2);
        let a2 = document().create_element("a").unwrap();
        a2.set_attribute("class", "lbl").unwrap();
        td2.append_child(&a2);

        let td3 = Self::td("col-md-1");
        tr.append_child(&td3);
        let a3 = document().create_element("a").unwrap();
        a3.set_attribute("class", "remove").unwrap();
        td3.append_child(&a3);
        let span = document().create_element("span").unwrap();
        span.set_attribute("class", "glyphicon glyphicon-remove remove")
            .unwrap();
        span.set_attribute("aria-hidden", "true").unwrap();
        a3.append_child(&span);

        let td4 = Self::td("col-md-6");
        tr.append_child(&td4);

        tr
    }

    fn new(id: usize, label: String, row_element: &Element) -> Row {
        let root_element = row_element.clone_node(CloneKind::Deep).unwrap();
        let id_node = root_element.child_nodes().item(0).unwrap();
        let label_node = root_element
            .child_nodes()
            .item(1)
            .unwrap()
            .child_nodes()
            .item(0)
            .unwrap();
        let mut row = Row {
            id,
            label,
            id_node,
            label_node,
            root_element,
        };
        row.refresh_element();
        row
    }

    fn refresh_element(&mut self) {
        let id_string = self.id.to_string();
        self.root_element
            .set_attribute("data-id", &id_string)
            .unwrap();
        self.id_node.set_text_content(&id_string);
        self.refresh_label();
    }

    fn refresh_label(&mut self) {
        self.label_node.set_text_content(self.label.as_ref());
    }
}

struct Main {
    next_id: usize,
    rows: Vec<Row>,
    selected_row_index: Option<usize>,
    rng: XorShiftRng,
    tr: Element,
    tbody: Element,
}

impl Main {
    fn add_click_event_listener<F>(this: &Rc<RefCell<Main>>, element: Element, handler: F)
    where
        F: Fn(RefMut<Main>, ClickEvent) + 'static,
    {
        let t = this.clone();
        element.add_event_listener(move |e: ClickEvent| {
            handler(t.borrow_mut(), e);
        });
    }

    fn new() {
        let mut seed = [0; 16];
        LittleEndian::write_u128(&mut seed, Date::now() as u128);
        let this = Rc::new(RefCell::new(Main {
            next_id: 1,
            rows: Vec::new(),
            selected_row_index: None,
            rng: XorShiftRng::from_seed(seed),
            tr: Row::row_element(),
            tbody: document().get_element_by_id("tbody").unwrap(),
        }));

        Main::add_click_event_listener(
            &this,
            document().get_element_by_id("add").unwrap(),
            |mut this, e| {
                e.prevent_default();
                this.add();
            },
        );

        Main::add_click_event_listener(
            &this,
            document().get_element_by_id("run").unwrap(),
            |mut this, e| {
                e.prevent_default();
                this.run();
            },
        );

        Main::add_click_event_listener(
            &this,
            document().get_element_by_id("update").unwrap(),
            |mut this, e| {
                e.prevent_default();
                this.update();
            },
        );

        Main::add_click_event_listener(
            &this,
            document().get_element_by_id("runlots").unwrap(),
            |mut this, e| {
                e.prevent_default();
                this.runlots();
            },
        );

        Main::add_click_event_listener(
            &this,
            document().get_element_by_id("clear").unwrap(),
            |mut this, e| {
                e.prevent_default();
                this.clear();
            },
        );

        Main::add_click_event_listener(
            &this,
            document().get_element_by_id("swaprows").unwrap(),
            |mut this, e| {
                e.prevent_default();
                this.swaprows();
            },
        );

        Main::add_click_event_listener(
            &this,
            document().get_element_by_id("tbody").unwrap(),
            |mut this, e| {
                let target = match e.target() {
                    Some(x) => x,
                    _ => {
                        console!(log, "click event without target");
                        return;
                    }
                };

                let target_element = match Reference::from(target).downcast::<Element>() {
                    Some(x) => x,
                    _ => {
                        return;
                    }
                };

                let class_list = target_element.class_list();
                if class_list.contains("remove") {
                    if let Some(id) = Row::get_id(target_element) {
                        if let Some(index) = this.find_index(id) {
                            e.prevent_default();
                            this.delete(index);
                        }
                    }
                } else if class_list.contains("lbl") {
                    if let Some(id) = Row::get_id(target_element) {
                        if let Some(index) = this.find_index(id) {
                            e.prevent_default();
                            this.select(index);
                        }
                    }
                }
            },
        );
    }

    fn find_index(&self, id: usize) -> Option<usize> {
        self.rows
            .iter()
            .enumerate()
            .find(|(_, row)| row.id == id)
            .map(|(index, _)| index)
    }

    fn run(&mut self) {
        //let _stopwatch = Stopwatch::start("run");
        self.run_n(1000);
    }

    fn runlots(&mut self) {
        //let _stopwatch = Stopwatch::start("runlots");
        self.run_n(10000);
    }

    fn run_n(&mut self, n: usize) {
        let update_n = min(n, self.rows.len());

        for i in 0..update_n {
            let mut row = &mut self.rows[i];
            row.id = self.next_id + i;
            row.label = Row::generate_label(&mut self.rng);
            row.refresh_element();
        }

        self.next_id += update_n;

        for i in update_n..n {
            let row = Row::new(
                self.next_id + i,
                Row::generate_label(&mut self.rng),
                &self.tr,
            );
            self.tbody.append_child(&row.root_element);
            self.rows.push(row);
        }

        self.next_id += n - update_n;
        self.selected_row_index = None;
    }

    fn add(&mut self) {
        //let _stopwatch = Stopwatch::start("add");
        let n = 1000;
        let new_rows = (0..n)
            .map(|i| {
                let row = Row::new(
                    self.next_id + i,
                    Row::generate_label(&mut self.rng),
                    &self.tr,
                );
                self.tbody.append_child(&row.root_element);
                row
            })
            .collect::<Vec<_>>();
        self.rows.extend(new_rows);
        self.next_id += n;
        self.selected_row_index = None;
    }

    fn update(&mut self) {
        //let _stopwatch = Stopwatch::start("update");
        let step = 10;
        for i in (0..(self.rows.len() / step)).map(|x| x * step) {
            let mut row = &mut self.rows[i];
            row.label.push_str(" !!!");
            row.refresh_label();
        }
    }

    fn unselect(&mut self) {
        if let Some(index) = self.selected_row_index {
            self.rows[index]
                .root_element
                .set_attribute("class", "")
                .unwrap();
            self.selected_row_index = None;
        }
    }

    fn select(&mut self, index: usize) {
        if self.selected_row_index == Some(index) {
            return;
        }
        self.unselect();
        self.selected_row_index = Some(index);
        self.rows[index]
            .root_element
            .set_attribute("class", "danger")
            .unwrap();
    }

    fn delete(&mut self, index: usize) {
        //let _stopwatch = Stopwatch::start("delete");
        if let Some(selected_row_index) = self.selected_row_index {
            if selected_row_index == index {
                self.selected_row_index = None;
            } else if selected_row_index > index {
                self.selected_row_index = Some(selected_row_index - 1);
            }
        }
        for i in index..(self.rows.len() - 1) {
            self.rows[i].label = self.rows[i + 1].label.clone();
            self.rows[i].id = self.rows[i + 1].id;
            self.rows[i].refresh_element();
        }
        if let Some(row) = self.rows.pop() {
            row.root_element.remove();
        }
    }

    fn clear(&mut self) {
        //let _stopwatch = Stopwatch::start("clear");
        self.rows.clear();
        self.selected_row_index = None;
        self.tbody.set_text_content("");
    }

    fn swaprows(&mut self) {
        //let _stopwatch = Stopwatch::start("swaprows");
        if self.rows.len() < 999 {
            return;
        }

        let id = self.rows[1].id;
        let label = self.rows[1].label.clone();
        self.rows[1].id = self.rows[998].id;
        self.rows[1].label = self.rows[998].label.clone();
        self.rows[998].id = id;
        self.rows[998].label = label;

        self.rows[1].refresh_element();
        self.rows[998].refresh_element();
    }
}

fn main() {
    Main::new();
}
