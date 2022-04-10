open! Core_kernel;
open Incr_dom;
open JsFrameworkBenchmarkComponents.Util;

let () = Start_app.start(
  ~debug=App.is_debug,
  ~bind_to_element_with_id="main",
  (module App),
  ~initial_model=App.Model.Fields.create(~data=[||], ~selected=None),
);
