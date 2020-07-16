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

            <!-- Body, use tabs -->
            <b-tabs card lazy>
                <!-- Header -->
                <b-tab title="Header" :active="activeTab == 'header'">
                    <entry-manifest-contents
                    v-if="dataAwb"
                    :data="dataAwb"
                    />
                </b-tab>

                <!-- Pencacahan -->
                <b-tab title="Pencacahan" :active="activeTab == 'pencacahan'" v-if="dataAwb.pencacahan">
                    some mundane shit here
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

export default {
    mixins: [
        axiosErrorHandler,
    ],

    components: {
        DocBanner,
        EntryManifestContents
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
            }
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        loadEntryManifest() {
            // load current id
            this.setBusyState(true)
            this.api.getAwbById(this.id)
            .then(e => {
                this.setBusyState(false)
                this.dataAwb = e.data.data
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