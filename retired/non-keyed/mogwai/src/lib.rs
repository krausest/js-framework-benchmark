use mogwai_dom::view::JsDom;
use mogwai_js_framework_benchmark::App;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn start() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
    console_log::init().expect("could not init console_log");
    JsDom::try_from(App::default().viewbuilder())
        .unwrap_throw()
        .run()
        .unwrap_throw();
}
