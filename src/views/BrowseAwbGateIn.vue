<template>
    <div>
        <!-- paginated browser here -->
        <paginated-browser
            :data-callback="getAwbSiapGateIn"
            ref="browser"
        >
            <!-- put table in the middle -->
            <template #default="{ data, pagination }">
                <awb-flexi-table
                    :items="data"
                    :showBc11="true"
                    :showBcp="true"
                >
                    <template #additional-controls="{ row }">
                        <b-button 
                            variant="dark"
                            class="shadow my-1"
                            size="sm"
                            @click="prosesGateIn(row.item)"
                            v-b-tooltip.hover title="Proses Gate In"
                            >
                            <font-awesome-icon icon="warehouse"/>
                        </b-button>
                    </template>
                </awb-flexi-table>
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import TableDataAwal from '@/components/TableDataAwal'
import AwbFlexiTable from '@/components/AwbFlexiTable'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'

import niceties from '../mixins/niceties'

export default {
    mixins: [
        axiosErrorHandler,
        niceties
    ],

    components: {
        TableDataAwal,
        PaginatedBrowser,
        AwbFlexiTable
    },

    data() {
        return {}
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        ...mapMutations(['setBusyState']),

        getAwbSiapGateIn(q, spinner, vm) {
            spinner(true)

            // call api
            this.api.getAwbSiapGateIn(q)
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

        // proses gate in
        async prosesGateIn(awb) {
            console.log('Gate in: ', awb)
            var answer = await this.$bvModal.msgBoxConfirm(
                `Gate In (${awb.hawb})?`,
                {
                    title: 'Konfirmasi',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    centered: true
                }
            )

            if (answer) {
                this.setBusyState(true)
                // do shit here
                this.api.gateInAwb(awb.id)
                .then(e => {
                    this.setBusyState(false)
                    // success? show toast
                    this.showToast(`AWB Gated In (${e.data.bcp})`, `AWB ${awb.hawb} telah digate-in, nomor BCP: ${e.data.bcp}`, 'success')
                    this.$nextTick(() => {
                        // refresh browser
                        this.$refs.browser.stayAtCurrentPage(-1)
                    })
                })
                .catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)
                })
            }
        }
    }
}
</script>