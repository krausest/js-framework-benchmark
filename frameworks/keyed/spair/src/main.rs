use spair::prelude::*;
use rand::prelude::*;

fn main() {
    App::mount_to_element_id("main");
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct RowData {
    id: u64,
    label: String,
}

#[derive(Clone, PartialEq)]
struct App {
    last_id: u64,
    rows: Vec<RowData>,
    selected_id: Option<u64>,
}

impl App {
    fn append_rows(&mut self, count: usize) {
        let mut rng = SmallRng::from_entropy();
        self.rows.reserve(count);
        for i in 0..count {
            let adjective = ADJECTIVES.choose(&mut rng).unwrap_throw();
            let colour = COLOURS.choose(&mut rng).unwrap_throw();
            let noun = NOUNS.choose(&mut rng).unwrap_throw();
            let capacity = adjective.len() + colour.len() + noun.len() + 2;
            let mut label = String::with_capacity(capacity);
            label.push_str(adjective);
            label.push(' ');
            label.push_str(colour);
            label.push(' ');
            label.push_str(noun);
            let id = self.last_id + i as u64 + 1;
            self.rows.push(RowData{
                id,
                label,
            });
        }
        self.last_id += count as u64;
    }

    fn append(&mut self, count: usize) {
        self.append_rows(count);
    }

    fn create(&mut self, count: usize) {
        self.selected_id = None;
        self.rows.clear();
        self.append_rows(count);
    }

    fn update_every_10th(&mut self) {
        self.rows.iter_mut().step_by(10).for_each(|row| row.label += " !!!");
    }

    fn swap(&mut self, a: usize, b: usize) {
        if b > a && self.rows.len() > a + 1 && self.rows.len() > b {
            self.rows.swap(a, b);
        }
    }

    fn remove_by_id(&mut self, id: u64) {
        self.rows.retain(|r| r.id != id);
    }

    fn clear(&mut self) {
        self.rows.clear();
        self.selected_id = None;
    }

    fn set_selected_id(&mut self, id: u64) {
        self.selected_id = Some(id);
    }
}

impl spair::Application for App {
    fn init(_: &spair::Comp<App>) -> Self {
        Self {
            last_id: 0,
            rows: Vec::new(),
            selected_id: None,
        }
    }
}

impl spair::Component for App {
    type Routes = ();
    fn render(&self, e: spair::Element<Self>) {
        e.div(|d| {
            d
                .class("container")
                .static_nodes()
                .div(render_header)
                .update_nodes()
                .table(|t| {
                    t.static_attributes()
                        .class("table")
                        .class("table-hover")
                        .class("table-striped")
                        .class("test-data")
                        .tbody(|b| {
                            b.id("tbody")
                                .keyed_list_clone(self.rows.iter());
                        });
                })
                .span(|s| {
                    s.class("preloadicon")
                    .class("glyphicon")
                    .class("glyphicon-remove")
                    .set_attribute_str("aria-hidden", "true");
                });
        });
    }
}

fn render_header(div: spair::Element<App>) {
    let comp = div.comp();
    div.class("jumbotron")
        .div(|d| {
            d.class("row")
                .div(|d| d.class("col-md-6").h1(|h| h.rstatic("Spair Keyed").done()).done())
                .div(|d| {
                    d.class("col-md-6")
                        .div(|d| {
                            d.class("row")
                                .rupdate(Button(
                                    "run",
                                    "Create 1,000 rows",
                                    comp.handler_mut(|state| state.create(1000)),
                                ))
                                .rupdate(Button(
                                    "runlots",
                                    "Create 10,000 rows",
                                    comp.handler_mut(|state| state.create(10000)),
                                ))
                                .rupdate(Button(
                                    "add",
                                    "Append 1,000 rows",
                                    comp.handler_mut(|state| state.append(1000)),
                                ))
                                .rupdate(Button(
                                    "update",
                                    "Update every 10th row",
                                    comp.handler_mut(App::update_every_10th),
                                ))
                                .rupdate(Button(
                                    "clear",
                                    "Clear",
                                    comp.handler_mut(App::clear),
                                ))
                                .rupdate(Button(
                                    "swaprows",
                                    "Swap rows",
                                    comp.handler_mut(|state| state.swap(1, 998)),
                                ));
                        });
                });
        });
}

struct Button<H>(&'static str, &'static str, H);
impl<H: spair::Click> spair::Render<App> for Button<H> {
    fn render(self, nodes: spair::Nodes<App>) {
        let Button(id, title, handler) = self;
        nodes.div(|d| {
            d.class("col-sm-6").class("smallpad")
                .button(|i| {
                    i.id(id)
                        .r#type(spair::InputType::Button)
                        .class("btn")
                        .class("btn-primary")
                        .class("btn-block")
                        .on_click(handler)
                        .rstatic(title);
                });
        });
    }
}

impl<'k> spair::Keyed<'k> for &RowData {
    type Key = u64;
    fn key(&self) -> u64 {
        self.id
    }
}

impl spair::ElementRender<App> for &RowData {
    const ELEMENT_TAG: &'static str = "tr";
    fn render(self, e: spair::Element<App>) {
        let state = e.state();
        let comp = e.comp();
        let id = self.id;
        let in_danger = state.selected_id == Some(self.id);
        e
            .class_if(in_danger, "danger")
            .td(|d| d.class("col-md-1").rupdate(self.id).done())
            .td(|d| {
                d.class("col-md-4")
                    .static_attributes()
                    .on_click(comp.handler_mut(move |state| state.set_selected_id(id)))
                    .a(|a| a.class("lbl").rupdate(&self.label).done());
            })
            .td(|d| {
                d.class("col-md-1")
                    .a(|a| {
                        a.class("remove")
                            .static_attributes()
                            .on_click(comp.handler_mut(move |state| state.remove_by_id(id)))
                            .static_nodes()
                            .span(|s| {
                                s.class("remove")
                                .class("glyphicon")
                                .class("glyphicon-remove")
                                .class("remove")
                                .set_attribute_str("aria-hidden", "true");
                            });
                    });
            })
            .td(|d| d.class("col-md-6").done());
    }
}

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
