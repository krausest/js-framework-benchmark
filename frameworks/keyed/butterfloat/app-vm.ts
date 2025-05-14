import { butterfly, StateSetter } from 'butterfloat'
import { filter, map, mergeMap, Observable, range } from 'rxjs'
import { RowViewModel } from './row-vm.js'

export interface IdRange {
  min: number
  max: number
  added: [start: number, count: number]
}

export class AppViewModel {
  readonly #idRange: Observable<IdRange>
  readonly #setIdRange: (idRange: StateSetter<IdRange>) => void
  get idRange() {
    return this.#idRange
  }

  readonly #selectedId: Observable<number>
  readonly #setSelectedId: (id: StateSetter<number>) => void
  get selectedId() {
    return this.#selectedId
  }

  readonly #rows: Observable<RowViewModel>
  get rows() {
    return this.#rows
  }

  constructor() {
    ;[this.#idRange, this.#setIdRange] = butterfly<IdRange>({
      min: 0,
      max: 0,
      added: [-1, -1],
    })
    ;[this.#selectedId, this.#setSelectedId] = butterfly<number>(-1)

    this.#rows = this.#idRange.pipe(
      filter((idRange) => idRange.added[0] > 0 && idRange.added[1] > 0),
      mergeMap((idRange) => range(idRange.added[0], idRange.added[1])),
      map((id) => new RowViewModel(this, id)),
    )
  }

  clear() {
    this.#setIdRange((current) => ({
      min: current.max,
      max: current.max,
      added: [-1, -1],
    }))
  }

  selectRow(id: number) {
    this.#setSelectedId(id)
  }

  createRows(count: number) {
    this.#setIdRange((current) => {
      const min = current.max
      const max = current.max + count
      return { min, max, added: [current.max, count] }
    })
  }

  appendRows(count: number) {
    this.#setIdRange((current) => {
      const min = current.min
      const max = current.max + count
      return { min, max, added: [current.max, count] }
    })
  }
}
