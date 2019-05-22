open! Core_kernel;
open! Incr_dom;
open! Js_of_ocaml;

Start_app.start(
  ~debug=true,
  ~bind_to_element_with_id="main",
  (module App),
  ~initial_model=App.Model.Fields.create(~data=[||], ~selected=None),
);
