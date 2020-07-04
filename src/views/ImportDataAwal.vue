<template>
  <div>
    <b-form-group description="Ukuran file max 16 Mb">
      <template #label>
        Browse File Excel (
        <a href="/static/assets/contoh-data-awal-gudang.xlsx">Contoh File Excel</a>)
      </template>
      <!-- body -->
      <b-form-file
        v-model="excelFile"
        size="sm"
        :state="Boolean(excelFile)"
        placeholder="Pilih/Drop file excel di sini..."
        drop-placeholder="Drop file excel di sini..."
        accept=".xls, .xlsx"
        :disabled="busy"
      />
      <!-- {{ tableReady }} -->
    </b-form-group>
    <!-- progress bar -->
    <b-progress
      v-if="busy"
      :max="100"
      show-progress
      variant="danger"
      animated
      striped
      class="shadow border border-dark"
      height="1.5rem"
    >
      <b-progress-bar :value="uploading" :label="`Uploading: ${uploading.toFixed(2)} %`" />
    </b-progress>

    <b-button
      size="sm"
      class="shadow"
      v-if="result"
      variant="primary"
      v-b-modal.modal-data-awal
    >Show Data</b-button>

    <b-button
      size="sm"
      class="shadow"
      v-if="result"
      variant="danger"
      @click="result = null"
    >Clear Data</b-button>

    <!-- Table processing indicator -->
    <div v-if="!busy && excelFile">
      <hr />
      <!-- show spinner while table is being prepared? -->
      <b-alert variant="warning" :show="!tableReady" class="text-center">
        <b-spinner small />Preparing table
        <b-spinner small />
      </b-alert>
    </div>

    <!-- Wrap it in a modal? -->
    <b-modal
      id="modal-data-awal"
      header-bg-variant="light"
      footer-bg-variant="light"
      v-model="showModal"
      size="xl"
      dialog-class="fullscreen"
      scrollable
    >
      <!-- MODAL HEADER -->
      <template #modal-header>
        <h5>
          <font-awesome-icon icon="file-excel" />
          Import Data Awal (Excel) | Rows: {{ result.length }}
        </h5>

        
        <b-form-group label="TPS Asal" label-cols-md="4" style="min-width: 240px">
          <b-form-select >
            <option value="2">Some shit</option>
            <option value="3">Some Other shit</option>
          </b-form-select>
        </b-form-group>
      </template>

      <!-- MODAL FOOTER -->
      <template #modal-footer="{ cancel }">
        <b-button variant="danger" size="sm" @click="cancel">
          <font-awesome-icon icon="times"/>
          Cancel
        </b-button>
        <b-button variant="primary" size="sm" @click="cancel">
          <font-awesome-icon icon="save"/>
          Upload
        </b-button>
      </template>

      <div v-if="result">
        <table-data-awal :items="result" @delete="handleDelete"/>

        <!-- <pre>{{ JSON.stringify(result, null, 2) }}</pre> -->
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axiosErrorHandler from "../mixins/axiosErrorHandler";

import TableDataAwal from "@/components/TableDataAwal";

export default {
  mixins: [axiosErrorHandler],

  components: {
    TableDataAwal
  },

  data() {
    return {
      excelFile: null,
      uploading: 0,
      result: null,
      tableReady: false,
      showAlert: false,
      showModal: false
    };
  },

  methods: {
    async handleDelete (idx) {
      if (this.result) {
        var answer = await this.$bvModal.msgBoxConfirm(
          `Yakin mau menghapus baris #${idx+1}?`,
          {
            title: 'Konfirmasi',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            centered: true
          }
        )

        if (answer)
          this.result.splice(idx, 1)
      }
    }
  },

  computed: {
    ...mapGetters(["api"]),

    busy() {
      return this.uploading > 0 && this.uploading < 100;
    }
  },

  watch: {
    excelFile: {
      handler(nv) {
        if (nv) {
          this.uploading = 1;
          this.tableReady = false;
          this.result = null;
          this.showAlert = false;
          // call the api?
          this.api
            .attachRawFileToUri("/excel/dataawal", this.excelFile, e => {
              this.uploading = Math.round((e.loaded * 100) / e.total);
            })
            .then(e => {
              this.showModal = true;
              this.showAlert = true;
              this.result = e.data.data;
              console.log(e.data);

              // remove file and set to 0
              this.excelFile = null;
              this.uploading = 0;
            })
            .catch(e => {
              this.handleError(e);
              // remove file and set to 0
              this.excelFile = null;
              this.uploading = 0;
            });
        }
      }
    }
  }
};
</script>
