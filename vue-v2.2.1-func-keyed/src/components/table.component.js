import { default as Vue } from 'vue';

Vue.component('vue-table', {
    functional: true,
    props: [
        'items',
        'selected'
    ],
    beforeCreate() {
        console.log(this);
    },
    render(h, context) {
        let list = [];
        for (let item of context.props.items) {
            list.push(
                h('tr', {
                    class: 'col-md-4',
                }, [
                        h('td', {
                            class: item.id === context.props.selected ? 'danger' : '',
                        }, `${item.id}`),
                        h('td', {
                            class: 'col-md-4',
                        }, [
                                h('a', {
                                    class: 'col-md-1',
                                    'data-action': 'select',
                                    ':data-id': `${item.id}`
                                }, `${item.label}`)
                            ]),
                        h('td', {
                            class: 'col-md-1',
                        }, [
                                h('a', {}, [
                                    h('span', {
                                        class: 'glyphicon glyphicon-remove',
                                        'aria-hidden': 'true',
                                        'data-action': 'remove',
                                        ':data-id': `${item.id}`
                                    })
                                ])
                            ]),
                        h('td', {
                            class: 'col-md-6',
                        })
                    ])
            );
        }
        return h('table', {
            class: 'table table-hover table-striped test-data'
        }, list);
    },
    template: `<table class="">
    <tbody>
        <tr v-for="item in rows" :key="item.id" :class="{'danger': item.id == selected}">
            <td class="col-md-1">{{item.id}}</td>
            <td class="col-md-4">
                <a data-action="select" :data-id="item.id">{{item.label}}</a>
            </td>
            <td class="col-md-1">
                <a>
                    <span class="glyphicon glyphicon-remove" aria-hidden="true" data-action="remove" :data-id="item.id"></span>
                </a>
            </td>
            <td class="col-md-6"></td>
        </tr>
    </tbody>
</table>`
});
