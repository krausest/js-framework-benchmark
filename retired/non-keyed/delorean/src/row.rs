use wasm_bindgen::{prelude::*, UnwrapThrowExt};
use web_sys::{window, Element, Event};

#[derive(Debug, Deserialize)]
pub struct Row {
    pub id: usize,
    pub label: String,
}

pub struct RowDOM {
    pub t_root: u8,
    pub root: Element,
    // depend item.id
    pub id_node: Element,
    // depend item.label item.id
    pub label_node: Element,
    // depend item.id
    pub delete_node: Element,
    // depend item.id
    pub closure_select: Option<Closure<dyn Fn(Event)>>,
    // depend item.id
    pub closure_delete: Option<Closure<dyn Fn(Event)>>,
}

#[macro_export]
macro_rules! update_row {
    ($dom:ident, $row:ident, $addr:ident) => {
        // depend label
        if $dom.t_root & 0b0000_0001 != 0 {
            $dom.label_node.set_text_content(Some(&$row.label));
        }

        // depend id
        if $dom.t_root & 0b0000_0010 != 0 {
            $dom.label_node
                .remove_event_listener_with_callback(
                    "click",
                    &$dom
                        .closure_select
                        .as_ref()
                        .unwrap_throw()
                        .as_ref()
                        .unchecked_ref(),
                )
                .unwrap_throw();
            $dom.delete_node
                .remove_event_listener_with_callback(
                    "click",
                    &$dom
                        .closure_delete
                        .as_ref()
                        .unwrap_throw()
                        .as_ref()
                        .unchecked_ref(),
                )
                .unwrap_throw();

            let id = $row.id.clone();
            $dom.id_node.set_text_content(Some(&id.to_string()));

            $dom.closure_delete = Some(Closure::wrap(Box::new(move |event: Event| {
                event.prevent_default();
                $addr.send(Msg::Delete(id));
            }) as Box<dyn Fn(Event)>));
            $dom.delete_node
                .add_event_listener_with_callback(
                    "click",
                    &$dom
                        .closure_delete
                        .as_ref()
                        .unwrap_throw()
                        .as_ref()
                        .unchecked_ref(),
                )
                .unwrap_throw();

            $dom.closure_select = Some(Closure::wrap(Box::new(move |event: Event| {
                event.prevent_default();
                $addr.send(Msg::Select(id))
            }) as Box<dyn Fn(Event)>));
            $dom.label_node
                .add_event_listener_with_callback(
                    "click",
                    &$dom
                        .closure_select
                        .as_ref()
                        .unwrap_throw()
                        .as_ref()
                        .unchecked_ref(),
                )
                .unwrap_throw();
        }

        $dom.t_root = 0;
    };
}

#[macro_export]
macro_rules! new_row {
    ($row:ident, $elem:expr, $addr:ident, $parent:expr) => {{
        let root = $elem
            .clone_node_with_deep(true)
            .unwrap_throw()
            .unchecked_into::<Element>();
        let id_node = root.first_element_child().unwrap_throw();
        let label_parent = id_node.next_element_sibling().unwrap_throw();
        let label_node = label_parent.first_element_child().unwrap_throw();
        let delete_parent = label_parent.next_element_sibling().unwrap_throw();
        let delete_node = delete_parent.first_element_child().unwrap_throw();

        let id = $row.id;
        // depend id
        id_node.set_text_content(Some(&id.to_string()));

        // depend label
        label_node.set_text_content(Some(&$row.label));

        // depend id
        let closure_select = Closure::wrap(Box::new(move |event: Event| {
            event.prevent_default();
            $addr.send(Msg::Select(id));
        }) as Box<dyn Fn(Event)>);
        label_node
            .add_event_listener_with_callback("click", closure_select.as_ref().unchecked_ref())
            .unwrap_throw();

        let cloned = $addr.clone();
        let closure_delete = Closure::wrap(Box::new(move |event: Event| {
            event.prevent_default();
            cloned.send(Msg::Delete(id));
        }) as Box<dyn Fn(Event)>);
        delete_node
            .add_event_listener_with_callback("click", closure_delete.as_ref().unchecked_ref())
            .unwrap_throw();

        $parent.append_child(&root).unwrap_throw();

        RowDOM {
            t_root: 0,
            root,
            id_node,
            label_node,
            delete_node,
            closure_select: Some(closure_select),
            closure_delete: Some(closure_delete),
        }
    }};
}

#[macro_export]
macro_rules! hydrate_row {
    ($dom:ident, $row:ident, $addr:ident) => {
        let id = $row.id;
        let closure_select = Closure::wrap(Box::new(move |event: Event| {
            event.prevent_default();
            $addr.send(Msg::Select(id));
        }) as Box<dyn Fn(Event)>);
        $dom.label_node
            .add_event_listener_with_callback("click", closure_select.as_ref().unchecked_ref())
            .unwrap_throw();
        $dom.closure_select = Some(closure_select);

        let closure_delete = Closure::wrap(Box::new(move |event: Event| {
            event.prevent_default();
            $addr.send(Msg::Delete(id));
        }) as Box<dyn Fn(Event)>);
        $dom.delete_node
            .add_event_listener_with_callback("click", closure_delete.as_ref().unchecked_ref())
            .unwrap_throw();
        $dom.closure_delete = Some(closure_delete);
    };
}

pub fn row_element() -> Element {
    let document = window().unwrap_throw().document().unwrap_throw();
    let tr = document.create_element("tr").unwrap_throw();
    let td1 = td("col-md-1");
    tr.append_child(&td1).unwrap_throw();

    let td2 = td("col-md-4");
    tr.append_child(&td2).unwrap_throw();
    let a2 = document.create_element("a").unwrap_throw();
    a2.set_attribute("class", "lbl").unwrap_throw();
    td2.append_child(&a2).unwrap_throw();

    let td3 = td("col-md-1");
    tr.append_child(&td3).unwrap_throw();
    let a3 = document.create_element("a").unwrap_throw();
    a3.set_attribute("class", "remove").unwrap_throw();
    td3.append_child(&a3).unwrap_throw();
    let span = document.create_element("span").unwrap_throw();
    span.set_attribute("class", "glyphicon glyphicon-remove remove")
        .unwrap_throw();
    span.set_attribute("aria-hidden", "true").unwrap_throw();
    a3.append_child(&span).unwrap_throw();

    let td4 = td("col-md-6");
    tr.append_child(&td4).unwrap_throw();

    tr
}

fn td(class_name: &str) -> Element {
    let document = window().unwrap_throw().document().unwrap_throw();
    let td = document.create_element("td").unwrap_throw();
    td.set_attribute("class", class_name).unwrap_throw();
    td
}
