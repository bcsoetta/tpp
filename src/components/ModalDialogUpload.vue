<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        :visible="value"
        header-bg-variant="light"
        size="xl"
        
        :title="title"
        @change="e => $emit('input', e)">

        <!-- default footer -->
        <template #modal-footer="{ok}">
            <b-button @click="ok" size="sm" variant="primary">
                <font-awesome-icon icon="sync" />
                Close N Sync
            </b-button>
        </template>

        <b-row>
            <b-col md="5" sm="12">
                <b-form-group
                    label="Tambah lampiran"
                    description="by browsing images or pdfs for attachments">
                    <file-reader
                        @load="onLoad"
                        @error="onFileError">
                    </file-reader>
                </b-form-group>
            </b-col>

            <b-col md="2" sm="0" class="d-none d-md-block">
                Atau
            </b-col>

            <b-col md="5" sm="12">
                <b-form-group
                    label="Gunakan Webcam"
                    description="by snapping a photo using webcam">
                    <!-- webcam button -->
                    <b-button variant="info" @click="showWebcamDialog = true">
                        <font-awesome-icon icon="camera"/>
                        Open Webcam
                    </b-button>
                </b-form-group>
            </b-col>
        </b-row>

        <hr>

        <!-- here goes list of attachments -->
        <h5>Recent uploads</h5>

        <b-alert v-if="!attachments.length" variant="info" show>
            No recent uploads
        </b-alert>
        <div v-else class="text-center p-2 rounded drop-area">
            <attachment-handler
                v-for="(a, id) in attachments"
                :key="a.filename"
                :upload-data="a"
                :endpoint="endpoint"
                @error="removeAttachment(id, $event)"
                @synchronize="removeAttachment(id, $event)"
                >
            </attachment-handler>
        </div>

        <!-- Webcam Dialog -->
        <modal-dialog-webcam
            v-model="showWebcamDialog"
            @upload="handleWebcamUpload"
            />

    </b-modal>
</template>

<script>
import AttachmentHandler from '@/components/AttachmentHandler'
import FileReader from '@/components/FileReader'
import ModalDialogWebcam from '@/components/ModalDialogWebcam'

import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    // do not inherit attrs so we can put $attrs on component that we do care about
    inheritAttrs: false,

    // mixins
    mixins: [axiosErrorHandler],

    // list of components
    components: {
        AttachmentHandler,
        FileReader,
        ModalDialogWebcam
    },

    // available props
    props: {
        endpoint: {
            type: String,
            default: null
        },

        title: {
            type: String,
            default: "Upload Attachment"
        },

        value: {
            type: [Boolean,Number,String],
            required: true
        }
    },

    // default data
    data () {
        return {
            attachments: [],    // always start with empty list of attachments
            showWebcamDialog: false
        }
    },

    // methods
    methods: {
        // when loading file
        onLoad (e) {
            // simply push to attachment list
            this.attachments.push(e)
        },

        // handle file error
        onFileError (e) {
            alert(e.message)
        },

        // remove attachment in case of error
        removeAttachment(id, e) {
            // find the id, and remove it
            if (id > -1 && id < this.attachments.length) {
                var removed = this.attachments.splice(id, 1)
            }
            // alert(`to remove: ${id}`)
            console.log('post removal:')
            console.log(this.attachments)

            console.log(e)

            this.handleError(e)
            
        },

        // clean all data
        cleanup() {
            while (this.attachments.length)
                this.attachments.pop()
        },

        // handle webcam upload
        handleWebcamUpload (data) {
            console.log('got webcam data: ', data)
            this.attachments.push(data)
        }
    },

    // watchers
    watch: {
        value: {
            immediate: true,
            handler: function (newVal, oldVal) {
                // if we're closing, trigger synchronize
                if (!newVal && oldVal) {
                    this.cleanup()
                    this.$emit('synchronize')
                }
            }
        }
    }
}
</script>

<style scoped>
.drop-area {
    border: 2px dashed black;
}
</style>