import { Component } from '@lifeart/gxt';
export class Button extends Component {
    <template>
    <div class='col-sm-6 smallpad'><button
        class='btn btn-primary btn-block'
        type='button'
        ...attributes
        >{{@text}}</button></div>
    </template>
};
