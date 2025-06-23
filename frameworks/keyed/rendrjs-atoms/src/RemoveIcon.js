import { element } from '@rendrjs/core';

export let makeIcon = preload => element('span', {
    class: (preload ? 'preloadicon ' : '') + 'glyphicon glyphicon-remove',
    'aria-hidden': true,
});
