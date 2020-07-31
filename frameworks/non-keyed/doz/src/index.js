import Doz from 'doz'

const adjectives = [
    'pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let did = 1;
let selected = -1;

const actions = {
    add() {
        this.mainComponent.prepareCommit();
        this.getStore('records').data = this.getStore('records').data.concat(buildData(1000));
        this.mainComponent.commit();
    },

    run() {
        this.mainComponent.prepareCommit();
        this.getStore('records').data = buildData(1000);
        this.mainComponent.commit();
    },

    runLots() {
        this.mainComponent.prepareCommit();
        this.getStore('records').data = buildData(10000);
        this.mainComponent.commit();
    },

    clear() {
        this.getStore('records').data = [];
    },

    del(id) {
        this.mainComponent.prepareCommit();
        const data = this.getStore('records').data;
        const idx = data.findIndex(d => d.id === id);
        data.splice(idx, 1);
        this.mainComponent.commit();
    },

    interact(e) {
        const td = e.target.closest('td');
        const interaction = td.getAttribute('data-interaction');
        const id = parseInt(td.parentNode.id);
        if (interaction === 'delete') {
            this.action.del(id);
        } else {
            this.action.select(id);
        }
    },

    select(id) {
        this.mainComponent.prepareCommit();
        const data = this.getStore('records').data;
        if (selected > -1) {
            data[selected].selected = false;
        }
        selected = data.findIndex(d => d.id === id);
        data[selected].selected = true;
        this.mainComponent.commit();
    },

    swapRows() {
        this.mainComponent.prepareCommit();
        const data = this.getStore('records').data;
        if (data.length > 998) {
            const tmp = data[1];
            data[1] = data[998];
            data[998] = tmp;
        }
        this.mainComponent.commit();
    },

    update() {
        this.mainComponent.prepareCommit();
        const data = this.getStore('records').data;
        for (let i = 0; i < data.length; i += 10) {
            data[i].label += ' !!!';
        }
        this.mainComponent.commit();
    }
};

const buildData = count => {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: did++,
            label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
            selected: false,
        });
    }
    return data;
};

const _random = max => {
    return Math.round(Math.random() * 1000) % max;
};

new Doz({
    store: 'records',
    actions,
    root: '#container',
    props: {
        data: []
    },
    template(h) {
        return h`
<div class="container">
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Doz</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="run" onclick="${this.action.run}">Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="runlots" onclick="${this.action.runLots}">Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="add" onclick="${this.action.add}">Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="update" onclick="${this.action.update}">Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="clear" onclick="${this.action.clear}">Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="swaprows" onclick="${this.action.swapRows}">Swap Rows</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <table onclick="${this.action.interact}" class="table table-hover table-striped test-data">
        <tbody>
            ${this.props.data.map(
            item => h`
                    <tr id="${item.id}" class="${item.selected ? 'danger' : ''}" >
                        <td class="col-md-1">${item.id}</td>
                        <td class="col-md-4" >
                            <a>${item.label}</a>
                        </td>
                        <td data-interaction="delete" class="col-md-1">
                            <a>
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </a>
                        </td>
                        <td class="col-md-6"></td>
                    </tr>`
        )}
        </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>
`
    },
});