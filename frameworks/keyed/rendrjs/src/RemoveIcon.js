import { span } from '@rendrjs/core';

export let makeIcon = preload => span({
    class: `${preload ? 'preloadicon ' : ''}glyphicon glyphicon-remove`,
    ariaHidden: true,
});
