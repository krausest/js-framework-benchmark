import { App, TModel, $Dom, Template } from "targetj";
import { buildData } from './data';

App(new TModel("benchmark", {
    canHaveDom: false,
    runButton() {        
        return new TModel('run', {            
            onClick() {                
                const rows = this.getParent().findChild('rows');
                rows.removeAll();
                rows.activateTarget('buildData', 1000);                
                rows.activateTarget('createRows');
            }
        });
    },    
    runAlotButton() {
        return new TModel('runlots', {
            onClick() {                
                const rows = this.getParent().findChild('rows');
                rows.removeAll();
                rows.activateTarget('buildData', 10000);                
                rows.activateTarget('createRows');
            }
        });
    },
    addButton() {
        return new TModel('add', {
            onClick() {                
                const rows = this.getParent().findChild('rows');
                rows.activateTarget('buildData', 1000);                                
                rows.activateTarget('createRows');            
            }
        });
    },
    updateButton() {
        return new TModel('update', {
            onClick() {
                const rows = this.getParent().findChild('rows');
                rows.activateTarget('updateEvery10thRow');
            }
        });
    },
    clearButton() {
        return new TModel('clear', {
            onClick() {                
                 this.getParent().findChild('rows').removeAll();            
            }
        });
    },
    swapRows() {
        return new TModel('swaprows', {
            onClick() {
                const rows = this.getParent().findChild('rows');
                const rowCount = rows.$dom.elementCount();
                if (rowCount > 998) {
                    rows.activateTarget('swap', [1, 998]);
                }
            }
        });        
    },
    rows() {
        const rows = new TModel('rows', {
            isVisible: true, 
            domHolder: true,
            rowTemplate() {
                const template = document.createElement('template');
                template.innerHTML = `
                    <tr>
                        <td class="col-md-1 id-cell"></td>
                        <td class="col-md-4 label-cell"><a></a></td>
                        <td class="col-md-1 remove-cell"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                        <td class="col-md-6"></td>
                    </tr>
                `;
                return template;
            },
            _buildData() {
                return buildData(this._buildData);                
            },
            _createRows() {
                const fragment = document.createDocumentFragment();
                this.val('buildData').forEach((data, index) => {
                    const rowClone = this.val('rowTemplate').content.cloneNode(true);
                    rowClone.querySelector('tr').setAttribute('data-id', `${index}`);
                    rowClone.querySelector('.id-cell').textContent = data.id;
                    rowClone.querySelector('.label-cell a').textContent = data.label;

                    fragment.appendChild(rowClone);
                });
                this.$dom.appendElement(fragment);
            },
            _updateEvery10thRow() {
                const rows = this.$dom.querySelectorAll('tr');

                for (let i = 0; i < rows.length; i += 10) {
                    const labelCell = rows[i].querySelector('.label-cell a');
                    if (labelCell) {
                        labelCell.textContent += ' !!!';
                    }
                }                
            },
            _swap() {
                const row1 = this.$dom.querySelector(`[data-id="${this._swap[0]}"]`);
                const row2 = this.$dom.querySelector(`[data-id="${this._swap[1]}"]`);
                this.$dom.swapElements(row1, row2);
            },
            onClick(target) {
                const rowElement = target.closest('tr');
                if (target?.className?.endsWith('remove')) {
                    this.$dom.removeElement(rowElement); 
                } else {
                    this.val('selectedRow', rowElement);
                    this.val('selectedRow').setAttribute('class', 'danger');
                    this.lastVal('selectedRow')?.setAttribute('class', '');
                }
            }
        });  
        return rows;
    },
    children() {
        return [ this.val('runButton'),
            this.val('runAlotButton'),
            this.val('addButton'),
            this.val('updateButton'),
            this.val('clearButton'),
            this.val('swapRows'),
            this.val('rows')
        ];
    }
}));