import { Component, PlaitProps, FT, SugaredElement, QuerySelector } from 'plaited'

let did = 1
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const random = (max: number) => Math.round(Math.random() * 1000) % max

type DataItem = { id: number, label: string }
type Data = DataItem[]
const buildData = (count: number): Data => {
  const data = []
  for (let i = 0; i < count; i++) {
    data.push({
      id: did++,
      label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`
    })
  }
  return data
}

const Button:FT<{ id: string, value?: number}> = (attrs) => (
  <div className="col-sm-6 smallpad">
    <button type='button' className='btn btn-primary btn-block' {...attrs} />
  </div>
)

const template = <><link href="/css/currentStyle.css" rel="stylesheet" />
<div className="container">
  <div className="jumbotron"><div className="row">
    <div className="col-md-6"><h1>Plaited-"keyed"</h1></div>
    <div className="col-md-6"><div className="row">
      <Button data-trigger={{ click: 'run' }} id='run' value={1000}>Create 1,000 rows</Button>
      <Button data-trigger={{ click: 'run' }} id='runlots' value={10000}>Create 10,000 rows</Button>
      <Button data-trigger={{ click: 'add' }} id='add' value={1000}>Append 1,000 rows</Button>
      <Button data-trigger={{ click: 'update' }} id='update'>Update every 10th row</Button>
      <Button data-trigger={{ click: 'clear' }} id='clear'>Clear</Button>
      <Button data-trigger={{ click: 'swapRows' }} id='swaprows'>Swap Rows</Button>
    </div></div>
  </div></div>
  <table className="table table-hover table-striped test-data"><tbody id="tbody"  data-target='tbody' data-trigger={{click: 'interact'}}/></table>
</div>
<span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
<template data-target='template'>
  <tr data-target="row">
    <td className='col-md-1' data-target="id"></td>
    <td className='col-md-4'><a data-target='label'></a></td>
    <td className='col-md-1'><a><span className='glyphicon glyphicon-remove' aria-hidden='true' data-target='delete'></span></a></td>
    <td className='col-md-6'></td>
  </tr>
</template></> 

const forEachRow = ($: QuerySelector, data: DataItem)=> {
  $('row')[0].attr('data-target', `${data.id}`)
  $('id')[0].render(`${data.id}`)
  $('label')[0].render(data.label)
}

class BenchMark extends Component({
  tag: 'js-benchmark',
  template,
}){
  plait({ feedback, $ }: PlaitProps) {
    let selected = -1
    const [tbody] = $('tbody')
    const cb =  $('template')[0].clone<DataItem>(forEachRow)
    feedback({
      add(evt: MouseEvent& { target: HTMLButtonElement }){tbody.insert('beforeend',...buildData(parseInt(evt.target.value)).map(cb))},
      run(evt: MouseEvent& { target: HTMLButtonElement }){tbody.render(...buildData(parseInt(evt.target.value)).map(cb))},
      clear(){tbody.replaceChildren()},
      interact(evt: MouseEvent & { target: HTMLElement }) {
        const target = evt.target
        if (target.dataset.target === 'delete') return target.closest('tr').remove()
        if(target.dataset.target === 'label') {
          if (selected > -1) {$(`${selected}`)[0]?.attr('class', null)}
          const row = target.closest<SugaredElement>('tr')
          row.attr('class', 'danger')
          selected = parseInt(row.dataset.target)
        }
      },
      swapRows() {
        const rows = Array.from($('tbody')[0].childNodes)
        tbody.insertBefore(rows[1], rows[999])
        tbody.insertBefore(rows[998], rows[2])
      },
      update() {
        const labels = $('label')
        const length = labels.length
        for (let i = 0; i < length; i += 10) {
          labels[i].insert('beforeend', ' !!!')
        }
      },
    })
  }
}
customElements.define(BenchMark.tag, BenchMark)
