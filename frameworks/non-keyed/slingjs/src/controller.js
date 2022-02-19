import { markup, textNode, detectChanges, renderElement, wrapWithChangeDetector } from '../node_modules/slingjs/sling.min.es5';
var { Store } = require('./store.es6');

export class ControllerComponent {
    constructor() {
        this.data = function () { return Store.data; };
        this.selected = function () { return Store.selected; };
        this.run = function () {
            Store.run();
            detectChanges();
        };
        this.add = function () {
            Store.add();
            detectChanges();
        };
        this.update = function () {
            Store.update();
            detectChanges();
        };
        this.select = function (id) {
            Store.select(id);
            detectChanges();
        };
        this.delete = function (id) {
            Store.remove(id);
            detectChanges();
        };
        this.runLots = function () {
            Store.runLots();
            detectChanges();
        };
        this.clear = function () {
            Store.clear();
            detectChanges();
        };
        this.swapRows = function () {
            Store.swapRows();
            detectChanges();
        };
    }

    updateTableRow(context, d) {
        if (this.$label.childNodes[0].data !== d.label) {
            this.$label.removeChild(this.$label.childNodes[0]);
            this.$label.append(d.label);
        }
        
        this.children[2].children[0].onclick = wrapWithChangeDetector(context.delete.bind(this, d.id));

        const idStr = String(d.id);

        if (this.$id.childNodes[0].data !== idStr) {
            this.$id.removeChild(this.$id.childNodes[0]);
            this.$id.append(d.id);
        }

        const className = (d.id === context.selected()) ? 'danger' : '';

        if (this.className !== className) {
            this.className = className;
        }
    }

    makeTableRow(d) {
        const rootNode = renderElement(markup('tr', {
            attrs: {
                ...d.id === this.selected() && { class: 'danger' },
                onclick: this.select.bind(this, d.id),
                onremove: this.delete.bind(this, d.id)
            },
            children: [
                markup('td', {
                    attrs: {
                        'class': 'col-md-1'
                    },
                    children: [
                        textNode(d.id)
                    ]
                }),
                markup('td', {
                    attrs: {
                        'class': 'col-md-4',
                    },
                    children: [
                        markup('a', {
                            attrs: {
                                'href': '#',
                                onclick: this.select.bind(this, d.id)
                            }, 
                            children: [
                                textNode(d.label)
                            ]
                        })
                    ]
                }),
                markup('td', {
                    attrs: {
                        'class': 'col-md-1',
                    },
                    children: [
                        markup('a', {
                            attrs: {
                                'href': '#',
                                onclick: this.delete.bind(this, d.id)
                            },
                            children: [
                                markup('span', {
                                    attrs: {
                                        'class': 'glyphicon glyphicon-remove',
                                        'aria-hidden': 'true'
                                    }
                                })
                            ]
                        })
                    ]
                }),
                markup('td', {
                    attrs: {
                        'class': 'col-md-6'
                    }
                })
            ]
        }));

        rootNode.$label = rootNode.children[1].children[0];
        rootNode.$id = rootNode.children[0];

        return rootNode;
    }

    view() {
        return markup('div', {
            attrs: {
                'class': 'container',
                'id': 'main'
            },
            children: [
                markup('div', {
                    attrs: {
                        'class': 'jumbotron'
                    },
                    children: [
                        markup('div', {
                            attrs: {
                                'class': 'row'
                            },
                            children: [
                                markup('div', {
                                    attrs: {
                                        'class': 'col-md-6'
                                    },
                                    children: [
                                        markup('h1', {
                                            children: [
                                                textNode('Sling.js 14.0.0')
                                            ]
                                        })
                                    ]
                                }),
                                markup('div', {
                                    attrs: {
                                        'class': 'col-md-6'
                                    },
                                    children: [
                                        markup('div', {
                                            attrs: {
                                                'class': 'col-sm-6 smallpad'
                                            },
                                            children: [
                                                markup('button', {
                                                    attrs: {
                                                        'type': 'button',
                                                        'class': 'btn btn-primary btn-block',
                                                        'id': 'run',
                                                        onclick: this.run.bind(this)
                                                    },
                                                    children: [
                                                        textNode('Create 1,000 rows')
                                                    ]
                                                }),

                                            ]
                                        }),
                                        markup('div', {
                                            attrs: {
                                                'class': 'col-sm-6 smallpad'
                                            },
                                            children: [
                                                markup('button', {
                                                    attrs: {
                                                        'type': 'button',
                                                        'class': 'btn btn-primary btn-block',
                                                        'id': 'runlots',
                                                        onclick: this.runLots.bind(this)
                                                    },
                                                    children: [
                                                        textNode('Create 10,000 rows')
                                                    ]
                                                })
                                            ]
                                        }),
                                        markup('div', {
                                            attrs: {
                                                'class': 'col-sm-6 smallpad'
                                            },
                                            children: [
                                                markup('button', {
                                                    attrs: {
                                                        'type': 'button',
                                                        'class': 'btn btn-primary btn-block',
                                                        'id': 'add',
                                                        onclick: this.add.bind(this)
                                                    },
                                                    children: [
                                                        textNode('Append 1,000 rows')
                                                    ]
                                                }),
                                            ]
                                        }),
                                        markup('div', {
                                            attrs: {
                                                'class': 'col-sm-6 smallpad'
                                            },
                                            children: [
                                                markup('button', {
                                                    attrs: {
                                                        'type': 'button',
                                                        'class': 'btn btn-primary btn-block',
                                                        'id': 'update',
                                                        onclick: this.update.bind(this)
                                                    },
                                                    children: [
                                                        textNode('Update every 10th row')
                                                    ]
                                                }),
                                            ]
                                        }),
                                        markup('div', {
                                            attrs: {
                                                'class': 'col-sm-6 smallpad'
                                            },
                                            children: [
                                                markup('button', {
                                                    attrs: {
                                                        'type': 'button',
                                                        'class': 'btn btn-primary btn-block',
                                                        'id': 'clear',
                                                        onclick: this.clear.bind(this)
                                                    },
                                                    children: [
                                                        textNode('Clear')
                                                    ]
                                                }),
                                            ]
                                        }),
                                        markup('div', {
                                            attrs: {
                                                'class': 'col-sm-6 smallpad'
                                            },
                                            children: [
                                                markup('button', {
                                                    attrs: {
                                                        'type': 'button',
                                                        'class': 'btn btn-primary btn-block',
                                                        'id': 'swaprows',
                                                        onclick: this.swapRows.bind(this)
                                                    },
                                                    children: [
                                                        textNode('Swap Rows')
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                markup('table', {
                    attrs: {
                        'class': 'table table-hover table-striped test-data'
                    },
                    children: [
                        markup('tbody', {
                            attrs: {
                                'slfor': 'bodyfor:data:makeTableRow:updateTableRow'
                            }
                        })
                    ]
                }),
                markup('span', {
                    attrs: {
                        'class': 'preloadicon glyphicon glyphicon-remove',
                        'aria-hidden': 'true'
                    }
                })
            ]
        });
    }
}

export default ControllerComponent;
