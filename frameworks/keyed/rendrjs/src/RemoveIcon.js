import { rendr } from '@rendrjs/core';

export let RemoveIcon = ({ pre }) => rendr('span', {
    class: `${pre ? 'preloadicon ' : ''}glyphicon glyphicon-remove`,
    'aria-hidden': true,
});
