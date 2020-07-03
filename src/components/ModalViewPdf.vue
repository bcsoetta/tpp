<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        :visible="value"
        header-bg-variant="light"
        size="xl"
        centered
        hide-footer
        :title="title"
        @change="e => $emit('input', e)">

        <pdf-embed :url="url" :alt-filename="altFilename"></pdf-embed>

    </b-modal>
</template>

<script>
import PdfEmbed from '@/components/PdfEmbed'

export default {
    inheritAttrs: false,

    components: {
        PdfEmbed
    },

    props: {
        url: {
            type: String,
            default: null
        },

        title: {
            type: String,
            default: "PDF Viewer"
        },

        altFilename: {
            type: String
        },

        value: {
            type: [Boolean,Number,String],
            required: true
        }
    }
}
</script>