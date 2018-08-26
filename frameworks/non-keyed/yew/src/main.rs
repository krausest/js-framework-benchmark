extern crate js_framework_benchmark_yew;
extern crate stdweb;
extern crate yew;

use js_framework_benchmark_yew::Model;
use stdweb::web::{document, IParentNode};
use yew::prelude::*;

fn main() {
    yew::initialize();
    let app = App::<Model>::new();
    let selector = "#main";
    app.mount(
        document()
            .query_selector(selector)
            .expect(&format!("failed to query selector '{}'", selector))
            .expect(&format!("element '{}' not found", selector)),
    );
    yew::run_loop();
}
