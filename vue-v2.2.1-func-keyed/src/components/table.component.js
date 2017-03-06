import { default as Vue } from 'vue';

Vue.component('vue-table', {
    functional: true,
    props: [
        'onClick',
        'items',
        'selected'
    ],
    // <table class="table table-hover table-striped test-data">
    //     <tbody>
    //         <tr v-for="item in rows" :key="item.id" :class="{'danger': item.id == selected}">
    //             <td class="col-md-1">{{item.id}}</td>
    //             <td class="col-md-4">
    //                 <a data-action="select" :data-id="item.id">{{item.label}}</a>
    //             </td>
    //             <td class="col-md-1">
    //                 <a>
    //                     <span class="glyphicon glyphicon-remove" aria-hidden="true" data-action="remove" :data-id="item.id"></span>
    //                 </a>
    //             </td>
    //             <td class="col-md-6"></td>
    //         </tr>
    //     </tbody>
    // </table>
    render(h, context) {
        let list = [];
        for (let item of context.props.items) {
            list.push(
                h('tr', {
                    class: {
                        danger: item.id == context.props.selected
                    }
                }, [
                        h('td', {
                            attrs: {
                                'class': 'col-md-1'
                            }
                        }, `${item.id}`),
                        h('td', {
                            attrs: {
                                'class': 'col-md-4'
                            }
                        }, [
                                h('a', {
                                    attrs: {
                                        'data-action': 'select',
                                        'data-id': `${item.id}`
                                    },
                                }, `${item.label}`)
                            ]),
                        h('td', {
                            attrs: {
                                'class': 'col-md-1'
                            }
                        }, [
                                h('a', {}, [
                                    h('span', {
                                        attrs: {
                                            'class': 'glyphicon glyphicon-remove',
                                            'aria-hidden': 'true',
                                            'data-action': 'remove',
                                            'data-id': `${item.id}`
                                        }
                                    })
                                ])
                            ]),
                        h('td', {
                            attrs: {
                                'class': 'col-md-6',
                            }
                        })
                    ])
            );
        }
        return h('table', {
            attrs: {
                'class': 'table table-hover table-striped test-data'
            },
            on: {
                click: context.props.onClick
            }
        }, [
                h('tbody', {}, list)
            ]);
    }
});
