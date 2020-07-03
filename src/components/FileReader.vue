<template>
    <b-form-file
        v-model="tempFile"
        drop-placeholder="Drop here!"
        accept="application/pdf, image/*, application/json"
        
        v-bind="$attrs"
        v-on="$listeners"
        :disabled="isReading">
    </b-form-file>
</template>

<script>
/**
 * FileUploader.vue
 * definition for file uploading data
 */
export default {
    inheritAttrs: false,

    data () {
        return {
            tempFile: null,
            result: null,
            isReading: false
        }
    },

    props: {
        value: {
            type: Object,
            default: null
        }
    },

    watch: {
        tempFile: {
            handler (nv, ov) {
                if (nv) {
                    this.isReading = true

                    const reader = new FileReader();
                    reader.readAsDataURL(nv)
                    // reader.readAsBinaryString(nv)
                    // reader.readAsArrayBuffer(nv)
                    reader.onload = () => { 
                            // build upload data now
                            this.result = {
                                filename: nv.name,
                                type: nv.type,
                                filesize: nv.size,
                                blob: reader.result,
                                blobsize: reader.result.length
                            }
                            // console.log(reader.result)

                            // raise load event
                            this.$emit('load', this.result)

                            // flag not reading
                            this.isReading = false

                            // reset to null
                            this.tempFile = null
                            this.result = null
                    }
                    reader.onerror = () => { 
                        // raise error event
                        this.$emit('error', reader.error)

                        // flag not reading again
                        this.isReading = false
                    }

                    // console.log(nv)
                }
            }
        }
    }
}
</script>
