<template>
  <div>
    <b-row>
      <!-- nomor + tgl -->
      <b-col md="8">
        <b-form-group label="Nomor Surat Penetapan">
          <b-form-input 
          :disabled="disabled" 
          v-model="data.nomor_lengkap" 
          size="sm"
          />
        </b-form-group>
      </b-col>
      <!-- tanggal -->
      <b-col md="4">
          <b-form-group label="Tanggal Surat">
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
        <b-form-group label="Pejabat Penetapan">
          <select-user
            :disabled="disabled"
            v-model="data.pejabat.data.user_id"
            :initial-options="data.pejabat.data"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <!-- another to show details -->
    <div>
        <b-alert show variant="primary" class="d-inline-block">
            Total AWB <b-badge>{{ data.total_gate_in }}</b-badge>
        </b-alert>
        <b-alert show variant="success" class="d-inline-block">
            Sudah Gate In <b-badge>{{ data.total_gate_in }}</b-badge>
        </b-alert>
        <b-alert show variant="danger" class="d-inline-block">
            Belum Gate In <b-badge>{{ data.total_belum_gate_in }}</b-badge>
        </b-alert>
    </div>
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