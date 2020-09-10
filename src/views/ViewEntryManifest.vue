<template>
    <div>
        <b-card no-body class="rounded shadow">
            <!-- HEADER -->
            <b-card-header>
                <div class="d-sm-block d-md-flex my-2">
                    <doc-banner doctype="Entry Manifest" :data="dataAwb" :is-new="false"/>

                    <!-- some controls here? -->
                    <div class="flex-grow-1 text-right">
                        <!-- rollback gate in -->
                        <b-button size="sm" variant="danger" class="shadow my-2" v-if="hasRole('CONSOLE')" 
                        @click="rollbackGateIn"
                        :disabled="dataAwb.short_last_status && dataAwb.short_last_status.status != 'GATE-IN'"
                        >
                            <font-awesome-icon icon="undo-alt"/>
                            Rollback Gate-In
                        </b-button>

                        <!-- gate out -->
                        <b-button size="sm" variant="primary" class="shadow my-2" v-b-modal.dialog-penyelesaian :disabled="isLocked">
                            <font-awesome-icon icon="door-open"/>
                            Rekam Penyelesaian
                        </b-button>

                        <!-- refresh -->
                        <b-button size="sm" variant="success" class="shadow my-2" @click="loadEntryManifest">
                            <font-awesome-icon icon="sync"/>
                            Refresh
                        </b-button>
                    </div>
                </div>
            </b-card-header>

            <!-- Footer, only for some tab -->
            <template #footer v-if="dataAwb.pencacahan && tabId == 1">
                <template>
                    <!-- save pencacahan -->
                    <b-button 
                        variant="warning" 
                        :disabled="dataAwb.pencacahan.data.is_locked"
                        @click="updatePencacahan">
                        <font-awesome-icon icon="save"/>
                        Simpan Pencacahan
                    </b-button>

                    <!-- save pencacahan -->
                    <b-button 
                        
                        to="/hawb?show_bc11=false&show_bcp=true&filter=siap_pencacahan&title=Browse%20AWB%20Belum%20Cacah"
                        >
                        <font-awesome-icon icon="boxes"/>
                        Cacah Barang Lain
                    </b-button>

                </template>
            </template>

            <!-- Body, use tabs -->
            <b-tabs card lazy v-model="tabId">
                <!-- Header -->
                <b-tab title="Header" :active="activeTab == 'header'">
                    <entry-manifest-contents
                    v-if="dataAwb"
                    :data="dataAwb"
                    :disabled="true"
                    />
                </b-tab>

                <!-- Pencacahan -->
                <b-tab title="Pencacahan" :active="activeTab == 'pencacahan'" v-if="dataAwb.pencacahan">
                    <pencacahan-contents
                    :data="dataAwb.pencacahan.data"
                    :disabled="dataAwb.pencacahan.data.is_locked"
                    />
                </b-tab>

                <!-- Lampiran -->
                <b-tab title="Lampiran" :active="activeTab == 'lampiran'" v-if="dataAwb.lampiran">
                    <attachment-bucket
                        show
                        :endpoint="`/awb/${dataAwb.id}/lampiran`"
                        :disabled="dataAwb.is_locked"
                        :title="`Lampiran AWB ${dataAwb.hawb}`"
                    />
                </b-tab>

                <!-- Status -->
                <b-tab title="Status" :active="activeTab == 'status'">
                    <status-timeline v-if="dataAwb.status" :data="dataAwb.status.data"/>
                </b-tab>

                <!-- Tracking -->
                <b-tab title="Tracking" :active="activeTab == 'tracking'">
                    <tracking-timeline v-if="dataAwb.tracking" :data="dataAwb.tracking.data"/>
                </b-tab>

                <!-- Penyelesaian -->
                <b-tab title="Penyelesaian" :active="activeTab == 'penyelesaian'" v-if="dataAwb.penyelesaian && dataAwb.penyelesaian.data.length">
                    <penyelesaian-contents :data="dataAwb.penyelesaian.data[0]"/>
                </b-tab>

                <!-- PNBP -->
                <b-tab title="PNBP" :active="activeTab == 'pnbp'" v-if="dataAwb.pnbp">
                    <pnbp-contents :mockupMode="false" :dataPnbp="dataAwb.pnbp.data"/>
                    <hr>
                    <attachment-bucket
                        show
                        :endpoint="`/pnbp/${dataAwb.pnbp.data.id}/lampiran`"
                        disabled
                        :title="`Lampiran PNBP #${dataAwb.pnbp.data.id}`"
                    />
                </b-tab>

            </b-tabs>
        </b-card>

        <!-- modal dialog penyelesaian -->
        <modal-dialog-penyelesaian
            :dataId="id"
            ref="modalPenyelesaian"
            id="dialog-penyelesaian"
            centered
            size="lg"
            @store-penyelesaian="storePenyelesaian"
        />
    </div>
