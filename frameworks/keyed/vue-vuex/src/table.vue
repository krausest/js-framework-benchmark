<template>
        <table class="table table-hover table-striped test-data">
            <tbody>
                <tr v-for="item in $store.getters.Rows" :key="item.id" :class="{'danger': item.id == selected}">
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

export default {
    data: () => ({
        selected: 0
    }),
    methods: {
        remove(e) {
            let id = e.target.dataset.id;
            let rows = this.$store.getters.Rows;
            const idx = rows.findIndex(d => d.id==id);
            let data = rows.slice(0, idx);
            data.push(...rows.slice(idx + 1));
            this.$store.commit('Rows', Object.freeze(data));
            e.stopPropagation();
        },
        select(e) {
            this.selected = e.target.dataset.id;
            e.stopPropagation();
        },
    }
}
</script>
