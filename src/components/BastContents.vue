<template>
  <div>
    <b-row>
      <!-- nomor + tgl -->
      <b-col md="8">
        <b-form-group label="Nomor Berita Acara">
          <b-form-input 
          :disabled="disabled" 
          v-model="data.nomor_lengkap" 
          size="sm"
          />
        </b-form-group>
      </b-col>
      <!-- tanggal -->
      <b-col md="4">
          <b-form-group label="Tanggal">
            <datepicker 
            :disabled="disabled"
            v-model="data.tgl_dok"
            size="sm"
            />
          </b-form-group>
      </b-col>
    </b-row>
    <!-- pejabat info -->
    <b-row>
      <b-col md="6">
        <b-form-group label="Petugas">
          <select-user
            :disabled="disabled"
            v-model="data.petugas.data.user_id"
            :initial-options="data.petugas.data"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <!-- another to show details -->
  </div>
</template>

<script>
import Datepicker from "@/components/Datepicker";
import SelectUser from "@/components/SelectUser";

export default {
  components: {
    Datepicker,
    SelectUser
  },

  props: {
    data: {
      type: Object,
      required: true
    },

    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>