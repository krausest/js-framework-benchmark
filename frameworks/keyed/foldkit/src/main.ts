import { Array, Option, Schema } from 'effect'
import { Runtime, type Update } from 'foldkit'
import { type Html, type HtmlBuilder, createKeyedLazy } from 'foldkit/html'
import { defineMessageUnion } from 'foldkit/message'
import { modifyFields } from 'foldkit/struct'

// DATA

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy']
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard']

const random = (max: number) => Math.round(Math.random() * 1000) % max

// MODEL

const Row = Schema.Struct({ id: Schema.Number, label: Schema.String })
type Row = typeof Row.Type

export const Model = Schema.Struct({
  rows: Schema.Array(Row),
  selected: Schema.Option(Schema.Number),
  nextId: Schema.Number,
})
export type Model = typeof Model.Type

const buildRows = (nextId: number, count: number): ReadonlyArray<Row> =>
  Array.makeBy(count, index => ({
    id: nextId + index,
    label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`,
  }))

// MESSAGE

export const Message = defineMessageUnion({
  ClickedRun: {},
  ClickedRunLots: {},
  ClickedAdd: {},
  ClickedUpdate: {},
  ClickedClear: {},
  ClickedSwapRows: {},
  ClickedSelect: { id: Schema.Number },
  ClickedRemove: { id: Schema.Number },
})
export type Message = typeof Message.Type

// INIT

export const init: Runtime.ElementInit<Model, Message> = () => ({
  model: { rows: [], selected: Option.none(), nextId: 1 },
})

// UPDATE

const replaceRows = (model: Model, count: number): Model =>
  modifyFields(model, {
    rows: () => buildRows(model.nextId, count),
    selected: () => Option.none(),
    nextId: nextId => nextId + count,
  })

export const update = (model: Model, message: Message) =>
  Message.match<Update.Return<Model, Message>>(message, {
    ClickedRun: () => ({ model: replaceRows(model, 1000) }),
    ClickedRunLots: () => ({ model: replaceRows(model, 10000) }),
    ClickedAdd: () => ({
      model: modifyFields(model, {
        rows: rows => Array.appendAll(rows, buildRows(model.nextId, 1000)),
        nextId: nextId => nextId + 1000,
      }),
    }),
    ClickedUpdate: () => ({
      model: modifyFields(model, {
        rows: rows =>
          Array.map(rows, (row, index) =>
            index % 10 === 0
              ? modifyFields(row, { label: label => label + ' !!!' })
              : row,
          ),
      }),
    }),
    ClickedClear: () => ({
      model: modifyFields(model, {
        rows: () => [],
        selected: () => Option.none(),
      }),
    }),
    ClickedSwapRows: () => {
      if (model.rows.length <= 998) {
        return { model }
      }
      const rows = [...model.rows]
      const row1 = rows[1]
      rows[1] = rows[998]
      rows[998] = row1
      return { model: modifyFields(model, { rows: () => rows }) }
    },
    ClickedSelect: ({ id }) => ({
      model: modifyFields(model, { selected: () => Option.some(id) }),
    }),
    ClickedRemove: ({ id }) => ({
      model: modifyFields(model, {
        rows: rows => Array.filter(rows, row => row.id !== id),
      }),
    }),
  })

// VIEW

const buttonView = (
  id: string,
  title: string,
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class('col-sm-6 smallpad')],
    [
      h.button(
        [
          h.Id(id),
          h.Type('button'),
          h.Class('btn btn-primary btn-block'),
          h.OnClick(message),
        ],
        [title],
      ),
    ],
  )

const jumbotronView = (h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('jumbotron')],
    [
      h.div(
        [h.Class('row')],
        [
          h.div([h.Class('col-md-6')], [h.h1([], ['Foldkit keyed'])]),
          h.div(
            [h.Class('col-md-6')],
            [
              h.div(
                [h.Class('row')],
                [
                  buttonView('run', 'Create 1,000 rows', Message.ClickedRun(), h),
                  buttonView('runlots', 'Create 10,000 rows', Message.ClickedRunLots(), h),
                  buttonView('add', 'Append 1,000 rows', Message.ClickedAdd(), h),
                  buttonView('update', 'Update every 10th row', Message.ClickedUpdate(), h),
                  buttonView('clear', 'Clear', Message.ClickedClear(), h),
                  buttonView('swaprows', 'Swap Rows', Message.ClickedSwapRows(), h),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )

const rowView = (
  row: Row,
  isSelected: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  h.keyed('tr')(
    row.id,
    [h.Class(isSelected ? 'danger' : '')],
    [
      h.td([h.Class('col-md-1')], [String(row.id)]),
      h.td(
        [h.Class('col-md-4')],
        [h.a([h.OnClick(Message.ClickedSelect({ id: row.id }))], [row.label])],
      ),
      h.td(
        [h.Class('col-md-1')],
        [
          h.a(
            [h.OnClick(Message.ClickedRemove({ id: row.id }))],
            [
              h.span(
                [h.Class('glyphicon glyphicon-remove'), h.AriaHidden(true)],
                [],
              ),
            ],
          ),
        ],
      ),
      h.td([h.Class('col-md-6')], []),
    ],
  )

const lazyRow = createKeyedLazy()

export const view = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('container')],
    [
      jumbotronView(h),
      h.table(
        [h.Class('table table-hover table-striped test-data')],
        [
          h.tbody(
            [],
            Array.map(model.rows, row =>
              lazyRow(row.id, rowView, [
                row,
                Option.exists(model.selected, id => id === row.id),
                h,
              ]),
            ),
          ),
        ],
      ),
      h.span(
        [h.Class('preloadicon glyphicon glyphicon-remove'), h.AriaHidden(true)],
        [],
      ),
    ],
  )

// RUN

Runtime.run(
  Runtime.makeElement({
    Model,
    init,
    update,
    view,
    container: document.getElementById('main')!,
  }),
)
