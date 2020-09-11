<template>
    <div>
        <!-- put a paginated browser here -->
        <paginated-browser
        ref="browser"
        :data-callback="getPnbp"
        >
            <!-- data mid -->
            <template #default="{ pagination, data }">
                
                <!-- table di tengan -->
                <b-table
                    head-variant="dark"
                    bordered
                    striped
                    hover
                    small
                    responsive
                    class="shadow"
                    :fields="fields"
                    :items="data"
                >

                    <!-- AWB -->
                    <template #cell(entry_manifest.data)="{ value }">
                        <div v-if="value.mawb">
                            <b-badge variant="dark">{{ value.mawb }}</b-badge>
                        </div>
                        <div v-if="value.hawb">
                            <b-badge variant="success">{{ value.hawb }}</b-badge>
                        </div>
                    </template>

                    <!-- Importir -->
                    <template #cell(importir)="{ item }">
                        <div :class="['bg-primary', 'font-weight-bold', 'border-bottom']">{{ item.entry_manifest.data.nama_importir }}</div>
                        <div>{{ item.entry_manifest.data.alamat_importir }}</div>
                    </template>

                    <!-- masa timbun -->
                    <template #cell(masa_timbun)="{ item }">
                        (📅 {{ item.tgl_gate_in_text }} - {{ item.tgl_gate_out_text }}) = {{ item.total_hari }} hari
                    </template>

                    <!-- nilai sewa -->
                    <template #cell(nilai_sewa)="{ item }">
                        {{ item.nilai_sewa | formatCurrency(2) | displayRupiah }}
                    </template>

                    <!-- lunas atau belum -->
                    <template #cell(is_locked)="{ value }">
                        <b-badge :variant="value ? 'success' : 'danger'">{{ value ? 'LUNAS' : 'BELUM LUNAS' }}</b-badge>
                    </template>

                    <!-- action -->
                    <template #cell(act)="{ item }">
                        <!-- lihat manifest -->
                        <b-button v-if="item.entry_manifest_id"
                            variant="primary"
                            size="sm"
                            class="shadow mb-1"
                            :to="`/hawb/${item.entry_manifest_id}`"
                        >
                            <font-awesome-icon icon="eye"/>
                            Lihat AWB
                        </b-button>

                        <!-- Rekam Bukti Bayar -->
                        <b-button
                        :disabled="item.is_locked"
                        variant="warning"
                        size="sm"
                        class="shadow mb-1"
                        @click="showModalPnbp(item)"
                        >
                            <font-awesome-icon icon="cash-register"/>
                            Rekam Bukti Bayar
                        </b-button>

                        <!-- Perbarui PNBP -->
                        <b-button
                        v-if="!item.is_locked"
                        variant="danger"
                        size="sm"
                        class="shadow mb-1"
                        @click="perbaruiPnbp(item)"
                        >
                            <font-awesome-icon icon="dollar-sign"/>
                            Perbarui nilai PNBP
                        </b-button>

                        <!-- cetak PDF -->
                        <b-button
                        variant="dark"
                        size="sm"
                        class="shadow mb-1"
                        @click="printPnbp(item)"
                        >
                            <font-awesome-icon icon="print"/>
                            Print
                        </b-button>
                    </template>

                </b-table>
                
            </template>
        </paginated-browser>

        <!-- Utk upload bukti bayar -->
        <b-modal
        id="modal-pnbp"
        ref="modal"
        centered
        size="xl"
        :title="modalTitle"        

        @tandai-lunas="tandaiPnbpLunas"
        >
            <!-- custom footer -->
            <template #modal-footer>
                <b-button
                    v-if="activePnbp"
                    size="sm"
                    variant="danger"
                    :disabled="activePnbp.is_locked"
                    @click="tandaiPnbpLunas(activePnbp.id)"
                >
                    <font-awesome-icon icon="save"/>
                    Tandai Lunas
                </b-button>
            </template>
            <!-- taro attachment bucket disini -->
            <template v-if="activePnbp">
                <attachment-bucket
                    show
                    :endpoint="`/pnbp/${activePnbp.id}/lampiran`"
                    :disabled="activePnbp.is_locked"
                    :title="`Lampiran PNBP ${activePnbp.id}`"
                />

                <!-- taro label di sini -->
                <div class="text-muted">
                    Apabila bukti bayar sudah diupload dan sudah tidak ada masalah pelunasan, klik 'Tandai Lunas'
                </div>
            </template>

            <template v-else>
                <div class="text-center">
                    Harap Pilih PNBP dlu
                </div>
            </template>
        </b-modal>

        <!-- Untuk nampilin PDF -->
        <modal-view-pdf
            :url="pdfUrl"
            :altFilename="altFilename"
            :title="'Cetak Lembar PNBP'"
            v-model="showPdf"
        />

    </div>
