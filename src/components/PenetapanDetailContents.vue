<template>
    <paginated-browser
        ref="browser"
        :data-callback="fetchPenetapanAwb"
    >
        <!-- put table data awal in the middle -->
        <template #default="{ data, pagination }">
            <table-data-awal
                read-only
                disable-controls
                :items="data"
                :start="pagination.start"
            />
        </template>
    </paginated-browser>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableDataAwal from '@/components/TableDataAwal'


export default {
    mixins: [ axiosErrorHandler ],

    props: {
        id: {
            type: [Number,String],
            required: true
        }
    },

    components: {
        PaginatedBrowser,
        TableDataAwal
    },

    methods: {
        ...mapMutations(['setBusyState']),

        fetchPenetapanAwb (q, spinner, vm) {
            spinner(true)

            this.api.getPenetapanAwb(this.id, q)
            .then(e => {
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        }
    },

    computed: {
        ...mapGetters(['api'])
    }
}
</script>