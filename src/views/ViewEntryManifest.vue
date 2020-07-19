<template>
    <div>
        <b-card no-body class="rounded shadow">
            <!-- HEADER -->
            <b-card-header>
                <div class="d-sm-block d-md-flex my-2">
                    <doc-banner doctype="Entry Manifest" :data="dataAwb" :is-new="false"/>

                    <!-- some controls here? -->
                    <div class="flex-grow-1 text-right">
                        <b-button size="sm" variant="success" class="shadow my-2" @click="loadEntryManifest">
                            Refresh
                        </b-button>
                    </div>
                </div>
            </b-card-header>

            <!-- Footer, only for some tab -->
            <template #footer v-if="dataAwb.pencacahan">
                <template v-if="dataAwb.pencacahan && tabId == 1">
                    <b-button 
                        variant="warning" 
                        :disabled="dataAwb.pencacahan.data.is_locked"
                        @click="updatePencacahan">
                        <font-awesome-icon icon="save"/>
                        Simpan Pencacahan
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
                    :disabled="dataAwb.is_locked"
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
                    track it up
                </b-tab>

            </b-tabs>
        </b-card>
    </div>
</template>

<script>
import DocBanner from '@/components/DocBanner'
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

import EntryManifestContents from '@/components/EntryManifestContents'

import PencacahanContents from '@/components/PencacahanContents'

import AttachmentBucket from '@/components/AttachmentBucket'

import StatusTimeline from '@/components/StatusTimeline'

export default {
    mixins: [
        axiosErrorHandler,
    ],

    components: {
        DocBanner,
        EntryManifestContents,
        PencacahanContents,
        AttachmentBucket,
        StatusTimeline
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
        }
    },

    computed: {
        ...mapGetters(['api']),

        // get active tab from query string
        activeTab() {
            return this.$route.query.tab || 'header'
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