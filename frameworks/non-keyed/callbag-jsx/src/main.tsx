const subject = require('callbag-behavior-subject').default;

import { Callbag } from 'callbag';
import pipe from 'callbag-pipe';
import take from 'callbag-take';
import map from 'callbag-map';
import combine from 'callbag-combine';
import subscribe from 'callbag-subscribe';
import { makeRenderer, For, Conditional } from 'callbag-jsx';

import { buildData, Data } from './util';

const renderer = makeRenderer();
const data: Callbag<Data[], Data[]> = subject([]);
const selected: Callbag<number, number> = subject(-1);


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
            <Button id='run' onclick={() => { data(1, buildData(1000)); selected(1, -1);}}>
              Create 1,000 rows
            </Button>
            <Button id='runlots' onclick={() => { data(1, buildData(10000)); selected(1, -1);}}>
              Create 10,000 rows
            </Button>
            <Button id='add' onclick={() => pipe(data, take(1), subscribe(l => data(1, l.concat(buildData(1000)))))}>
              Append 1,000 rows
            </Button>
            <Button id='update'onclick={() => pipe(data, take(1), subscribe(l => {
              for (let i = 0; i < l.length; i+=10) {
                l[i] = {
                  ...l[i],
                  label: l[i].label + ' !!!'
                };
              }

              data(1, l);
            }))}>
              Update every 10th row
            </Button>
            <Button id='clear' onclick={() => { data(1, []); selected(1, -1); }}>
              Clear
            </Button>
            <Button id='swaprows' onclick={() => pipe(data, take(1), subscribe(l => {
              if (l.length > 998) {
                const tmp = l[1];
                l[1] = l[998];
                l[998] = tmp;
                data(1, l);
              }
            }))}>
              Swap Rows
            </Button>
          </div>
        </div>
      </div>
    </div>

    <table class='table table-hover table-striped test-data'>
      <Conditional if={pipe(data, map(l => l.length > 0))}
        then={() => <tbody>
          <For of={data} each={item =>
            <tr class={{ danger: pipe(combine(selected, item), map(([s, i]) => s === i.id)) }}>
              <td class='col-md-1'>{pipe(item, map(i => i?.id))}</td>
              <td class='col-md-4'>
                <a onclick={() => selected(1, item.get()!!.id)}>{pipe(item, map(i => i?.label))}</a>
              </td>
              <td class='col-md-1'>
                <a onclick={() => pipe(data, take(1), subscribe(l => {
                  const i = l.indexOf(item.get()!!);
                  l.splice(i, 1);
                  data(1, l);
                }))}>
                  <span class='glyphicon glyphicon-remove' aria-hidden='true'/>
                </a>
              </td>
              <td class='col-md-6'/>
            </tr>
          }/>
        </tbody>
        }
      />
    </table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden='true'></span>
  </div>
).on(document.body);