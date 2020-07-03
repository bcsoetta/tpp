<template>
    <b-container>
        <div>
            <b-card no-body style="max-width: 540px" class="mt-2 mt-md-5 mx-auto">
                <b-row no-gutters>
                    <b-col md="6" sm="0">
                        <p style="font-size: 10em; text-align: center" class="d-none d-md-block">
                            :(
                        </p>
                    </b-col>
                    <b-col md="6" sm="12">
                        <b-card-body
                            title="404 Page Not Found">
                            <b-card-text>
                                Halaman yang dimaksud tidak ditemukan :'(
                            </b-card-text>
                            <b-button variant="primary" to="/" @click="setBusy" :disabled="busy">
                                <span v-if="busy">
                                    Redirecting... <b-spinner small variant="light"></b-spinner>
                                </span>
                                <span v-else>
                                    Kembali ke Home
                                </span>
                            </b-button>
                        </b-card-body>
                    </b-col>
                </b-row>
            </b-card>
        </div>
    </b-container>
</template>

<script>
export default {
    name: 'PageNotFound',
    data () {
        return {
            busy: false
        }
    },
    methods: {
        setBusy () {
            this.busy = true
            // alert('busy...')
        }
    }
}
</script>