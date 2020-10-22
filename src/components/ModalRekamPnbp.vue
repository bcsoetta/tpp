<template>
    <b-modal
        size="xl"
        centered
        header-bg-variant="light"
        footer-bg-variant="light"
        v-bind="$attrs"
        v-on="$listeners"
        :title="`Rekam PNBP untuk Entry Manifest #${awbId}`"
        no-close-on-backdrop
        no-close-on-esc
    >
        <!-- footer -->
        <template #modal-footer>
            <b-button
                :disabled="busy"
                variant="primary"
                size="sm"
                @click="rekamPnbp"
            >
                💲 Rekam PNBP
            </b-button>
        </template>

        <!-- body -->
        <template v-if="busy">
            <div class="text-center">
                <b-spinner small variant="dark"/> Loading...
            </div>
        </template>

        <template v-else>
            <!-- <p>
                Put some inputs here...
            </p> -->
            <pnbp-contents
                :data-pnbp="dataPnbp"
                @recalculate="precalculatePnbp"
            />
        </template>
    </b-modal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import PnbpContents from './PnbpContents'

export default {
    inheritAttrs: false,

    components: {
        PnbpContents
    },

    mixins: [
        axiosErrorHandler
    ],

    props: {
        awbId: {
            type: [Number,String],
            default: null
        },
        value: {
            type: Boolean
        }
    },

    data () {
        return {
            busy: false,
            dataPnbp: {
                tgl_dok: null,
                tgl_gate_in: null,
                tgl_gate_out: null,
                total_hari: null,
                tarif_pnbp: null,
                nilai_sewa: null,
                pejabat_id: null,
                nama_bidang: null,
                nama_jabatan: null,
                kode_surat: null,
                manual: false
            }
        }
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        
        precalculatePnbp() {
            if (this.awbId) {
                this.busy = true
                // load it
                // let oldManual = this.dataPnbp.manual

                this.api.precalculatePnbp(this.awbId, {
                    include: 'entry_manifest',
                    tgl_gate_out: this.dataPnbp.tgl_gate_out,
                    manual: this.dataPnbp.manual
                })
                .then(e => {
                    this.busy = false
                    this.dataPnbp = e.data.data
                    // restore manual flag
                    // this.dataPnbp.manual = oldManual
                })
                .catch(e => {
                    this.busy = false
                    this.handleError(e)
                })
            }
        },

        rekamPnbp() {
            // error check and then store
            if (!this.dataPnbp.nama_bidang) {
                this.showToast('error', 'Nama Bidang Harap Diisi', 'danger')
                return
            }
            if (!this.dataPnbp.nama_jabatan) {
                this.showToast('error', 'Nama Seksi Harap Diisi', 'danger')
                return
            }
            if (!this.dataPnbp.nama_jabatan) {
                this.showToast('error', 'Nama Seksi Harap Diisi', 'danger')
                return
            }
            if (!this.dataPnbp.kode_surat) {
                this.showToast('error', 'Kode Surat Harap Diisi', 'danger')
                return
            }
            if (!this.dataPnbp.pejabat_id) {
                this.showToast('error', 'Pejabat ttd harap dipilih', 'danger')
                return
            }

            // emit
            this.$emit('rekam-pnbp', this.dataPnbp)
        }
    },

    watch: {
        awbId: {
            handler (val, oldVal) {
                if (val) {
                    this.precalculatePnbp()
                }
            }
        }
    }
}
</script>