import ElementaryUI
import Reactivity

struct Row: Identifiable {
    let id: Int
    var label: String
}

private let adjectives = [
    "pretty", "large", "big", "small", "tall", "short", "long", "handsome",
    "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful",
    "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
    "cheap", "expensive", "fancy",
]

// "brown" appears twice intentionally — matches the benchmark word list
private let colours = [
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown",
    "white", "black", "orange",
]

private let nouns = [
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie",
    "sandwich", "burger", "pizza", "mouse", "keyboard",
]

private func randomLabel(using rng: inout some RandomNumberGenerator) -> String {
    "\(adjectives.randomElement(using: &rng)!) \(colours.randomElement(using: &rng)!) \(nouns.randomElement(using: &rng)!)"
}

struct SimpleRandomNumberGenerator: RandomNumberGenerator {
    private var state = UInt64.random(in: .min ... .max)

    mutating func next() -> UInt64 {
        state &+= 0x9E37_79B9_7F4A_7C15
        var z = state
        z = (z ^ (z >> 30)) &* 0xBF58_476D_1CE4_E5B9
        z = (z ^ (z >> 27)) &* 0x94D0_49BB_1331_11EB
        return z ^ (z >> 31)
    }
}

@Reactive
final class BenchmarkStore {
    var rows: [Row] = []
    var selectedID: Int? = nil
    private var nextID: Int = 1
    // SystemRandomNumberGenerator calls crypto.getRandomValues (via WASI random_get) for every number
    // which is quite expensive for bulk data generation.
    @ReactiveIgnored private var rng = SimpleRandomNumberGenerator()

    func run() {
        rows = buildData(1000)
        selectedID = nil
    }

    func runLots() {
        rows = buildData(10000)
        selectedID = nil
    }

    func add() {
        rows.append(contentsOf: buildData(1000))
    }

    func update() {
        for i in stride(from: 0, to: rows.count, by: 10) {
            rows[i].label += " !!!"
        }
    }

    func clear() {
        rows = []
        selectedID = nil
    }

    func swapRows() {
        guard rows.count > 998 else { return }
        rows.swapAt(1, 998)
    }

    func select(_ id: Int) {
        selectedID = id
    }

    func delete(_ id: Int) {
        if let index = rows.firstIndex(where: { $0.id == id }) {
            rows.remove(at: index)
        }
    }

    private func buildData(_ count: Int) -> [Row] {
        var data: [Row] = []
        data.reserveCapacity(count)

        for _ in 0..<count {
            data.append(Row(id: nextID, label: randomLabel(using: &rng)))
            nextID += 1
        }

        return data
    }
}

@View
struct ActionButton {
    var buttonID: String
    var title: String
    var action: () -> Void

    var body: some View {
        div(.class("col-sm-6 smallpad")) {
            button(.id(buttonID), .type(.button), .class("btn btn-primary btn-block")) {
                title
            }
            .onClick(action)
        }
    }
}

@View
struct RowView {
    @Environment(BenchmarkStore.self) var store: BenchmarkStore
    var id: Int
    var label: String
    var isSelected: Bool

    var body: some View {
        tr {
            td(.class("col-md-1")) {
                "\(id)"
            }
            td(.class("col-md-4")) {
                a { label }
                    .onClick { store.select(id) }
            }
            td(.class("col-md-1")) {
                a {
                    span(
                        .class("glyphicon glyphicon-remove"),
                        .custom(name: "aria-hidden", value: "true")
                    ) {}
                }
                .onClick { store.delete(id) }
            }
            td(.class("col-md-6")) {}
        }.attributes(.class("danger"), when: isSelected)
    }
}

@View
struct DataTable {
    @Environment(BenchmarkStore.self) var store: BenchmarkStore

    var body: some View {
        table(.class("table table-hover table-striped test-data")) {
            tbody(.id("tbody")) {
                ForEach(store.rows) { row in
                    RowView(
                        id: row.id,
                        label: row.label,
                        isSelected: store.selectedID == row.id
                    )
                }
            }
        }
    }
}

@View
struct Jumbotron {
    @Environment(BenchmarkStore.self) var store: BenchmarkStore

    var body: some View {
        div(.class("jumbotron")) {
            div(.class("row")) {
                div(.class("col-md-6")) {
                    h1 { "ElementaryUI (keyed)" }
                }
                div(.class("col-md-6")) {
                    div(.class("row")) {
                        ActionButton(buttonID: "run", title: "Create 1,000 rows", action: store.run)
                        ActionButton(
                            buttonID: "runlots", title: "Create 10,000 rows", action: store.runLots)
                        ActionButton(buttonID: "add", title: "Append 1,000 rows", action: store.add)
                        ActionButton(
                            buttonID: "update", title: "Update every 10th row", action: store.update
                        )
                        ActionButton(buttonID: "clear", title: "Clear", action: store.clear)
                        ActionButton(
                            buttonID: "swaprows", title: "Swap Rows", action: store.swapRows)
                    }
                }
            }
        }
    }
}

@View
struct BenchmarkApp {
    @State var store = BenchmarkStore()

    var body: some View {
        div(.id("main")) {
            div(.class("container")) {
                Jumbotron()
                DataTable()
            }
        }
        .environment(store)
    }
}

Application(BenchmarkApp()).mount(in: "#app")
