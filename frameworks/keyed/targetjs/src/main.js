import { App, TModel, $Dom, Template } from "targetj";
import { buildData } from './data';

App(new TModel("benchmark", {
    canHaveDom: false,
    runButton() {        
        return new TModel('run', { 
            onClick() {                
                const rows = this.getParentValue('rows');
                rows.removeAll().activateTarget('buildData', 1000);
            }
        });
    },    
    runAlotButton() {
        return new TModel('runlots', {
            onClick() {                
                const rows = this.getParentValue('rows');
                rows.removeAll().activateTarget('buildData', 10000);
            }
        });
    },
    addButton() {
        return new TModel('add', {
            onClick() {                
                const rows = this.getParentValue('rows');
                rows.activateTarget('buildData', 1000);            
            }
        });
    },
    updateButton() {
        return new TModel('update', {
            onClick() {
                const rows = this.getParentValue('rows');
                rows.activateTarget('selectEvery10thLink');
            }
        });
    },
    clearButton() {
        return new TModel('clear', {
            onClick() {                
                 this.getParentValue('rows').removeAll();            
            }
        });
    },
    swapRows() {
        return new TModel('swaprows', {
            onClick() {
                const rows = this.getParentValue('rows');
                const elementCount = rows.$dom.elementCount();
                if (elementCount > 998) {
                    rows.activateTarget('swap', [1, 998]);
                }
            }
        });        
    },
    rows() {
        const rows = new TModel('rows', {
            rowTemplate: $Dom.createTemplate(`
                <tr>
                    <td class="col-md-1 id-cell"></td>
                    <td class="col-md-4 label-cell"><a></a></td>
                    <td class="col-md-1 remove-cell"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                    <td class="col-md-6"></td>
                </tr>`),
            _buildData() {
                return buildData(this._buildData);                
            },
            _createRows$() {
                this.prevTargetValue.forEach((data, index) => {
                    const $tr = this.val('rowTemplate').cloneTemplate();
                    $tr.attr('data-id', `${index}`);
                    $tr.query('.id-cell').textContent = data.id;
                    $tr.query('.label-cell a').textContent = data.label;
                    this.$dom.append$Dom($tr);
                });
            },
            _selectEvery10thLink() {
                if (!this.isPrevTargetUpdated()) {
                    return (this.val(this.key) || []);
                }
                const $rows = this.$dom.queryAll('tr');
                const links = [];
                for (let i = 0; i < $rows.length; i += 10) {
                    links.push($rows[i].querySelector('.label-cell a'));
                }
                return links;
            },
            _updateLinks$() {
                this.prevTargetValue.forEach(link => link.textContent += ' !!!');              
            },
            _swap() {
                const rowElements = this._swap.map(id => this.$dom.query(`[data-id="${id}"]`));
                this.$dom.swapElements(...rowElements);
            },
            onClick(target) {
                const rowElement = target.closest('tr');
                if (!rowElement) return;
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