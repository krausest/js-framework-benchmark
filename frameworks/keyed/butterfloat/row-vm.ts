import { butterfly, StateSetter } from 'butterfloat'
import { filter, map, merge, NEVER, Observable, Subject, takeUntil } from 'rxjs'
import { randomLabel } from './data.js'
import { AppViewModel } from './app-vm.js'

export class RowViewModel {
  readonly #app: AppViewModel

  readonly #id: number
  get id() {
    return this.#id
  }

  readonly #label: Observable<string>
  readonly #setLabel: (label: StateSetter<string>) => void
  get label() {
    return this.#label
  }

  readonly #remove = new Subject<boolean>()

  readonly #alive: Observable<boolean>
  get alive() {
    return this.#alive
  }

  readonly #selected: Observable<boolean>
  get selected() {
    return this.#selected
  }

  constructor(app: AppViewModel, id: number) {
    this.#app = app
    this.#id = id
    ;[this.#label, this.#setLabel] = butterfly(randomLabel())

    this.#alive = NEVER.pipe(
      takeUntil(
        merge(
          this.#remove.pipe(filter(() => true)),
          this.#app.idRange.pipe(
            filter((range) => range.min > this.#id),
            map(() => true),
          ),
        ),
      ),
    )

    this.#selected = this.#app.selectedId.pipe(map((id) => id === this.#id))
  }

  updateLabel() {
    this.#setLabel((current) => current + '!!!')
  }

  remove() {
    this.#remove.next(true)
    this.#remove.complete()
  }

  select() {
    this.#app.selectRow(this.#id)
  }
}
