<template>
    <p>{{ text }}</p>
</template>

<script>
export default {
    name: 'side-nav-section',
    props: {
        text: {
            type: String,
            default: null
        }
    }
}
</script>