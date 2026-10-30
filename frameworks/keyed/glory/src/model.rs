use crate::data::{Generator, Row};
use glory::{Cage, display::*};
use std::{cell::RefCell, rc::Rc};

#[derive(Clone)]
pub struct Model {
    pub rows: KeyedList<usize, Row>,
    pub selected: Cage<Option<usize>>,
    generator: Rc<RefCell<Generator>>,
}
impl Model {
    pub fn new(scope: &Scope) -> Self {
        Self {
            rows: scope.keyed_list(Vec::new(), |row: &Row| row.id).unwrap(),
            selected: scope.cage(None),
            generator: Rc::new(RefCell::new(Generator::default())),
        }
    }
    pub fn handler(&self, action: usize) -> impl FnMut() + 'static + use<> {
        let model = self.clone();
        move || model.action(action)
    }
    fn action(&self, action: usize) {
        match action {
            0 | 1 => self
                .rows
                .replace(
                    self.generator
                        .borrow_mut()
                        .rows(if action == 0 { 1000 } else { 10000 }),
                )
                .unwrap(),
            2 => self
                .rows
                .extend(self.generator.borrow_mut().rows(1000))
                .unwrap(),
            3 => {
                for index in (0..self.rows.len_untracked()).step_by(10) {
                    self.rows
                        .update_at(index, |row| row.label.push_str(" !!!"))
                        .unwrap();
                }
            }
            4 => {
                self.rows.clear().unwrap();
                self.selected.revise(|v| *v = None);
            }
            5 => {
                if self.rows.len_untracked() > 998 {
                    self.rows.swap(1, 998).unwrap();
                }
            }
            _ => unreachable!(),
        }
    }
    pub fn select(&self, id: usize) -> impl FnMut() + 'static + use<> {
        let selected = self.selected;
        move || selected.revise(|v| *v = Some(id))
    }
    pub fn remove(&self, id: usize) -> impl FnMut() + 'static + use<> {
        let rows = self.rows;
        move || {
            rows.remove_key(&id).unwrap();
        }
    }
    pub fn is_selected(&self, id: usize) -> impl FnMut() -> bool + 'static + use<> {
        let selected = self.selected;
        move || selected.get() == Some(id)
    }
}