</template>

<script>
import DocBanner from '@/components/DocBanner'
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import userChecker from '../mixins/userChecker'

import EntryManifestContents from '@/components/EntryManifestContents'

import PencacahanContents from '@/components/PencacahanContents'

import AttachmentBucket from '@/components/AttachmentBucket'

import StatusTimeline from '@/components/StatusTimeline'

import TrackingTimeline from '@/components/TrackingTimeline'

import ModalDialogPenyelesaian from '@/components/ModalDialogPenyelesaian'

import PenyelesaianContents from '../components/PenyelesaianContents'

import PnbpContents from '../components/PnbpContents'

export default {
    mixins: [
        axiosErrorHandler,
        userChecker
    ],

    components: {
        DocBanner,
        EntryManifestContents,
        PencacahanContents,
        AttachmentBucket,
        StatusTimeline,
        TrackingTimeline,
        ModalDialogPenyelesaian,
        PenyelesaianContents,
        PnbpContents
    },

    props: {
        id: {
            type: [Number,String],
            required: true
        }
    },

    data () {
        return {
            dataAwb: {
                id: this.id
            },
            tabId: null
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        loadEntryManifest() {
            // load current id
            this.setBusyState(true)
            this.api.getAwbById(this.id, {
                include: 'status.detail.linkable'
            })
            .then(e => {
                this.setBusyState(false)
                this.dataAwb = e.data.data
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        },

        // update data pencacahan
        updatePencacahan() {
            // call backend
            this.setBusyState(true)
            this.api.putEndpoint(`/awb/${this.id}/pencacahan`, this.dataAwb.pencacahan.data)
            .then(e => {
                // success
                this.setBusyState(false)
                // toast
                this.showToast('Success', 'Data Pencacahan berhasil diupdate', 'success')
                // reload
                this.$nextTick(() => {
                    this.loadEntryManifest()
                })
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        },

        async rollbackGateIn() {
            var result = await this.$bvModal.msgBoxConfirm(
                `Yakin mau rollback Gate In #${this.dataAwb.hawb || this.dataAwb.mawb}?`, {
                    title: `Rollback Gate In`,
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

            if (result) {
                // just delete rollback, and refresh
                this.setBusyState(true)

                this.api.rollbackGateInAwb(this.dataAwb.id)
                .then(e => {
                    this.setBusyState(false)
                    this.$nextTick(() => {
                        this.loadEntryManifest()
                    })
                })
                .catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)
                })
            }
        },

        storePenyelesaian(data) {
            this.setBusyState(true)

            this.api.storePenyelesaian(this.id, data)
            .then(e => {
                this.setBusyState(false)
                this.$bvModal.hide('dialog-penyelesaian')
                this.$nextTick(() => {
                    // close modal and reload
                    this.loadEntryManifest()
                })
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        }
    },

    computed: {
        ...mapGetters(['api']),

        // get active tab from query string
        activeTab() {
            return this.$route.query.tab || 'header'
        },

        isLocked() {
            return this.dataAwb.is_locked
        }
    },

    watch: {
        id: {
            immediate: true,
            handler(newVal) {
                // console.log("Should do loading here...")
                // // log route
                // console.log(this.$route)
                this.loadEntryManifest()
            }
        }
    }
}
</script>