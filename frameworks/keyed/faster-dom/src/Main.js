import { Component, bootstrap, createComponent, fdFor, fdObject, fdValue } from 'faster-dom'

import { Store } from './Store';

function createTr(item, selectedId, onSelect, onRemove) {
    return createComponent(TrComponent, item, selectedId, onSelect, onRemove)
}

class TrComponent extends Component {
    constructor(item, selectedItem, onSelect, onRemove) {
        super();
        this.selectedItemObs = selectedItem;
        const selectedObs = fdValue(this.selectedItemObs.value === item ? true : false)

        this.selectedSub = (newItem) => {
            selectedObs.value = newItem === item ? true : false
        }
        this.selectedItemObs.addSubscriber(this.selectedSub)
        this.reactive = {
            selected: selectedObs
        }
        this.fdObjects = {
            trClasses: new fdObject({
                'danger': this.reactive.selected
            }),
        }
        this.onSelectClick = () => {
            onSelect(item);
        }
        this.onRemoveClick = () => {
            onRemove(item);
        }
        this.template = {
            tag: "tr",
            classList: this.fdObjects.trClasses,
            children: [
                {
                    tag: "td",
                    classList: 'col-md-1',
                    textValue: item.id,
                },
                {
                    tag: "td",
                    classList: 'col-md-4',
                    children: [
                        {
                            tag: "a",
                            attrs: {
                                'data-action': 'select',
                            },
                            listeners: {
                                click: this.onSelectClick
                            },
                            textValue: item.label,
                        }
                    ]
                },
                {
                    tag: "td",
                    classList: 'col-md-1',
                    children: [
                        {
                            tag: 'a',
                            children: [
                                {
                                    tag: 'span',
                                    classList: 'remove glyphicon glyphicon-remove',
                                    listeners: {
                                        click: this.onRemoveClick
                                    },
                                    attrs: {
                                        'aria-hidden': 'true'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }

    onDestroy() {
        this.selectedItemObs.removeSubscriber(this.selectedSub);
    }
}

function createMainContainer() {
    return createComponent(MainContainer);
}

class MainContainer extends Component {
    constructor() {
        super();
        this.store = new Store();
        this.onRunClick = () => {
            this.store.setData();
        }
        this.onRunLotsClick = () => {
            this.store.setData(10000);
        }
        this.onAppendClick = () => {
            this.store.append();
        }
        this.onClear = () => {
            this.store.clear();
        }
        this.onUpdateClick = () => {
            this.store.update();
        }
        this.onSwapClick = () => {
            this.store.swapData();
        }
        this.template = {
            tag: "div",
            classList: 'container',
            children: [
                {
                    tag: "div",
                    classList: "jumbotron",
                    children: [
                        {
                            tag: "div",
                            classList: 'row',
                            children: [
                                {
                                    tag: "div",
                                    classList: "col-md-6",
                                    children: [
                                        {
                                            tag: "h1",
                                            textValue: 'FastDom-"keyed""'
                                        }
                                    ]
                                },
                                {
                                    tag: "div",
                                    classList: 'col-md-6',
                                    children: [
                                        {
                                            tag: "div",
                                            classList: 'row',
                                            children: [
                                                {
                                                    tag: "div",
                                                    classList: 'col-sm-6 smallpad',
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            classList: 'btn btn-primary btn-block',
                                                            attrs: {
                                                                id: "run"
                                                            },
                                                            textValue: "Create 1,000 rows",
                                                            listeners: {
                                                                click: this.onRunClick,
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    classList: 'col-sm-6 smallpad',
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            attrs: {
                                                                id: "runlots"
                                                            },
                                                            classList: 'btn btn-primary btn-block',
                                                            textValue: "Create 10,000 rows",
                                                            listeners: {
                                                                click: this.onRunLotsClick,
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    classList: 'col-sm-6 smallpad',
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            attrs: {
                                                                id: "add"
                                                            },
                                                            classList: 'btn btn-primary btn-block',
                                                            textValue: "Append 1,000 rows",
                                                            listeners: {
                                                                click: this.onAppendClick,
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    classList: 'col-sm-6 smallpad',
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            attrs: {
                                                                id: "update"
                                                            },
                                                            classList: 'btn btn-primary btn-block',
                                                            textValue: "Update every 10th row",
                                                            listeners: {
                                                                click: this.onUpdateClick,
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    classList: 'col-sm-6 smallpad',
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            attrs: {
                                                                id: "clear"
                                                            },
                                                            classList: 'btn btn-primary btn-block',
                                                            textValue: "Clear",
                                                            listeners: {
                                                                click: this.onClear,
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    classList: 'col-sm-6 smallpad',
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            attrs: {
                                                                id: "swaprows"
                                                            },
                                                            classList: 'btn btn-primary btn-block',
                                                            textValue: "Swap Rows",
                                                            listeners: {
                                                                click: this.onSwapClick,
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    tag: "table",
                    attrs: {
                        id: "table"
                    },
                    classList: 'table table-hover table-striped test-data',
                    children: [
                        {
                            tag: "tbody",
                            children: [
                                fdFor(this.store.data, createTr, [
                                    (e) => e,
                                    () => this.store.selectedItem,
                                    () => this.store.select,
                                    () => this.store.remove,
                                ], (item) => item.id)
                            ]
                        }
                    ]
                },
                {
                    tag: "span",
                    attrs: {
                        'aria-hidden': true,
                    },
                    classList: 'preloadicon glyphicon glyphicon-remove'
                }
            ]
        }
    }
}

bootstrap('#main', createMainContainer)