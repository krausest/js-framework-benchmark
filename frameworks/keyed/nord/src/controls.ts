import { html, on } from '@grainular/nord';

type ButtonProps = { id: string; action: () => void; label: string };
const Button = ({ id, action, label }: ButtonProps) => {
    return html`<div class="col-sm-6 smallpad">
        <button id="${id}" type="button" class="btn btn-primary btn-block" ${on('click', action)}>${label}</button>
    </div>`;
};

export type JumbotronProps = {
    createRows: (amount?: number) => void;
    addRows: () => void;
    updateRows: () => void;
    deleteRows: () => void;
    swapRows: () => void;
};
export const Jumbotron = ({ createRows, addRows, updateRows, deleteRows, swapRows }: JumbotronProps) => {
    return html`<div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>@grainular/nord keyed</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    ${Button({
                        id: 'run',
                        label: 'Create 1,000 Rows',
                        action: () => createRows(),
                    })}
                    ${Button({
                        id: 'runlots',
                        label: 'Create 10,000 rows',
                        action: () => createRows(10000),
                    })}
                    ${Button({
                        id: 'add',
                        label: 'Append 1,000 rows',
                        action: () => addRows(),
                    })}
                    ${Button({
                        id: 'update',
                        label: 'Update every 10th row',
                        action: () => updateRows(),
                    })}
                    ${Button({
                        id: 'clear',
                        label: 'Clear',
                        action: () => deleteRows(),
                    })}
                    ${Button({
                        id: 'swaprows',
                        label: 'Swap Rows',
                        action: () => swapRows(),
                    })}
                </div>
            </div>
        </div>
    </div>`;
};
