import { rendr } from '@rendrjs/core';

export let makeIcon = preload => rendr('span', {
    class: `${preload ? 'preloadicon ' : ''}glyphicon glyphicon-remove`,
    ariaHidden: true,
});
