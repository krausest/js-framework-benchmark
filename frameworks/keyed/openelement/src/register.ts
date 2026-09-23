/**
 * Browser entry: registers the compiled element.
 *
 * The compiler lowers the class to a Part Program but deliberately emits no
 * registration call, so the definition is explicit here — the same shape the
 * repository's own packaged-consumer proof uses
 * (tools/release/consumer-packaged-element.ts). This module carries no
 * @element decorator, so it is an ordinary module rather than compiled output.
 */
import { OpenElementTable } from './main.tsx';

customElements.define('openelement-table', OpenElementTable);
