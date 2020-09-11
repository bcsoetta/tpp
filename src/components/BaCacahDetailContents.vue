<template>
    <paginated-browser
        ref="browser"
        :data-callback="fetchBaCacahAwb"
    >

        <!-- put table data awal in the middle -->
        <template #default="{ data, pagination }">
            <awb-flexi-table
                show-bcp
                show-pencacahan
                :items="data"

                sort-bcp
                no-local-sorting
                @sort-changed="onSortChanged"

            />
        </template>
    </paginated-browser>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import AwbFlexiTable from '@/components/AwbFlexiTable'


export default {
    mixins: [ axiosErrorHandler ],

    props: {
        id: {
            type: [Number,String],
            required: true
        },
    },

    data () {
        return {
            orderBy: []
        }
    },

    components: {
        PaginatedBrowser,
        AwbFlexiTable
    },

    methods: {
        ...mapMutations(['setBusyState']),

        fetchBaCacahAwb (q, spinner, vm) {
            spinner(true)

            this.api.getBACacahAwb(this.id, {
                ...q,
                ...{
                    orderBy: this.orderBy.join(',')
                }
            })
            .then(e => {
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },

        // when sorting changes
        onSortChanged(ctx) {
            console.log('Sorting changed:', ctx)

            // change the sortBy query
            this.orderBy = []
            this.orderBy.push(`${ctx.sortBy}|${ctx.sortDesc ? 'desc' : 'asc'}`)

            console.log('orderBy: ', this.orderBy)
        },
    },

    computed: {
        ...mapGetters(['api']),
    },

    watch: {
        orderBy: {
            handler(nv) {
                this.$refs.browser.loadData()
            }
        }
    }
}
</script>