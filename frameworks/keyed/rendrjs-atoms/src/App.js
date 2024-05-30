import { component, element } from '@rendrjs/core';
import { Jumbotron } from './Jumbotron';
import { makeIcon } from './RemoveIcon';
import { Table } from './Table';

export let App = () => element('div', {
  class: 'container',
  slot: [component(Jumbotron), component(Table), makeIcon(true)],
});
