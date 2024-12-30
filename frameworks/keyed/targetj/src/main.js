import { App, TModel, $Dom } from "targetj";
import { buildData } from './data';

App(new TModel("benchmark", {
    canHaveDom: false,
    runButton() {        
        return new TModel('run', {            
            onClickEvent() {                
                const rows = this.getParent().findChild('rows');
                rows.removeAll();
                rows.activateTarget('createRows', 1000);
            }
        });
    },    
    runAlotButton() {
        return new TModel('runlots', {
            onClickEvent() {                
                const rows = this.getParent().findChild('rows');
                rows.removeAll();
                rows.activateTarget('createRows', 10000);
            }
        });
    },
    addButton() {
        return new TModel('add', {
            onClickEvent() {                
                const rows = this.getParent().findChild('rows');
                rows.activateTarget('createRows', 1000);            
            }
        });
    },
    updateButton() {
        return new TModel('update', {
            onClickEvent() {
                const rows = this.getParent().findChild('rows');
                const length = rows.getChildren().length;
                for (let i = 0; i < length; i += 10) {
                    rows.getChild(i).activateTarget('updateContent');
                };
            }
        });
    },
    clearButton() {
        return new TModel('clear', {
            onClickEvent() {                
                 this.getParent().findChild('rows').removeAll();            
            }
        });
    },
    swapRows() {
        return new TModel('swaprows', {
            onClickEvent() {
                const rows = this.getParent().findChild('rows');
                const rowChildren = rows.allChildren;
                if (rowChildren.length > 998) {
                    rows.moveChild(rowChildren[1], 998);
                    rows.moveChild(rowChildren[998], 1);
                }
            }
        });        
    },
    rows() {
        const rows = new TModel('rows', {
            isVisible: true, 
            containerOverflowMode: 'always',
            rectTop() { return this.$dom.getBoundingClientRect().top; },            
            absY() { return this.val('rectTop') - $Dom.getWindowScrollTop(); },            
            domHolder: true,
            onDomEvent: [ 'rectTop', 'absY' ], 
            onWindowScrollEvent: 'absY',
            _createRows: {
                parallel: true,
                cycles: 4,
                value() {
                    buildData(this._createRows / 5).forEach(data => {
                        this.addChild(new TModel('row', {
                            keepEventDefault: true,
                            baseElement: 'tr',
                            defaultStyling: false,
                            excludeHeight: true,
                            height: 36,
                            canDeleteDom: false,
                            textOnly: false,
                            domHolder: true,
                            _css() { return this._css; },
                            onClickEvent(target) {
                                if (target?.className?.endsWith('remove')) {
                                    rows.removeChild(this); 
                                } else {
                                    rows.val('selectedRow')?.activateTarget('css', '');
                                    rows.val('selectedRow', this);
                                    this.activateTarget('css', 'danger');
                                }
                            },
                            _updateContent() {
                                this.$dom.child(1).children[0].textContent += ' !!!';
                            },
                            html: `<td class="col-md-1">${data.id}</td>
                                   <td class="col-md-4"><a>${data.label}</a></td>
                                   <td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                                   <td class="col-md-6"></td>`
                        }));
                    }); 
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