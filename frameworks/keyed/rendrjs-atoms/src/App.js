import { div, rendr } from '@rendrjs/core';
import { Jumbotron } from './Jumbotron';
import { makeIcon } from './RemoveIcon';
import { Table } from './Table';

export let preloadIcon = makeIcon(true);

export let App = () => {
  return div({
    class: 'container',
    slot: [
      rendr(Jumbotron),
      rendr(Table),
      preloadIcon,
    ],
  });
};
