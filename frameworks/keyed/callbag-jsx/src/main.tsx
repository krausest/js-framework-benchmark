import state from 'callbag-state';
import expr from 'callbag-expr';
import { makeRenderer, List, Conditional } from 'callbag-jsx';
import { buildData } from './util';

const renderer = makeRenderer();
const data = state<{id: number, label: string, selected: boolean}[]>([]);
let selected: any = undefined;

const Button = (props: any, _: any, content: any) => <div class='col-sm-6 smallpad'>
  <button type='button' class='btn btn-primary btn-block' {...props}>{content}</button>
</div>;

renderer.render(
  <div class='container'>
    <div class='jumbotron'>
      <div class='row'>
        <div class='col-md-6'>
          <h1>Callbag JSX</h1>
        </div>
        <div class='col-md-6'>
          <div class='row'>
            <Button id='run' onclick={() => { data.set(buildData(1000)); selected = undefined;}}>
              Create 1,000 rows
            </Button>
            <Button id='runlots' onclick={() => { data.set(buildData(10000)); selected = undefined;}}>
              Create 10,000 rows
            </Button>
            <Button id='add' onclick={() => data.set(data.get().concat(buildData(1000)))}>
              Append 1,000 rows
            </Button>
            <Button id='update'onclick={() => {
              data.set(data.get().map((row, i) =>
                i % 10 === 0
                ? { id: row.id, selected: row.selected, label: row.label + ' !!!' }
                : row));
            }}>
              Update every 10th row
            </Button>
            <Button id='clear' onclick={() => { data.set([]); selected = undefined; }}>
              Clear
            </Button>
            <Button id='swaprows' onclick={() => {
              const l = data.get();
              if (l.length > 998) {
                data.set(l.map((row, i) => i === 1 ? l[998] : i === 998 ? l[1] : row));
              }
            }}>
              Swap Rows
            </Button>
          </div>
        </div>
      </div>
    </div>

    <table class='table table-hover table-striped test-data'>
      <Conditional if={expr($ => $(data)!!.length > 0)}
        then={() => <tbody>
          <List of={data} each={item =>
            <tr class={{ danger: item.sub('selected')}}>
              <td class='col-md-1'>{item.sub('id')}</td>
              <td class='col-md-4'>
                <a onclick={() => {
                  if (selected) {
                    selected.sub('selected').set(false);
                  }
  
                  selected = item;
                  selected.sub('selected').set(true);
                }}>{item.sub('label')}</a>
              </td>
              <td class='col-md-1'>
                <a onclick={() => data.set(data.get()!!.filter(_ => _.id !== item.get()?.id))}>
                  <span class='glyphicon glyphicon-remove' aria-hidden='true'/>
                </a>
              </td>
              <td class='col-md-6'/>
            </tr>
          } key={i => i.id}/>
        </tbody>
        }
      />
    </table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden='true'></span>
  </div>
).on(document.body);
