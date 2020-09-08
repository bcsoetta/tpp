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
    <!-- DATA ST -->
    
    <!-- <b-row> -->
      <!-- nomor + tgl -->
      <!-- <b-col md="8">
        <b-form-group label="Nomor Surat Tugas">
          <b-form-input 
          :disabled="disabled" 
          v-model="data.nomor_st" 
          size="sm"
          />
        </b-form-group>
      </b-col> -->
      <!-- tanggal -->
      <!-- <b-col md="4">
          <b-form-group label="Tanggal">
            <datepicker 
            :disabled="disabled"
            v-model="data.tgl_st"
            size="sm"
            />
          </b-form-group>
      </b-col>
    </b-row> -->
    
    <b-row>
      <!-- pejabat info -->
      <b-col md="6">
        <b-form-group label="Pejabat">
          <select-user
            :disabled="disabled"
            v-model="data.pejabat.data.user_id"
            :initial-options="data.pejabat.data"
          />
        </b-form-group>
      </b-col>
      <!-- pelaksana info -->
      <b-col md="6">
        <b-form-group label="Pelaksana">
          <!-- <pre>{{ data.pelaksana.data }}</pre> -->
          <select-user 
            v-for="pelaksana in data.pelaksana.data"
            :key="pelaksana.user_id"
            v-model="pelaksana.user_id"
            :initial-options="data.pelaksana.data"
            :disabled="disabled"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <!-- another to show details -->
    <hr>
    <b-row>
      <!-- List penetapan -->
      <b-col md="6">
        <b-form-group label="Surat Penetapan">
          <b-table
            small
            head-variant="dark"
            bordered
            striped
            hover
            class="shadow"
            :fields="penetapanFields"
            :items="data.penetapan.data"
            responsive="sm"
          />
        </b-form-group>
      </b-col>

      <!-- List BAST -->
      <b-col md="6">
        <b-form-group label="Berita Acara Serah Terima">
          <b-table
              small
              head-variant="dark"
              table-class="shadow"
              bordered
              striped
              hover
              :fields="bastFields"
              :items="data.bast.data"
              responsive="sm"
            />
        </b-form-group>
      </b-col>
    </b-row>
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
  },

  computed: {
    penetapanFields() {
      return [
        { key: 'nomor_lengkap', class: 'text-center' },
        { key: 'tgl_dok', class: 'text-center' }
      ]
    },

    bastFields() {
      return [
        { key: 'nomor_lengkap', class: 'text-center' },
        { key: 'tgl_dok', class: 'text-center' }
      ]
    }
  }
};
</script>