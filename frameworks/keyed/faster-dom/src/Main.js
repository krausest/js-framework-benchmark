import { Component, createComponent, fdFor, fdObject, fdValue, generateNode } from 'faster-dom';

import { Store } from './Store';

let startTime;
let lastMeasure;
const startMeasure = (name) => {
    startTime = performance.now();
    lastMeasure = name;
}
const stopMeasure = () => {
    let last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(() => {
            lastMeasure = null;
            const stop = performance.now();
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
}

function createTr(input) {
    return createComponent(TrComponent, input)
}

class TrComponent extends Component {
    constructor(inputs) {
        super();
        this.item = inputs.item;
        const index = inputs.index
        const idObs = fdValue(this.item.value.id)
        const labelObs = fdValue(this.item.value.label)
        this.selectedIdObs = inputs.selectedId;
        const selectedObs = fdValue(this.selectedIdObs.value === index ? true : false)


        this.selectedSub = (newIndex) => {
            selectedObs.value = newIndex === index ? true : false
        }
        this.selectedIdObs.addSubscriber(this.selectedSub)
        this.subscriber = (newItem) => {
            idObs.value = newItem.id
            labelObs.value = newItem.label
        }

        this.item.addSubscriber(this.subscriber)
        this.reactive = {
            selected: selectedObs
        }
        this.fdObjects = {
            trClasses: new fdObject({
                'danger': this.reactive.selected
            }),
        }
        this.onSelectClick = () => {
            startMeasure('select')
            inputs.onSelect(index);
            stopMeasure();
        }
        this.onRemoveClick = () => {
            startMeasure('remove')
            inputs.onRemove(index);
            stopMeasure();
        }
        this.template = {
            tag: "tr",
            classList: this.fdObjects.trClasses,
            children: [
                {
                    tag: "td",
                    classList: ['col-md-1'],
                    textValue: idObs,
                },
                {
                    tag: "td",
                    classList: ['col-md-4'],
                    children: [
                        {
                            tag: "a",
                            attrs: {
                                'data-action': 'select',
                            },
                            listeners: {
                                click: this.onSelectClick
                            },
                            textValue: labelObs,
                        }
                    ]
                },
                {
                    tag: "td",
                    classList: ['col-md-1'],
                    children: [
                        {
                            tag: 'a',
                            children: [
                                {
                                    tag: 'span',
                                    classList: ['remove', 'glyphicon', 'glyphicon-remove'],
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
        this.item.removeSubscriber(this.subscriber)
        this.selectedIdObs.removeSubscriber(this.selectedSub);
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
            startMeasure("run");
            this.store.setData();
            stopMeasure();
        }
        this.onRunLotsClick = () => {
            startMeasure("runLots");
            this.store.setData(10000);
            stopMeasure();
        }
        this.onAppendClick = () => {
            startMeasure("add");
            this.store.append();
            stopMeasure();
        }
        this.onClear = () => {
            startMeasure("clear");
            this.store.clear();
            stopMeasure();
        }
        this.onUpdateClick = () => {
            startMeasure("update");
            this.store.update();
            stopMeasure();
        }
        this.onSwapClick = () => {
            startMeasure("swapRows");
            this.store.swapData();
            stopMeasure();
        }
        this.template = {
            tag: "div",
            classList: ["container"],
            children: [
                {
                    tag: "div",
                    classList: ["jumbotron"],
                    children: [
                        {
                            tag: "div",
                            classList: ['row'],
                            children: [
                                {
                                    tag: "div",
                                    classList: ["col-md-6"],
                                    children: [
                                        {
                                            tag: "h1",
                                            textValue: 'FastDom-"keyed""'
                                        }
                                    ]
                                },
                                {
                                    tag: "div",
                                    classList: ['col-md-6'],
                                    children: [
                                        {
                                            tag: "div",
                                            classList: ['row'],
                                            children: [
                                                {
                                                    tag: "div",
                                                    classList: ['col-sm-6', 'smallpad'],
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            classList: ['btn', 'btn-primary', 'btn-block'],
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
                                                    classList: ['col-sm-6', 'smallpad'],
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            attrs: {
                                                                id: "runlots"
                                                            },
                                                            classList: ['btn', 'btn-primary', 'btn-block'],
                                                            textValue: "Create 10,000 rows",
                                                            listeners: {
                                                                click: this.onRunLotsClick,
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    classList: ['col-sm-6', 'smallpad'],
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            attrs: {
                                                                id: "add"
                                                            },
                                                            classList: ['btn', 'btn-primary', 'btn-block'],
                                                            textValue: "Append 1,000 rows",
                                                            listeners: {
                                                                click: this.onAppendClick,
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    classList: ['col-sm-6', 'smallpad'],
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            attrs: {
                                                                id: "update"
                                                            },
                                                            classList: ['btn', 'btn-primary', 'btn-block'],
                                                            textValue: "Update every 10th row",
                                                            listeners: {
                                                                click: this.onUpdateClick,
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    classList: ['col-sm-6', 'smallpad'],
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            attrs: {
                                                                id: "clear"
                                                            },
                                                            classList: ['btn', 'btn-primary', 'btn-block'],
                                                            textValue: "Clear",
                                                            listeners: {
                                                                click: this.onClear,
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    classList: ['col-sm-6', 'smallpad'],
                                                    children: [
                                                        {
                                                            tag: "button",
                                                            attrs: {
                                                                id: "swaprows"
                                                            },
                                                            classList: ['btn', 'btn-primary', 'btn-block'],
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
                    classList: ['table', 'table-hover', 'table-striped', 'test-data'],
                    children: [
                        {
                            tag: "tbody",
                            children: [
                                fdFor(this.store.data, createTr, {
                                    item: (e) => e,
                                    selectedId: () => this.store.selectedId,
                                    index: (e, index) => index,
                                    onSelect: () => this.store.select,
                                    onRemove: () => this.store.remove
                                }, (item) => item.value.id)
                            ]
                        }
                    ]
                },
                {
                    tag: "span",
                    attrs: {
                        'aria-hidden': true,
                    },
                    classList: ['preloadicon', 'glyphicon', 'glyphicon-remove']
                }
            ]
        }
    }
}

document.getElementById('main').appendChild(generateNode(createMainContainer()))