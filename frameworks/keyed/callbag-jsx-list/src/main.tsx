import expr from 'callbag-expr';
import state from 'callbag-state';
import { makeRenderer, List, Conditional } from 'callbag-jsx';

import { buildData, Data } from './util';

const renderer = makeRenderer();
const data = state<Data[]>([]);
const selected = state(-1);

const Button = (props: any, _: any, content: any) => <div class='col-sm-6 smallpad'>
  <button type='button' class='btn btn-primary btn-block' {...props}>{content}</button>
</div>;

renderer.render(
  <div class='container'>
    <div class='jumbotron'>
      <div class='row'>
        <div class='col-md-6'>
          <h1>Callbag JSX (keyed, using List)</h1>
        </div>
        <div class='col-md-6'>
          <div class='row'>
            <Button id='run' onclick={() => { data.set(buildData(1000)); selected.set(-1);}}>
              Create 1,000 rows
            </Button>
            <Button id='runlots' onclick={() => { data.set(buildData(10000)); selected.set(-1);}}>
              Create 10,000 rows
            </Button>
            <Button id='add' onclick={() => data.set(data.get().concat(buildData(1000)))}>
              Append 1,000 rows
            </Button>
            <Button id='update'onclick={() => {
              let l = data.get();
              for (let i = 0; i < l.length; i+=10) {
                l[i] = {
                  ...l[i],
                  label: l[i].label + ' !!!'
                };
              }

              data.set(l);
            }}>
              Update every 10th row
            </Button>
            <Button id='clear' onclick={() => { data.set([]); selected.set(-1); }}>
              Clear
            </Button>
            <Button id='swaprows' onclick={() => {
              const l = data.get();
              if (l.length > 998) {
                const tmp = l[1];
                l[1] = l[998];
                l[998] = tmp;
                data.set(l);
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
            <tr class={{ danger: expr(($, _) => _(item)?.id === $(selected))}}>
              <td class='col-md-1'>{item.sub('id')}</td>
              <td class='col-md-4'>
                <a onclick={() => selected.set(item.get()!!.id)}>{item.sub('label')}</a>
              </td>
              <td class='col-md-1'>
                <a onclick={() => {
                  const l = data.get();
                  const i = l.indexOf(item.get()!!);
                  l.splice(i, 1);
                  data.set(l);
                }}>
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