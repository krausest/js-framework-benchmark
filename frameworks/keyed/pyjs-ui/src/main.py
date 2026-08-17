from typing import Final

from pyjs import JS, effect, js, state
from pyjs.javascript import Math
from pyjs.web.dom import Element, document
from pyjs.web.domx import CustomElement, ref, tag
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
def benchmark_button(button_id: str, label: str) -> Element:
    return tag(
        "div",
        {"class": "col-sm-6 smallpad"},
        tag(
            "button",
            {
                "class": "btn btn-primary btn-block",
                "id": button_id,
                "type": "button",
            },
            label,
        ),
    )


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
class BenchmarkApp(CustomElement):
    selected_id = state(0)

    def __init__(self):
        super().__init__()
        self.rows: list[Row] = []
        self.next_id = 1
        self.body = ref(tag("tbody"))
        run = benchmark_button("run", "Create 1,000 rows")
        run_lots = benchmark_button("runlots", "Create 10,000 rows")
        add = benchmark_button("add", "Append 1,000 rows")
        update = benchmark_button("update", "Update every 10th row")
        clear = benchmark_button("clear", "Clear")
        swap = benchmark_button("swaprows", "Swap Rows")
        tag(
            self,
            tag(
                "div",
                {"class": "container"},
                tag(
                    "div",
                    {"class": "jumbotron"},
                    tag(
                        "div",
                        {"class": "row"},
                        tag(
                            "div",
                            {"class": "col-md-6"},
                            tag("h1", "PyJS UI-keyed"),
                        ),
                        tag(
                            "div",
                            {"class": "col-md-6"},
                            tag(
                                "div",
                                {"class": "row"},
                                run,
                                run_lots,
                                add,
                                update,
                                clear,
                                swap,
                            ),
                        ),
                    ),
                ),
                tag(
                    "table",
                    {"class": "table table-hover table-striped test-data"},
                    self.body,
                ),
                tag(
                    "span",
                    {
                        "aria-hidden": "true",
                        "class": "preloadicon glyphicon glyphicon-remove",
                    },
                ),
            ),
        )
        self.addEventListener("click", self.handle_click)

    @effect(selected_id)
    def render_selection(self):
        selected = self.body.querySelector(".danger")
        if selected is not None:
            selected.className = ""
        if self.selected_id == 0:
            return
        current = self.body.querySelector('[id="' + str(self.selected_id) + '"]')
        if current is not None:
            current.className = "danger"

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

    def clear(self):
        self.rows = []
        self.body.replaceChildren()
        self.selected_id = 0

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
        self.selected_id = row.id

    def delete(self, row: Row):
        was_selected = self.selected_id == row.id
        row.element.remove()
        self.rows.remove(row)
        if was_selected:
            self.selected_id = 0

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
    document.body.append(BenchmarkApp())
