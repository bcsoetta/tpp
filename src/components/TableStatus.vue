<template>
    <b-table
        responsive="sm"
        table-class="shadow"
        head-variant="dark"
        bordered
        outlined
        striped
        small
        hover
        primary-key="status-id"
        :fields="fields"
        :items="data"
        v-bind="$attrs"
        v-on="$listeners">
    </b-table>
</template>

<script>
export default {
    inheritAttrs: false,
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            fields: [
                'status',
                { label: 'Waktu Status', key: 'created_at' }
            ]
        }
    }
}
</script>