import { core, operators, runtime, collections } from "stillflow.engine"
import { buildData } from "./data"

const { Stillflow, State, Batcher } = core
const { dom, $ } = runtime

type BenchmarkItem = {
  id: number,
  index: number,
  label: string
}

type BenchmarkMapping = {
  previous_id: number | undefined,
  current_id: number | undefined,
  data: BenchmarkItem[]
}

type FullBenchmarkView = {
  selection: {
    current_id: BenchmarkMapping['current_id'],
    previous_id: BenchmarkMapping['previous_id']
  },
  data: BenchmarkMapping['data'],
  items: collections.Flushable<BenchmarkItem>
}

class BenchmarkApplicationController {
  private _stillflow = new Stillflow<BenchmarkMapping>(new State())
  private _clearing = new Batcher(site => site())
  private _factory = this._stillflow.factory()

  private _view: FullBenchmarkView

  private schedule_clear() {
    this._view.items.clear()

    this._clearing.task(() => this._view.items.shrink())
  }

  private deselect() {
    this._view.selection.current_id = undefined
    this._view.selection.previous_id = undefined
  }

  private create(count: number = 1000) {
    this.schedule_clear()
    this.deselect()
    this.add(count)
  }

  private get source() {
    const previous_id = this._stillflow.variable('previous_id')
    const current_id = this._stillflow.variable('current_id')
    const data = this._stillflow.variable('data')

    return {
      selection: operators.link({
        previous_id: previous_id.backref(),
        current_id: current_id.backref()
      }),
      data: data.backref(),
      items: operators.is('collection')
    }
  }

  public constructor() {
    const col = new collections.Flushable(new collections.Fenwick(500))

    const view = this._stillflow.compile(this.source)

    this._factory.add('collection', view => col)

    this._view = this._stillflow.instantiate(view, this._factory)
  }

  public is_selected(id: number) {
    return this._view.selection.current_id === id
  }

  public add(count: number = 1000) {
    const data = buildData(count)

    for (let index = 0; index < count; index++) {
      (data[index] as any).index = index
    }

    this._view.items.attach(data)
    this._stillflow.commit()
  }

  public run() {
    this.create(1000)
  }

  public run_lots() {
    this.create(10000)
  }

  public remove(id: number) {
    if (this.is_selected(id)) {
      this._view.selection.current_id = undefined
    }

    this._view.items.remove(id)
    this._stillflow.commit()
  }

  public select(id: number) {
    const NO_OP = () => { }

    this._view.selection.previous_id = this._view.selection.current_id
    this._view.selection.current_id = id

    if (this._view.selection.previous_id !== undefined) {
      this._view.items.mutate(this._view.selection.previous_id, NO_OP)
    }

    this._view.items.mutate(id, NO_OP)

    this._stillflow.commit()
  }

  public clear() {
    this.schedule_clear()
    this._stillflow.commit()
  }

  public update() {
    const length = this._view.items.size
    const mutator = (view: BenchmarkItem) => view.label += ' !!!'

    for (let id = 0; id < length; id += 10) {
      this._view.items.mutate(id, mutator)
    }

    this._stillflow.commit()
  }

  public swap() {
    const size = this._view.items.size

    if (size > 998) {
      this._view.items.swap(1, 998)
      this._stillflow.commit()
    }
  }

  public get items() {
    return this._view.items
  }

  public get core() {
    return this._stillflow
  }
}

function BenchmarkApplicationHeader() {
  return (
    <dom.div className="col-md-6">
      <dom.h1>Stillflow</dom.h1>
    </dom.div>
  )
}

function BenchmarkApplicationButton(context: { text: string, id: string, handle: () => void }) {
  return (
    <dom.div className="col-sm-6 smallpad">
      <dom.button type="button" className="btn btn-primary btn-block" id={context.id} on:click={context.handle}>
        {context.text}
      </dom.button>
    </dom.div>
  )
}

function BenchmarkApplicationTableRow(context: { controller: BenchmarkApplicationController }) {
  const { controller } = context

  return (
    <dom.tr sf:className={(context: BenchmarkItem) => controller.is_selected(context.index) ? "danger" : String()}>
      <dom.td className="col-md-1">
        {(context: BenchmarkItem) => context.id}
      </dom.td>
      <dom.td className="col-md-4">
        <dom.a sf:on-click={(event, context: BenchmarkItem) => controller.select(context.index)}>
          {(context: BenchmarkItem) => context.label}
        </dom.a>
      </dom.td>
      <dom.td className="col-md-1">
        <dom.a sf:on-click={(event, context: BenchmarkItem) => controller.remove(context.index)}>
          <dom.span ariaHidden="true" className="glyphicon glyphicon-remove"/>
        </dom.a>
      </dom.td>
      <dom.td className="col-md-6"/>
    </dom.tr>
  )
}

function BenchmarkApplicationTable(context: { controller: BenchmarkApplicationController }) {
  const { controller } = context
  
  return (
    <dom.table className="table table-hover table-striped test-data">
      <dom.tbody sf:for={() => controller.items} sf:each={() => <BenchmarkApplicationTableRow controller={controller} />} />
    </dom.table>
  )
}

function BenchmarkApplicationView(context: { controller: BenchmarkApplicationController }) {
  const { controller } = context

  return (
    <dom.div id="app" className="container">
      <dom.div className="jumbotron">
        <dom.div className="row">
          <BenchmarkApplicationHeader />
          <dom.div className="row">
            <dom.div className="col-md-6">
              <BenchmarkApplicationButton text="Create 1,000 rows" id="run" handle={() => controller.run()}/>
              <BenchmarkApplicationButton text="Create 10,000 rows" id="runlots" handle={() => controller.run_lots()} />
              <BenchmarkApplicationButton text="Append 1,000 rows" id="add" handle={() => controller.add()} />
              <BenchmarkApplicationButton text="Update every 10th row" id="update" handle={() => controller.update()} />
              <BenchmarkApplicationButton text="Clear" id="clear" handle={() => controller.clear()} />
              <BenchmarkApplicationButton text="Swap rows" id="swaprows" handle={() => controller.swap()} />
            </dom.div>
          </dom.div>
        </dom.div>
      </dom.div>
      <BenchmarkApplicationTable controller={controller}/>
      <dom.span ariaHidden="true" className="preloadicon glyphicon glyphicon-remove"/>
    </dom.div>
  )
}

type ItemData = {
  text: string
  items: collections.Flushable<ItemData>
}

function Item() {
  return (
    <dom.div>
      <dom.div>{(context: ItemData) => context.text}</dom.div>
      <dom.div sf:for={(context: ItemData) => context.items} sf:each={() => <Item />}></dom.div>
    </dom.div>
  )
}

const controller = new BenchmarkApplicationController()

const Fabric = $(<BenchmarkApplicationView controller={controller} />)

const { app, root } = Fabric

document.body.appendChild(root)

controller.core.on(() => app(root, {}))
controller.core.commit()