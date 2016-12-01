<template>
    <table class="table table-hover table-striped test-data">
        <tbody>
            <tr v-for="item in rows" v-bind:class="{'danger' : item.id === selected}">
                <td class="col-md-1">{{item.id}}</td>
                <td class="col-md-4">
                    <a v-on:click="$emit('select', item)">{{item.label}}</a>
                </td>
                <td class="col-md-1"><a v-on:click="$emit('remove', item)"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                <td class="col-md-6"></td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: ['rows', 'selected']
}
</script>
