import Component from '@glimmer/component';

export default class PerformantEach extends Component {
    public fragment: any = null;
    constructor() {
        super(...arguments);
        this.fragment = document.createElement('tbody');
    }
    get appendNode() {
        const item = document.getElementById('items-list');
        if (!item.contains(this.fragment)) {
            item.append(this.fragment);
        }
        return '';
    }
}