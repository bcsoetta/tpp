<template>
    <b-card
        no-body>
        <!-- Title containing sync button -->
        <template #header>
            <h5 class="mb-0 d-inline">{{ title }}</h5>
            <div class="float-right d-inline-block">
                <!-- synchronizing indicator -->
                
                <template v-if="busy">
                    
                        <em>synchronizing</em> 
                        <div class="d-inline-block shadow-sm" style="width: 128px; vertical-align: middle">
                            <b-progress :value="100" variant="warning" striped animated></b-progress>
                        </div>
                    
                </template>

                <!-- toggle show/hide -->
                <b-button variant="dark" size="sm" class="mx-2 shadow-sm" 
                    @click="showAttachments = !showAttachments"
                    >
                    <font-awesome-icon :icon="showAttachments ? 'eye-slash' : 'eye'"/>
                </b-button>
                <!-- open upload dialog -->
                <b-button variant="primary" size="sm" :disabled="!canUpload" class="shadow-sm" @click="if (canUpload) showUploadDialog = true">
                    <font-awesome-icon icon="plus-square"/>
                    Upload
                </b-button>
                <!-- force sync -->
                <b-button variant="primary" size="sm" @click="synchronize" class="shadow-sm">
                    <font-awesome-icon icon="sync"/>
                    Sync
                </b-button>
            </div>
        </template>

        <!-- The body just contains the attachments -->
        <transition name="fade">
        <b-card-body v-if="showAttachments" class="position-relative text-center">
            <template v-if="attachments.length">
                <b-row>
                    <b-col md="3" v-for="(data) in attachments" :key="data.id" class="align-middle">
                        <attachment-handler
                            :key="data.id"
                            :initial-data="data"
                            :deletable="!disabled"
                            @synchronize="synchronize">
                        </attachment-handler>
                    </b-col>
                </b-row>
            </template>
            <b-alert v-else variant="warning" show class="text-left">
                No attachments detected
            </b-alert>

            <!-- blocker -->
            <transition name="fade">
            <div class="position-absolute blocker" v-if="busy">
                
            </div>
            </transition>
        </b-card-body>
        </transition>

        <modal-dialog-upload 
            :endpoint="endpoint"
            v-model="showUploadDialog"
            @synchronize="synchronize"
            />
    </b-card>
</template>

<script>
import AttachmentHandler from '@/components/AttachmentHandler'
import ModalDialogUpload from '@/components/ModalDialogUpload'
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

const cloneDeep = require('clone-deep')

export default {
    mixins: [axiosErrorHandler],

    components: {
        AttachmentHandler,
        ModalDialogUpload
    },

    props: {
        title: {
            type: String,
            default: 'Attachments'
        },

        endpoint: {
            type: String,
            default: null
        },

        initialData: {
            type: Array
        },

        show: {
            type: Boolean,
            default: false
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            attachments: this.initialData ? cloneDeep(this.initialData) : [], // empty initially
            showAttachments: this.show,
            showUploadDialog: false,
            busy: false
        }
    },

    computed: {
        ...mapGetters(['api']),

        canUpload () {
            console.log('disabled ?', this.disabled)
            console.log('endpoint = ', this.endpoint)
            return !this.disabled && this.endpoint != null
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        synchronize () {
            // gotta check if targetUrl is there

            if (!this.endpoint) {
                // no url supplied, so just emit sync event
                this.$emit('synchronize')
                return
            }

            // do the thing (call the API)
            this.setBusyState(true)
            
            // call api
            this.api.getEndpoint(this.endpoint)
            .then(e => {
                this.attachments = e.data.data

                this.setBusyState(false)
            })
            .catch(e => {
                this.handleError(e)

                this.setBusyState(false)
            })

        },

        // additional method so can be manipulated from outside
        setBusyState (flag) {
            this.busy = flag
        }
    },

    // watchers
    watch: {
        endpoint: {
            immediate: true,
            handler: function (val) {
                if (val) {
                    this.synchronize()
                }
            }
        }
    }
}
</script>

<style scoped>
.blocker {
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: inline-block;
}
</style>