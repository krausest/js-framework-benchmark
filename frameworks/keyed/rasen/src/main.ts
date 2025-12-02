/**
 * Rasen implementation for js-framework-benchmark
 * 
 * Uses Rasen's high-performance each() component with:
 * - LIS-based DOM diffing
 * - DOM node reuse and movement (no rebuild on swap)
 * - Fine-grained updates
 */

import { setReactiveRuntime } from '@rasenjs/core'
import { each } from '@rasenjs/dom'
import { ref, shallowRef, watch, effectScope } from 'vue'

// ============================================================================
// Setup Vue Reactive Runtime for Rasen
// ============================================================================

setReactiveRuntime({
  ref,
  watch: (source: any, callback: any, options?: any) => {
    return watch(source, callback, options)
  },
  effectScope: () => {
    const scope = effectScope()
    return {
      run: <T>(fn: () => T) => scope.run(fn),
      stop: () => scope.stop()
    }
  }
})

// ============================================================================
// Data Generation
// ============================================================================

const adjectives = [
  'pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome',
  'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful',
  'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive',
  'cheap', 'expensive', 'fancy'
]

const colours = [
  'red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown',
  'white', 'black', 'orange'
]

const nouns = [
  'table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie',
  'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'
]

function random(max: number): number {
  return Math.round(Math.random() * 1000) % max
}

let nextId = 1

interface RowData {
  id: number
  label: string
}

function buildData(count: number): RowData[] {
  const data: RowData[] = []
  for (let i = 0; i < count; i++) {
    data.push({
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`
    })
  }
  return data
}

// ============================================================================
// State
// ============================================================================

const data = shallowRef<RowData[]>([])
const selected = ref<number>(0)

// Row DOM cache for selection updates
const rowMap = new Map<number, HTMLTableRowElement>()

// ============================================================================
// Row Component
// ============================================================================

function Row(item: RowData, _index: number) {
  return (host: HTMLElement) => {
    const row = document.createElement('tr')
    row.setAttribute('data-id', String(item.id))
    
    // Cache for selection updates
    rowMap.set(item.id, row)
    
    const td1 = document.createElement('td')
    td1.className = 'col-md-1'
    td1.textContent = String(item.id)
    
    const td2 = document.createElement('td')
    td2.className = 'col-md-4'
    const a = document.createElement('a')
    a.className = 'lbl'
    a.textContent = item.label
    td2.appendChild(a)
    
    const td3 = document.createElement('td')
    td3.className = 'col-md-1'
    const aDelete = document.createElement('a')
    aDelete.className = 'remove'
    const span = document.createElement('span')
    span.className = 'remove glyphicon glyphicon-remove'
    span.setAttribute('aria-hidden', 'true')
    aDelete.appendChild(span)
    td3.appendChild(aDelete)
    
    const td4 = document.createElement('td')
    td4.className = 'col-md-6'
    
    row.appendChild(td1)
    row.appendChild(td2)
    row.appendChild(td3)
    row.appendChild(td4)
    
    // Check if initially selected
    if (selected.value === item.id) {
      row.className = 'danger'
    }
    
    host.appendChild(row)
    
    // 返回带 node 属性的 unmount 函数，让 each 可以获取节点引用
    const unmount = () => {
      rowMap.delete(item.id)
      row.remove()
    }
    ;(unmount as any).node = row
    return unmount
  }
}

// ============================================================================
// Event Delegation (for all rows)
// ============================================================================

const tbody = document.getElementById('tbody')!

tbody.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  
  // Check for delete button click
  if (target.matches('.remove, .remove *')) {
    e.preventDefault()
    const row = target.closest('tr')
    if (row) {
      const id = parseInt(row.getAttribute('data-id') || '0', 10)
      remove(id)
    }
    return
  }
  
  // Check for row label click (select)
  if (target.matches('.lbl')) {
    const row = target.closest('tr')
    if (row) {
      const id = parseInt(row.getAttribute('data-id') || '0', 10)
      select(id)
    }
  }
})

// ============================================================================
// Actions
// ============================================================================

function run() {
  data.value = buildData(1000)
  selected.value = 0
}

function runLots() {
  data.value = buildData(10000)
  selected.value = 0
}

function add() {
  data.value = [...data.value, ...buildData(1000)]
}

function update() {
  const d = data.value.slice()
  for (let i = 0; i < d.length; i += 10) {
    const item = d[i]
    d[i] = { ...item, label: item.label + ' !!!' }
  }
  data.value = d
}

function clear() {
  data.value = []
  selected.value = 0
}

function swapRows() {
  const d = data.value
  if (d.length > 998) {
    const newData = d.slice()
    const tmp = newData[1]
    newData[1] = newData[998]
    newData[998] = tmp
    data.value = newData
  }
}

function select(id: number) {
  selected.value = id
}

function remove(id: number) {
  data.value = data.value.filter((d: RowData) => d.id !== id)
}

// ============================================================================
// Bind Button Events
// ============================================================================

document.getElementById('run')!.onclick = run
document.getElementById('runlots')!.onclick = runLots
document.getElementById('add')!.onclick = add
document.getElementById('update')!.onclick = update
document.getElementById('clear')!.onclick = clear
document.getElementById('swaprows')!.onclick = swapRows

// ============================================================================
// Mount the List with Rasen's each()
// ============================================================================

const mountList = each(
  () => data.value,
  Row
)

// Mount to tbody
mountList(tbody)

// ============================================================================
// Selection Change Handler
// ============================================================================

watch(selected, (newSelected, oldSelected) => {
  if (oldSelected) {
    const oldRow = rowMap.get(oldSelected)
    if (oldRow) {
      oldRow.className = ''
    }
  }
  if (newSelected) {
    const newRow = rowMap.get(newSelected)
    if (newRow) {
      newRow.className = 'danger'
    }
  }
})
