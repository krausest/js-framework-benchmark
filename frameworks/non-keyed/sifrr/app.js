import SifrrDOM from '@sifrr/dom'
import SifrrFetch from '@sifrr/fetch'

window.Sifrr = { Dom: SifrrDOM, Fetch: SifrrFetch };
var useSifrrInArray = window.location.href.indexOf('useSifrr') >= 0;
Sifrr.Dom.setup({ baseUrl: '/frameworks/non-keyed/sifrr/' });
Sifrr.Dom.Event.add('click');
Sifrr.Dom.load('main-element');
