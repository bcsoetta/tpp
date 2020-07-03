<template>
    <span v-if="iconType == 'fa'" >
        <font-awesome-icon :icon="iconName" />
    </span>
    <span v-else v-html="iconName"></span>
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
            required: true
        }
    },

    computed: {
        iconType () {
            console.log("Determining icon type: ", this.icon)
            if (this.icon.search('fa-') !== -1) {
                console.log('icon type: fa')
                return "fa"
            } else {
                console.log('icon type: raw')
                return "raw"
            }
        },

        iconName () {
            if (this.iconType == 'fa') {
                return this.icon.replace(/fa-/i, '')
            }
            return this.icon
        }
    }
}
</script>