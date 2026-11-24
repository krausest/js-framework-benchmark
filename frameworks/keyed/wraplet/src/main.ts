import {
  AbstractDependentWraplet,
  AbstractWraplet,
  DDM,
  DependencyManager,
  getWrapletsFromNode,
  WrapletDependencyMap,
} from "@wraplet/core";

const adjectives = [
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
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = [
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
];

function randomWord(words: string[]) {
  return words[Math.round(Math.random() * 1000) % words.length];
}

class Row extends AbstractWraplet<HTMLTableRowElement> {
  private readonly labelNode: HTMLAnchorElement;

  constructor(
    element: HTMLTableRowElement,
    id: number,
    label: string,
    private readonly selectedCallback: (row: Row) => void
  ) {
    super(element);
    this.node.cells[0].textContent = String(id);
    this.labelNode = this.node.querySelector("[data-label]")!;
    this.setLabel(label);
  }

  protected async onInitialize() {
    this.nodeManager.addListenerTo("[data-remove]", "click", () => this.wraplet.destroy());
    this.nodeManager.addListenerTo("[data-label]", "click", () => {
      this.setSelected(true);
    });
  }

  protected override async onDestroy() {
    this.node.remove();
  }

  public setLabel(label: string) {
    this.labelNode.textContent = label;
  }

  public updateLabel(): string {
    return (this.labelNode.textContent += " !!!");
  }

  public setSelected(selected: boolean): this {
    if (selected) {
      this.node.classList.add("danger");
      this.selectedCallback(this);
    } else {
      this.node.classList.remove("danger");
    }
    return this;
  }
}

class Template extends AbstractWraplet<HTMLTemplateElement> {
  public create(): HTMLTableRowElement {
    const template = this.node.content.firstElementChild!;
    return template.cloneNode(true) as HTMLTableRowElement;
  }
}

const containerMap = {
  rows: {
    Class: Row,
    required: false,
    multiple: true,
  },
  template: {
    Class: Template,
    required: true,
    multiple: false,
  },
} satisfies WrapletDependencyMap;

class Container extends AbstractDependentWraplet<HTMLTableSectionElement, typeof containerMap> {
  private nextId = 1;
  private selectedRow: Row | undefined;

  public constructor(dm: DependencyManager<HTMLTableSectionElement, typeof containerMap>, template: Template) {
    // This is an external dependency injected directly by the Container's parent.
    dm.setExistingInstance("template", template);
    super(dm);
  }

  protected override async onInitialize() {
    this.dm.addDependencyDestroyedListener("rows", async (row) => {
      if (this.selectedRow === row) this.selectedRow = undefined;
    });
  }

  public clear(): Promise<void[]> {
    return Promise.all(Array.from(this.d.rows, (row) => row.wraplet.destroy()));
  }

  public updateRows() {
    // This is a small optimization improving performance of accessing every 10th row,
    // as the `rows` dependency isn't indexed, so normally we would have to loop through
    // all rows to get indexes. However, because wraplet improves upon the vanilla js,
    // we can fall back to the vanilla js solution for the performance-critical tasks.
    const rows = this.node.rows;
    for (let i = 0; i < rows.length; i += 10) {
      const row = getWrapletsFromNode(rows[i])?.findOne((wraplet) => wraplet instanceof Row);
      if (row instanceof Row) {
        row.updateLabel();
      }
    }
  }

  public swapRows() {
    const rows = this.node.rows;
    if (rows.length < 999) return;
    const second = rows[1];
    const other = rows[998];
    const afterOther = other.nextSibling;
    second.before(other);
    this.node.insertBefore(second, afterOther);
  }

  public appendRows(count: number): Promise<void[]> {
    const promises: Promise<void>[] = [];
    for (let i = 0; i < count; i++) {
      const label = `${randomWord(adjectives)} ${randomWord(colours)} ${randomWord(nouns)}`;
      const rowElement = this.d.template.create();
      const row = new Row(rowElement, this.nextId++, label, this.rowHasBeenSelected);
      this.dm.addExistingInstance("rows", row);
      this.node.append(rowElement);
      promises.push(row.wraplet.initialize());
    }

    return Promise.all(promises);
  }

  private readonly rowHasBeenSelected = (row: Row) => {
    if (this.selectedRow) {
      this.selectedRow.setSelected(false);
    }
    this.selectedRow = row;
  };
}

const benchmarkMap = {
  container: {
    Class: Container,
    required: true,
    multiple: false,
  },
} satisfies WrapletDependencyMap;

class Benchmark extends AbstractDependentWraplet<HTMLBodyElement, typeof benchmarkMap> {

  constructor(dm: DependencyManager<HTMLBodyElement, typeof benchmarkMap>) {
    // Here we manually instantiate Template and pass it to the Container as an external dependency.
    const templateElement = dm.node.querySelector("#row-template") as HTMLTemplateElement;
    const template = new Template(templateElement);

    const tBody = dm.node.querySelector("tbody") as HTMLTableSectionElement;
    const containerDDM = new DDM(tBody, containerMap);

    dm.setExistingInstance("container", new Container(containerDDM, template));
    super(dm);
  }

  protected override async onInitialize() {
    this.nodeManager.addListenerTo("#run", "click", () => this.replaceRows(1000));
    this.nodeManager.addListenerTo("#runlots", "click", () => this.replaceRows(10000));
    this.nodeManager.addListenerTo("#add", "click", () => this.d.container.appendRows(1000));
    this.nodeManager.addListenerTo("#update", "click", () => this.updateRows());
    this.nodeManager.addListenerTo("#clear", "click", () => this.clear());
    this.nodeManager.addListenerTo("#swaprows", "click", () => this.swapRows());
  }

  private async replaceRows(count: number) {
    await this.d.container.clear();
    await this.d.container.appendRows(count);
  }

  private updateRows() {
    this.d.container.updateRows();
  }

  private swapRows() {
    this.d.container.swapRows();
  }

  private clear(): Promise<void[]> {
    return this.d.container.clear();
  }
}

await new Benchmark(new DDM(document.body as HTMLBodyElement, benchmarkMap)).wraplet.initialize();
