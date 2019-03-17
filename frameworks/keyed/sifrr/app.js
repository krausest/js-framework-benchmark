import SifrrDOM from '@sifrr/dom'
import SifrrFetch from '@sifrr/fetch'

window.Sifrr = { Dom: SifrrDOM, Fetch: SifrrFetch };

Sifrr.Dom.setup({ baseUrl: '/frameworks/non-keyed/sifrr/' });
Sifrr.Dom.Event.add('click');
