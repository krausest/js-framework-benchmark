import { div } from '@rendrjs/core';
import { Jumbotron } from './Jumbotron';
import { makeIcon } from './RemoveIcon';
import { Table } from './Table';

export let App = () => div({
  class: 'container',
  slot: [Jumbotron, Table, makeIcon(true)],
});
