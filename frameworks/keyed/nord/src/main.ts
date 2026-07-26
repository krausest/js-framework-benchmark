import { derived, grain } from '@grainular/grains';
import { $each, html, mount } from '@grainular/nord';
import { Jumbotron } from './controls';
import { createItems, Item } from './data';
import { Row } from './row';

const selectedId = grain<number>(-1);
const data = grain<Item[]>([], () => false);

// -- Data Handling

const createRows = (amount = 1000) => data.set(createItems(amount));
const addRows = () => data.update((current) => current.concat(createItems(1000)));
const updateRows = () => {
    const rows = data();
    for (let i = 0; i < rows.length; i += 10) {
        rows[i].label.update((current) => current + ' !!!');
    }
};
const deleteRows = () => data.set([]);
const swapRows = () => {
    data.update((current) => {
        if (current.length > 998) {
            const temp = current[1];
            current[1] = current[998];
            current[998] = temp;
        }

        return current;
    });
};
const selectRow = (id: number) => selectedId.set(id);
const removeRow = (id: number) => {
    data.update((current) => current.filter((item) => item.id !== id));
};

const App = () => {
    return html`
        <div class="container">
            ${Jumbotron({ createRows, swapRows, deleteRows, updateRows, addRows })}
            <table class="table table-hover table-striped test-data">
                <tbody>
                    ${$each(data)
                        .$withKey((item) => item.id)
                        .$as((item) =>
                            Row({
                                item,
                                selected: derived(selectedId, (id) => id === item.id),
                                onSelect: () => selectRow(item.id),
                                onRemove: () => removeRow(item.id),
                            }),
                        )}
                </tbody>
            </table>
        </div>
    `;
};

mount(App, { to: document.querySelector('#app') });
