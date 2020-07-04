<template>
  <div>
    <b-form-group label="Pilih TPS">
      <select-tps  
        v-model="kode"
        :reduce = "e => e.kode"
        class="w-50"
      />
    </b-form-group>
    <b-form-group label="TPS">
      <b-form-input v-model="kode"/>
    </b-form-group>
    <div>
      <pre>{{ kode }}</pre>
    </div>
  </div>
</template>

<script>
import SelectTps from '@/components/SelectTps'

export default {
  components: {
    SelectTps
  },

  data () {
    return {
      kode: null
    }
  }
}
</script>