</template>

<script>
import AttachmentBucket from '../components/AttachmentBucket'
import PaginatedBrowser from '../components/PaginatedBrowser'
import ModalViewPdf from '../components/ModalViewPdf'

import axiosErrorHandler from '../mixins/axiosErrorHandler'
import niceties from '../mixins/niceties'
import { mapMutations, mapGetters } from 'vuex'

export default {
    mixins: [
        axiosErrorHandler,
        niceties
    ],

    components: {
        PaginatedBrowser,
        AttachmentBucket,
        ModalViewPdf
    },

    methods: {
        ...mapMutations(['setBusyState']),

        getPnbp(q, spinner, vm) {
            spinner(true)

            // call api
            this.api.getPnbp({
                ...q,
                include:'entry_manifest'
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

        // show modal utk upload bukti bayar
        showModalPnbp(item) {
            this.activePnbp = item
            this.$bvModal.show('modal-pnbp')
        },

        // tandai pnbp lunas
        tandaiPnbpLunas(id) {
            // alert(`PNBP #${id} lunas!`)
            this.setBusyState(true)

            this.api.tandaiLunasPnbp(id)
            .then(e => {
                this.setBusyState(false)
                // alert("LUNAS BOS!")
                this.$bvModal.hide('modal-pnbp')
                this.$nextTick(() => {
                    // after close, reload
                    this.$refs.browser.stayAtCurrentPage(0)
                    // toast
                    this.showToast(
                        `PNBP lunas`,
                        `PNBP nomor ${this.activePnbp.nomor_lengkap_dok} tanggal ${this.activePnbp.tgl_dok} berhasil dilunasi`,
                        'success'
                    )
                })
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        },

        // perbarui data PNBP (nilai sewa, masa timbun dll)
        async perbaruiPnbp(item) {
            var result = await this.$bvModal.msgBoxConfirm(
                `Perbarui nilai pungutan PNBP nomor ${item.nomor_lengkap_dok}?`, {
                    title: `Konfirmasi pembaruan PNBP`,
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

            if (!result) return

            this.setBusyState(true)
            this.api.perbaruiPnbp(item.id)
            .then(e => {
                this.setBusyState(false)
                this.$nextTick(() => {
                    this.$refs.browser.stayAtCurrentPage(0)
                    this.showToast(
                        "PNBP berhasil diperbarui",
                        `PNBP nomor ${item.nomor_lengkap_dok} berhasil diperbarui nilai pungutannya`,
                        'success'
                    )
                })
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        },

        // cetak PDF
        printPnbp(item) {
            this.pdfUrl = this.api.generatePdfUrl('pnbp', item.id)
            this.showPdf = true
        }
    },

    computed: {
        ...mapGetters(['api']),

        fields () {
            return [
                { key: 'entry_manifest.data', label: 'AWB', class: 'text-center' },
                { key: 'importir', class: 'text-center' },
                { key: 'nomor_lengkap_dok', class: 'text-center' },
                { key: 'tgl_dok', class: 'text-center' },
                { key: 'masa_timbun', class: 'text-center' },
                { key: 'nilai_sewa', class: 'text-center' },
                { key: 'is_locked', label: 'Lunas', class: 'text-center' },
                { key: 'act', label: '', class: 'text-center' }
            ]
        },

        modalTitle () {
            return this.activePnbp ? `Upload Bukti Bayar untuk PNBP #${this.activePnbp.id}` : 'Pilih PNBP dlu plis'
        }
    },

    data () {
        return {
            // shownId: null,
            activePnbp: null,

            pdfUrl: null,
            showPdf: false,
            altFilename: 'PNBP.pdf'
        }
    }
}
</script>