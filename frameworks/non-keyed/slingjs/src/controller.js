import { markup, textNode, detectChanges, wrapWithChangeDetector, renderElementWithoutClass } from '../node_modules/slingjs/sling.min.es5';
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
        const rootNode = renderElementWithoutClass('tr', {
                ...d.id === this.selected() && { class: 'danger' },
                onclick: this.select.bind(this, d.id),
            }, [
                renderElementWithoutClass('td', {
                        'class': 'col-md-1'
                    }, [
                        d.id
                    ]
                ),
                renderElementWithoutClass('td', {
                        'class': 'col-md-4',
                    }, [
                        renderElementWithoutClass('a', {
                                'href': '#'
                            }, [
                                d.label
                            ]
                        )
                    ]
                ),
                renderElementWithoutClass('td', {
                        'class': 'col-md-1',
                    }, [
                        renderElementWithoutClass('a', {
                                'href': '#',
                                onclick: this.delete.bind(this, d.id)
                            }, [
                                renderElementWithoutClass('span', {
                                        'class': 'glyphicon glyphicon-remove',
                                        'aria-hidden': 'true'
                                    }, [
                                    ]
                                )
                            ]
                        )
                    ]
                ),
                renderElementWithoutClass('td', {
                        'class': 'col-md-6'
                    }, [
                    ]
                )
            ]
        );

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
                        'class': 'jumbotron',
                        'sldirective': 'useexisting'
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
                                                textNode('Sling.js 17.7.1')
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
