<template>
    <paginated-browser
        ref="browser"
        :data-callback="fetchPenetapanAwb"
    >
        <!-- put table data awal in the middle -->
        <template #default="{ data, pagination }">
            <awb-flexi-table

                :items="data"
                :start="pagination.start"

                :showBc11="!bdnMode"
                :showBcp="bdnMode"

                show-number

                :appendFields="[{ key: 'status', class: 'text-center' }]"
            >

                <!-- add status field? -->
                <template #cell(status)="{ item }">
                    <b-badge v-if="item.short_last_status"
                    :variant="badgeVariant(item.short_last_status.status)"
                    >
                    {{ item.short_last_status.status }}
                    </b-badge>
                </template>

                <!-- nope, add gate in button to those who's not gated in yet -->
                <template #additional-controls="{ row }">
                    <!-- show only when awb is not gated in and last status is penetapan -->
                    <b-button
                        v-if="row.item.short_last_status.status == 'PENETAPAN' && !row.item.waktu_gate_in"
                        variant="dark"
                        size="sm"
                        @click="prosesGateIn(row.item)"
                        class="shadow my-1"
                        v-b-tooltip.hover title="Gate In AWB"
                    >
                        <font-awesome-icon icon="warehouse"/>
                    </b-button>
                </template>
                
            </awb-flexi-table>
        </template>
    </paginated-browser>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import niceties from '../mixins/niceties'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableDataAwal from '@/components/TableDataAwal'
import AwbFlexiTable from '@/components/AwbFlexiTable'


export default {
    mixins: [ axiosErrorHandler, niceties ],

    props: {
        id: {
            type: [Number,String],
            required: true
        },

        bdnMode: {
            type: Boolean,
            default: false
        }
    },

    components: {
        PaginatedBrowser,
        TableDataAwal,
        AwbFlexiTable
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
                        this.$refs.browser.stayAtCurrentPage(0)
                    })
                })
                .catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)
                })
            }
        }
    },

    computed: {
        ...mapGetters(['api']),

        prependFields () {
            if (this.bdnMode) {
                return [
                    { key: 'bcp.data.nomor_lengkap', label: 'BCP', class: "text-center" }, 
                    { key: 'bcp.data.tgl_dok', label: 'Tanggal', class: "text-center" }, 
                ]
            }
            return []
        }
    }
}
</script>