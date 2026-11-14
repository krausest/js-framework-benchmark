import { core, operators, adapters, collection } from "stillflow.engine"
import { buildData } from "./data"

const { Stillflow, State, Batcher } = core
const { jsxdom, dom } = adapters

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
  items: collection.Flushable<BenchmarkItem>
}

class BenchmarkApplicationController {
  private _stillflow = new Stillflow<BenchmarkMapping>(new State())
  private _clearing = new Batcher(site => site())
  private _factory = this._stillflow.factory()

  private _view: FullBenchmarkView

  private schedule_clear() {
    this._view.items.mark_cleared()

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
    const col = new collection.Flushable(new collection.Fenwick(10000))

    const view = this._stillflow.compile(this.source)

    this._factory.add('collection', view => col)

    this._view = this._stillflow.instantiate(view, this._factory)
  }

  public is_selected(id: number) {
    return this._view.selection.current_id === id
  }

  public add(count: number = 1000) {
    const data = buildData(count)

    for (let i = 0; i < count; i++) {
      data[i].index = i
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
    this._view.items.mark_removed(id)
    this._stillflow.commit()
  }

  public select(id: number) {
    const NO_OP = () => { }

    this._view.selection.previous_id = this._view.selection.current_id
    this._view.selection.current_id = id

    this._view.items.mutate(this._view.selection.previous_id || 0, NO_OP)
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
      this._view.items.mutate(this._view.items.map(id), mutator)
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
    <jsxdom.div className="col-md-6">
      <jsxdom.h1>Stillflow</jsxdom.h1>
    </jsxdom.div>
  )
}

function BenchmarkApplicationButton(context: { text: string, id: string, handle: () => void }) {
  return (
    <jsxdom.div className="col-sm-6 smallpad">
      <jsxdom.button type="button" className="btn btn-primary btn-block" id={context.id} on:click={context.handle}>
        {context.text}
      </jsxdom.button>
    </jsxdom.div>
  )
}

function BenchmarkApplicationTableRow(context: { controller: BenchmarkApplicationController }) {
  const { controller } = context

  return (
    <jsxdom.tr sf:className={(context: BenchmarkItem) => controller.is_selected(context.index) ? "danger" : String()}>
      <jsxdom.td className="col-md-1">
        {(context: BenchmarkItem) => context.id}
      </jsxdom.td>
      <jsxdom.td className="col-md-4">
        <jsxdom.a sf:on-click={(event, context: BenchmarkItem) => controller.select(context.index)}>
          {(context: BenchmarkItem) => context.label}
        </jsxdom.a>
      </jsxdom.td>
      <jsxdom.td className="col-md-1">
        <jsxdom.a sf:on-click={(event, context: BenchmarkItem) => controller.remove(context.index)}>
          <jsxdom.span ariaHidden="true" className="glyphicon glyphicon-remove"/>
        </jsxdom.a>
      </jsxdom.td>
      <jsxdom.td className="col-md-6"/>
    </jsxdom.tr>
  )
}

function BenchmarkApplicationTable(context: { controller: BenchmarkApplicationController }) {
  const { controller } = context
  
  return (
    <jsxdom.table className="table table-hover table-striped test-data">
      <jsxdom.tbody sf:for={() => controller.items} sf:each={() => <BenchmarkApplicationTableRow controller={controller} />} />
    </jsxdom.table>
  )
}

function BenchmarkApplicationView(context: { controller: BenchmarkApplicationController }) {
  const { controller } = context

  return (
    <jsxdom.div id="app" className="container">
      <jsxdom.div className="jumbotron">
        <jsxdom.div className="row">
          <BenchmarkApplicationHeader />
          <jsxdom.div className="row">
            <jsxdom.div className="col-md-6">
              <BenchmarkApplicationButton text="Create 1,000 rows" id="run" handle={() => controller.run()}/>
              <BenchmarkApplicationButton text="Create 10,000 rows" id="runlots" handle={() => controller.run_lots()} />
              <BenchmarkApplicationButton text="Append 1,000 rows" id="add" handle={() => controller.add()} />
              <BenchmarkApplicationButton text="Update every 10th row" id="update" handle={() => controller.update()} />
              <BenchmarkApplicationButton text="Clear" id="clear" handle={() => controller.clear()} />
              <BenchmarkApplicationButton text="Swap rows" id="swaprows" handle={() => controller.swap()} />
            </jsxdom.div>
          </jsxdom.div>
        </jsxdom.div>
      </jsxdom.div>
      <BenchmarkApplicationTable controller={controller}/>
      <jsxdom.span ariaHidden="true" className="preloadicon glyphicon glyphicon-remove"/>
    </jsxdom.div>
  )
}

const controller = new BenchmarkApplicationController()

const update = dom.$(<BenchmarkApplicationView controller={controller} />, {
  mode: 'keyed',
  container: document.body
})

controller.core.on(() => update({}))

update({})