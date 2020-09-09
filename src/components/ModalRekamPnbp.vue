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
                @click="$emit()"
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
                kode_surat: null
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
                this.api.precalculatePnbp(this.awbId, {
                    include: 'entry_manifest'
                })
                .then(e => {
                    this.busy = false
                    this.dataPnbp = e.data.data
                })
                .catch(e => {
                    this.busy = false
                    this.handleError(e)
                })
            }
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