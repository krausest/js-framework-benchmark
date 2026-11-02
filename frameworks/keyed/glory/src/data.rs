//! Standard fixture randomness, matching the usual Math.random word generator.
#[derive(Clone, Debug, PartialEq)]
pub struct Row {
    pub id: usize,
    pub label: String,
}
pub struct Generator {
    next: usize,
}
impl Default for Generator {
    fn default() -> Self {
        Self { next: 1 }
    }
}
impl Generator {
    pub fn rows(&mut self, count: usize) -> Vec<Row> {
        const ADJECTIVES: &[&str] = &[
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
        const COLOURS: &[&str] = &[
            "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
            "orange",
        ];
        const NOUNS: &[&str] = &[
            "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich",
            "burger", "pizza", "mouse", "keyboard",
        ];
        let draw = |n| (js_sys::Math::random() * 1000.0).round() as usize % n;
        (0..count)
            .map(|_| {
                let label = format!(
                    "{} {} {}",
                    ADJECTIVES[draw(ADJECTIVES.len())],
                    COLOURS[draw(COLOURS.len())],
                    NOUNS[draw(NOUNS.len())]
                );
                let id = self.next;
                self.next += 1;
                Row { id, label }
            })
            .collect()
    }
}
