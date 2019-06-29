<template>
        <table class="table table-hover table-striped test-data">
            <tbody>
                <tr v-for="item in rows" :key="item.id" :class="{'danger': item.id == selected}">
                    <td class="col-md-1">{{item.id}}</td>
                    <td class="col-md-4">
                        <a @click="select" :data-id="item.id">{{item.label}}</a>
                    </td>
                    <td class="col-md-1">
                        <a>
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"
                                @click="remove" :data-id="item.id"></span>
                        </a>
                    </td>
                    <td class="col-md-6"></td>
                </tr>
            </tbody>
        </table>
</template>

<script>
import { startMeasure, stopMeasure } from './store';
import { get, set, bindState } from 'xsm';

export default {
    data: () => ({
        selected: 0
    }),
    created() {
        bindState(this,{rows: []});
    },
    methods: {
        remove(e) {
            let id = e.target.dataset.id;
            let rows = this.rows;
            const idx = rows.findIndex(d => d.id==id);
            let data = rows.slice(0, idx);
            data.push(...rows.slice(idx + 1));
            set('rows', data);
            e.stopPropagation();
        },
        select(e) {
            this.selected = e.target.dataset.id;
            e.stopPropagation();
        },
    }
}
</script>
