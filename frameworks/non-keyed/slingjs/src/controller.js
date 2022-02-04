'use strict';

import { markup, textNode } from '../node_modules/slingjs/sling.min.es5';
var { Store } = require('./store');

export class Row {
    constructor(id, classList, label, onclick, ondelete) {
        this.id = id;
        this.classList = classList;
        this.label = label;
        this.onclick = onclick;
        this.ondelete = ondelete;

    
    }

    slOnInit() {
        this.click = function () {
            const id = this.id;
            this.onclick(id);
        };
        this.delete = function () {
            const id = this.id;
            this.ondelete(id);
        };
    }

    view() {
        return markup('tr', {
            attrs: {
                'class': this.classList,
                onclick: this.click.bind(this),
                onremove: this.delete.bind(this)
            },
            children: [
                markup('td', {
                    attrs: {
                        'class': 'col-md-1'
                    },
                    children: [
                        textNode(this.id)
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
                                onclick: this.click.bind(this)
                            }, 
                            children: [
                                textNode(this.label)
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
                                onclick: this.delete.bind(this)
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
        });
    }
}

export class ControllerComponent {
    constructor() {

    }

    slOnInit() {
        this.data = function () { return Store.data; };
        this.selected = function () { return Store.selected; };
        this.run = function () {
            Store.run();
        };
        this.add = function () {
            Store.add();
        };
        this.update = function () {
            Store.update();
        };
        this.select = function (id) {
            Store.select(id);
        };
        this.delete = function (id) {
            Store.remove(id);
        };
        this.runLots = function () {
            Store.runLots();
        };
        this.clear = function () {
            Store.clear();
        };
        this.swapRows = function () {
            Store.swapRows();
        };
    }

    view() {
        var ret = markup('div', {
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
                                                textNode('Sling.js 13.3.0')
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
                            children: [
                                ...Array.from(this.data(), (d, i) => {
                                    let sel = d.id === this.selected() ? 'danger' : '';
                                    return new Row(d.id, sel, d.label, this.select, this.delete)
                                })
                            ]
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

        return ret;
    }
}

export default ControllerComponent;