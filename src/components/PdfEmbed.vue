<template>
    <!-- embed pdf -->
    <object
        type="application/pdf"
        width="100%"
        height="500px"
        :data="url">
        <embed
            type="application/pdf"
            :src="url">

        Browser was either not support embed viewing, or it was set not to. <a :href="urlWithFile" class="btn btn-primary">Download the pdf</a> here!
    </object>
</template>

<script>
export default {
    inheritAttrs: false,

    props: {
        url: {
            type: String,
            default: null
        },

        altFilename: {
            type: String,
            default: 'pdf.pdf'
        }
    },

    computed: {
        urlWithFile () {
            return this.url + '&filename=' + this.altFilename
        }
    }
}
</script>