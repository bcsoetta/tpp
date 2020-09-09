<template>
    <div>
        <!-- <pre>{{ $route.query }}</pre>
        <pre>{{ filter }}</pre> -->
        <!-- paginated browser here -->
        <paginated-browser
            :data-callback="getAwb"
            ref="browser"
        >
            <!-- append table param -->
            <template #append-search-param>
                <b-col md="12" class="border-bottom my-2">
                    
                </b-col>
                <b-col md="2">
                    <label>
                        <b-form-checkbox v-model="showManifest" class="d-inline-block"/>
                        Show BC11
                    </label>
                </b-col>
                <b-col md="2">
                    <label>
                        <b-form-checkbox v-model="showBcp" class="d-inline-block"/>
                        Show BCP
                    </label>
                </b-col>
                <b-col md="3">
                    <label>
                        <b-form-checkbox v-model="showPencacahan" class="d-inline-block"/>
                        Show Pencacahan
                    </label>
                </b-col>
            </template>

            <!-- put table in the middle -->
            <template #default="{ data, pagination }">
                <awb-flexi-table
                    :items="data"
                    :showBc11="showManifest"
                    :showBcp="showBcp"
                    :sortBcp="showBcp"
                    :showPencacahan="showPencacahan"

                    no-local-sorting
                    @sort-changed="onSortChanged"
                >
                    <!-- custom control when pencacahan is active -->
                    <template #additional-controls="{ row }">
                        <!-- TOMBOL CACAH -->
                        <b-button 
                            v-if="filter.siap_pencacahan"
                            size="sm"
                            variant="warning"
                            class="shadow"
                            v-b-tooltip.hover title="Mulai Cacah Barang"
                            @click="mulaiPencacahan(row.item)"
                        >
                            <font-awesome-icon icon="boxes"/>
                        </b-button>

                        <!-- TOMBOL GATE OUT -->
                        <b-button
                            v-if="filter.siap_gate_out"
                            size="sm"
                            variant="danger"
                            class="shadow"
                            v-b-tooltip.hover title="Gate Out Barang (!)"
                            @click="gateOutAwb(row.item)"
                        >
                            <font-awesome-icon icon="door-open"/>
                        </b-button>

                        <!-- TOMBOL REKAM PNBP -->
                        <b-button
                            v-if="filter.siap_pnbp"
                            size="sm"
                            variant="dark"
                            class="shadow"
                            v-b-tooltip.hover title="Rekam PNBP (!)"
                            @click="rekamPNBP(row.item)"
                        >
                            💲
                        </b-button>
                    </template>
                </awb-flexi-table>
            </template>
        </paginated-browser>

        <!-- modal rekam PNBP -->
        <modal-rekam-pnbp
            :awb-id="pnbpId"
            id="modal-rekam-pnbp"
            @hidden="pnbpId = null"
        />
    </div>
</template>

<script>
import TableDataAwal from '@/components/TableDataAwal'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import niceties from '../mixins/niceties'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'

import AwbFlexiTable from '@/components/AwbFlexiTable'

import ModalRekamPnbp from '../components/ModalRekamPnbp'

export default {
    mixins: [
        axiosErrorHandler,
        niceties
    ],

    components: {
        TableDataAwal,
        PaginatedBrowser,
        AwbFlexiTable,
        ModalRekamPnbp
    },

    data() {
        return {
            showManifest: true,
            showBcp: false,
            showPencacahan: false,

            filter: {},
            orderBy: [],

            pnbpId: null
        }
    },

    computed: {
        ...mapGetters(['api']),

        prependFields() {
            return [
                ...(this.showBcp ? [
                    'bcp'
                ]:[])
            ]
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        getAwb(q, spinner, vm) {
            spinner(true)

            // call api
            this.api.getAwb({
                ...q,
                ...this.filter,
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

        // mulai pencacahan
        async mulaiPencacahan(item) {

            /* var answer = await this.$bvModal.msgBoxConfirm(
                `Mulai Pencacahan AWB: ${item.hawb}?`, {
                    title: `Pencacahan`,
                    size: 'md',
                    buttonSize: 'md',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    cancelTitle: 'NO',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                }
            )

            if (!answer) return */

            const id = item.id

            // just call the api
            this.setBusyState(true)
            this.api.putEndpoint(`/awb/${id}/pencacahan`)
            .then(e => {
                this.setBusyState(false)
                this.$nextTick(() => {
                    // go to the awb detail /pencacahan
                    this.$router.push(`/hawb/${id}?tab=pencacahan`)
                })
            })
            .catch(e => {
                this.setBusyState(false)
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

        // gate out awb
        async gateOutAwb(item) {
            var answer = await this.$bvModal.msgBoxConfirm(
                `Gate Out AWB: ${item.hawb || item.mawb}?`, {
                    title: `Gate Out`,
                    size: 'md',
                    buttonSize: 'md',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    cancelTitle: 'NO',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                }
            )

            if (!answer) return

            // process it?
            this.setBusyState(true)
            this.api.gateOutAwb(item.id)
            .then(e => {
                this.setBusyState(false)
                this.$nextTick(() => {
                    this.$refs.browser.loadData()
                    this.showToast(
                        'Gate Out Berhasil',
                        `Gate out AWB ${item.hawb||item.mawb} berhasil dilakukan`,
                        'success'
                    )
                })
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        },

        // Rekam PNBP
        rekamPNBP(item) {
            this.pnbpId = item.id
            this.$bvModal.show('modal-rekam-pnbp')
        }
    },

    watch: {
        '$route.query': {
            deep: true,
            immediate: true,
            handler(nv, ov) {
                this.showManifest = (nv.show_bc11 == 'true')
                this.showBcp = (nv.show_bcp == 'true')

                // clear filters
                this.filter = {}

                if (nv.filter) {
                    if (!Array.isArray(nv.filter)) {
                        nv.filter = [nv.filter]
                    }

                    nv.filter.forEach(element => {
                        this.filter[element] = true
                    });
                }
            }
        },

        filter: {
            handler(nv) {
                // just reload data
                this.$refs.browser.loadData()
            }
        },

        orderBy: {
            handler(nv) {
                this.$refs.browser.loadData()
            }
        }
    }
}
</script>