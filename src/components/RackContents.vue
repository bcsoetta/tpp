<template>
    <div v-if="data">
        <b-row>
            <!-- kode -->
            <b-col md="6">
                <b-form-group label="Kode" description="harus unik, formatnya: X## (karakter diikuti dua digit), misal X03">
                    <b-form-input v-model="data.kode" :disabled="disabled"/>
                </b-form-group>
            </b-col>
            <!-- visual data -->
            <b-col md="6">
                <!-- x -->
                <b-row>
                    <b-col>
                        <b-form-group label="X">
                            <b-form-input v-model="data.x" :disabled="disabled"/>
                        </b-form-group>
                    </b-col>
                </b-row>
                <!-- y -->
                <b-row>
                    <b-col>
                        <b-form-group label="Y">
                            <b-form-input v-model="data.y" :disabled="disabled"/>
                        </b-form-group>
                    </b-col>
                </b-row>
                <!-- w -->
                <b-row>
                    <b-col>
                        <b-form-group label="W">
                            <b-form-input v-model="data.w" :disabled="disabled"/>
                        </b-form-group>
                    </b-col>
                </b-row>
                <!-- h -->
                <b-row>
                    <b-col>
                        <b-form-group label="H">
                            <b-form-input v-model="data.h" :disabled="disabled"/>
                        </b-form-group>
                    </b-col>
                </b-row>
                <!-- x -->
                <b-row>
                    <b-col>
                        <b-form-group label="Rotation" description="in degrees">
                            <b-form-input v-model="data.rot" :disabled="disabled"/>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    props: {
        data: Object,
        disabled: Boolean
    }
}
</script>