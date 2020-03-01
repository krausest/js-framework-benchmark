import Gruu from 'gruujs'
import { Store } from './Store.es6'

const mainStore = new Store()

const store = (
  <$
    state={{
      data: mainStore.data,
      selected: mainStore.selected
    }}
  />
)

const exec = (name) => (...v) => {
  mainStore[name](...v)
  store.state.data = mainStore.data
}

const select = (id) => {
  mainStore.select(id)
  store.state.selected = mainStore.selected
}

const table = (
  <table className="table table-hover table-striped test-data">
    <tbody id="tbody">
      {() => store.state.data.map(d => {
        const selectedId = store.state.selected === d.id
        return (
          <tr
            _key={d.id}
            _createdBy={[d, selectedId]}
            className={selectedId ? 'danger' : ''}
          >
            <td _createdBy={[d.id]} className="col-md-1" textContent={d.id}></td>
            <td _createdBy={[d]} className="col-md-4">
              <a onclick={() => select(d.id)} textContent={d.label}></a>
            </td>
            <td _createdBy={[d.id]} className="col-md-1">
              <a onclick={() => exec('delete')(d.id)}>
                <span className="glyphicon glyphicon-remove" ariaHidden="true"></span>
              </a>
            </td>
            <td className="col-md-6"></td>
          </tr>
        )
      })}
    </tbody>
  </table>
)

const app = (
  <div className="container">
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>Gruu v1.7.5</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-sm-6 smallpad">
              <button type='button' className='btn btn-primary btn-block' id='run' onclick={exec('run')} textContent="Create 1,000 rows">
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type='button' className='btn btn-primary btn-block' id='runlots' onclick={exec('runLots')} textContent="Create 10,000 rows">
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type='button' className='btn btn-primary btn-block' id='add' onclick={exec('add')} textContent="Append 1,000 rows">
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type='button' className='btn btn-primary btn-block' id='update' onclick={exec('update')} textContent="Update every 10th row">
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type='button' className='btn btn-primary btn-block' id='clear' onclick={exec('clear')} textContent="Clear">
              </button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type='button' className='btn btn-primary btn-block' id='swaprows' onclick={exec('swapRows')} textContent="Swap Rows">
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {table}
    <span className="preloadicon glyphicon glyphicon-remove" ariaHidden="true"></span>
  </div>
)

const container = document.querySelector('#main')
Gruu.renderApp(container, [app])
