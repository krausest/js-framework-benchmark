from typing import Final

from pyjs import JS, js
from pyjs.javascript import Math
from pyjs.web.dom import Element, document
from pyjs.web.domx import require_element, tag
from pyjs.web.events import Event


ADJECTIVES: Final[JS] = [
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
]
COLOURS: Final[JS] = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
]
NOUNS: Final[JS] = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
]


@js
def random_index(maximum: int) -> int:
    return round(Math.random() * 1000) % maximum


@js
class Row:
    def __init__(self, row_id: int, label: str):
        self.id = row_id
        self.label = tag("a", label)
        self.element = tag(
            "tr",
            {"id": str(row_id)},
            tag("td", {"class": "col-md-1"}, str(row_id)),
            tag("td", {"class": "col-md-4"}, self.label),
            tag(
                "td",
                {"class": "col-md-1"},
                tag(
                    "a",
                    tag(
                        "span",
                        {
                            "aria-hidden": "true",
                            "class": "glyphicon glyphicon-remove",
                        },
                    ),
                ),
            ),
            tag("td", {"class": "col-md-6"}),
        )

    def update(self):
        self.label.textContent += " !!!"


@js
class BenchmarkApp:
    def __init__(self):
        self.main = require_element(document.body, "#main")
        self.body = require_element(document.body, "#tbody")
        self.rows: list[Row] = []
        self.next_id = 1
        self.selected: Row | None = None
        self.main.addEventListener("click", self.handle_click)

    def build_rows(self, count: int) -> list[Row]:
        rows: list[Row] = []
        for _ in range(count):
            label = (
                f"{ADJECTIVES[random_index(len(ADJECTIVES))]} "
                f"{COLOURS[random_index(len(COLOURS))]} "
                f"{NOUNS[random_index(len(NOUNS))]}"
            )
            rows.append(Row(self.next_id, label))
            self.next_id += 1
        return rows

    def append_rows(self, count: int):
        new_rows = self.build_rows(count)
        fragment = document.createDocumentFragment()
        for row in new_rows:
            fragment.append(row.element)
        self.rows.extend(new_rows)
        self.body.append(fragment)

    def unselect(self):
        selected = self.selected
        if selected is not None:
            selected.element.className = ""
        self.selected = None

    def clear(self):
        self.rows = []
        self.body.replaceChildren()
        self.unselect()

    def run(self):
        self.clear()
        self.append_rows(1000)

    def run_lots(self):
        self.clear()
        self.append_rows(10000)

    def add(self):
        self.append_rows(1000)

    def update(self):
        for index in range(0, len(self.rows), 10):
            self.rows[index].update()

    def select(self, row: Row):
        self.unselect()
        self.selected = row
        row.element.className = "danger"

    def delete(self, row: Row):
        was_selected = self.selected is row
        row.element.remove()
        self.rows.remove(row)
        if was_selected:
            self.selected = None

    def find_row(self, element: Element) -> Row | None:
        for row in self.rows:
            if row.element is element:
                return row
        return None

    def swap_rows(self):
        if len(self.rows) <= 998:
            return
        first = self.rows[1]
        second = self.rows[998]
        after_second = self.rows[999].element
        self.body.insertBefore(second.element, first.element)
        self.body.insertBefore(first.element, after_second)
        self.rows[1] = second
        self.rows[998] = first

    def handle_click(self, event: Event):
        target: Element = event.target
        button = target.closest("button")
        if button is not None:
            action = button.id
            if action == "run":
                self.run()
            elif action == "runlots":
                self.run_lots()
            elif action == "add":
                self.add()
            elif action == "update":
                self.update()
            elif action == "clear":
                self.clear()
            elif action == "swaprows":
                self.swap_rows()
            return

        row_element = target.closest("tr")
        if row_element is None:
            return
        row = self.find_row(row_element)
        if row is None:
            return
        if target.closest(".glyphicon-remove") is None:
            self.select(row)
        else:
            self.delete(row)


def main():
    BenchmarkApp()
