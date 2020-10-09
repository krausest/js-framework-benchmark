use std::cmp::min;

use delorean::*;
use rand::{rngs::SmallRng, seq::SliceRandom};

use crate::{app::NonKeyed, row::Row};

#[rustfmt::skip]
static Q: [&str; 25] = [
    "pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain",
    "quaint","clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd",
    "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy",
];
static C: [&str; 11] = [
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];
static T: [&str; 13] = [
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];

fn get_label(rng: &mut SmallRng) -> String {
    let mut buf = String::with_capacity(24);
    buf.push_str(Q.choose(rng).unwrap());
    buf.push(' ');
    buf.push_str(C.choose(rng).unwrap());
    buf.push(' ');
    buf.push_str(T.choose(rng).unwrap());
    buf
}

fn run_n(app: &mut NonKeyed, n: usize) {
    let update_n = min(n, app.data.len());

    for (i, (dom, row)) in app
        .tbody_children
        .iter_mut()
        .zip(app.data.iter_mut())
        .enumerate()
        .take(update_n)
    {
        row.id = app.id + i as usize;
        row.label = get_label(&mut app.rng);
        dom.t_root = 0xFF;
    }

    for i in update_n..n {
        app.data.push(Row {
            id: app.id + i as usize,
            label: get_label(&mut app.rng),
        });
    }

    app.id += n;

    app.selected = None;
    app.t_root |= 0b0000_0011
}

pub enum Msg {
    Append,
    Clear,
    Create,
    Create10,
    Delete(usize),
    Select(usize),
    Swap,
    Update,
}

#[inline]
pub fn create(app: &mut NonKeyed, _mb: DeLorean<NonKeyed>) {
    run_n(app, 1_000);
}

#[inline]
pub fn create_10(app: &mut NonKeyed, _mb: DeLorean<NonKeyed>) {
    run_n(app, 10_000);
}

#[inline]
pub fn append(app: &mut NonKeyed, _mb: DeLorean<NonKeyed>) {
    let n = 1000;
    for i in 0..n {
        app.data.push(Row {
            id: app.id + i,
            label: get_label(&mut app.rng),
        })
    }
    app.id += n;
    app.t_root |= 0b0000_0001;
}

#[inline]
pub fn update(app: &mut NonKeyed, _mb: DeLorean<NonKeyed>) {
    for (row, dom) in app
        .data
        .iter_mut()
        .zip(app.tbody_children.iter_mut())
        .step_by(10)
    {
        row.label.push_str(" !!!");
        dom.t_root |= 0b0000_0001;
    }

    app.t_root |= 0b0000_0001;
}

#[inline]
pub fn clear(app: &mut NonKeyed, _mb: DeLorean<NonKeyed>) {
    app.data.clear();
    app.tbody_children.clear();
    app.tbody.set_text_content(None);
    app.selected = None;
    app.t_root |= 0b0000_0010;
}

#[inline]
pub fn swap(app: &mut NonKeyed, _mb: DeLorean<NonKeyed>) {
    if app.data.len() < 999 {
        return;
    }

    app.data.swap(1, 998);
    app.tbody_children[1].t_root = 0xFF;
    app.tbody_children[998].t_root = 0xFF;
    app.t_root |= 0b0000_0001;
}

#[inline]
pub fn select(app: &mut NonKeyed, msg: usize, _mb: DeLorean<NonKeyed>) {
    if let Some(t) = app.selected {
        if t == msg {
            app.selected = None;
            app.t_root |= 0b0000_0010;
            return;
        }
    }

    app.selected = Some(msg);
    app.t_root |= 0b0000_0010;
}

#[inline]
pub fn delete(app: &mut NonKeyed, msg: usize, _mb: DeLorean<NonKeyed>) {
    if let Some(position) = app.data.iter().position(|x| x.id == msg) {
        app.data.remove(position);
        app.tbody_children.remove(position).root.remove();

        // select
        if let Some(selected) = app.selected {
            if msg == selected {
                app.selected = None;
                app.old_selected = None;
            } else {
                app.old_selected = app.data.iter().position(|x| x.id == selected)
            }
        }
    }
}
