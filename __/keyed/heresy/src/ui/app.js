import {html} from 'heresy';

import Button from './button.js';
import Row from './row.js';

export default {
  extends: 'div',
  includes: {Button, Row},
  mappedAttributes: ['state'],
  oninit() {
    this.classList.add('container');
  },
  onstate() {
    this.render();
  },
  onclick({target}) {
    const a = target.closest('a');
    const {action} = a.dataset;
    this.state[action](+a.closest('tr').id);
  },
  render() {
    const {
      data, selected,
      run, runLots, add, update, clear, swapRows
    } = this.state;
    this.html`
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>heresy keyed</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <Button .id=${'run'} .cb=${run} .text=${'Create 1,000 rows'} />
            <Button .id=${'runlots'} .cb=${runLots} .text=${'Create 10,000 rows'} />
            <Button .id=${'add'} .cb=${add} .text=${'Append 1,000 rows'} />
            <Button .id=${'update'} .cb=${update} .text=${'Update every 10th row'} />
            <Button .id=${'clear'} .cb=${clear} .text=${'Clear'} />
            <Button .id=${'swaprows'} .cb=${swapRows} .text=${'Swap Rows'} />
          </div>
        </div>
      </div>
    </div>
    <table onclick=${this} class="table table-hover table-striped test-data">
      <tbody>
      ${data.map(({id, label}) => html.for(data, id)`
        <Row id=${id} class=${id === selected ? 'danger' : ''} label=${label} />
      `)}
      </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />`;
  }
};
