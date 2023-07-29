import { elementOpen, elementClose, close, text, open, attr, applyAttrs, applyStatics } from 'incremental-dom';
import { DataEntry } from '../data-collection';


export function Table(func: () => void) {
    elementOpen('table', null, null, 'class', 'table table-hover table-striped test-data');
    elementOpen('tbody', null, null, 'id', 'tbody');
    func();
    elementClose('tbody');
    elementClose('table');
}

function TableCell(className: string, func: () => void) {
    elementOpen('td', null, null, 'class', className);
    func();
    close();
}

export function TableRow(data: DataEntry, selected: boolean, onRowClick: () => void, onRowDelete: () => void) {
    const row = open('tr', data.id);
    attr('class', selected ? 'danger' : '');
    applyAttrs();
    row.onclick = onRowClick;

    TableCell('col-md-1', () => text(data.id.toString()));
    TableCell('col-md-4', () => {
        elementOpen('a');
        text(data.label);
        close();
    });
    TableCell('col-md-1', () => {
        const deleteEl = elementOpen('a');
        deleteEl.onclick = onRowDelete;
        elementOpen('span', null, null, 'class', 'glyphicon glyphicon-remove', 'aria-hidden', 'true');
        close();
        close();
    });
    TableCell('col-md-6', () => { });
    close();
}