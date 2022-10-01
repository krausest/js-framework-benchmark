#![cfg(target_arch = "wasm32")]
#[macro_use]
extern crate serde_derive;

use wasm_bindgen::prelude::*;

use delorean::run;

use crate::app::NonKeyed;

mod app;
mod handler;
#[macro_use]
mod row;

#[wasm_bindgen(start)]
pub fn start() {
    let _app = run!(NonKeyed);
}
