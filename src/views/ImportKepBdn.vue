<template>
  <div>
    <b-form-group description="Ukuran file max 16 Mb">
      <template #label>
        Browse File Excel (<a href="/static/assets/contoh-format-kep-bdn.xlsx">Contoh File Excel</a>)
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
          Import Data Kep BDN (Excel) | Rows: {{ result.length }}
        </h5>

        <!-- <div style="min-width: 500px" >
            <b-form-group label="TPS Asal" label-cols="2">
            <select-tps
                v-model="kode_gudang"
                :reduce="e => e.kode"
            />
            </b-form-group>
        </div> -->
      </template>

      <!-- MODAL FOOTER -->
      <template #modal-footer="{ cancel }">
        <b-button variant="danger" size="sm" @click="cancel">
          <font-awesome-icon icon="times"/>
          Cancel
        </b-button>
        <b-button variant="primary" size="sm" @click="handleUpload">
          <font-awesome-icon icon="save"/>
          Upload
        </b-button>
      </template>

      <div v-if="result">
        <!-- show nomor surat lengkap + tanggal, and who signed it -->
        <b-row>
          <!-- nomor -->
          <b-col md="6">
            <b-form-group label="Nomor Kep penetapan" description="nomor kep lengkap, e.g. KEP-XXX/KPU.03/BD.0301/2020">
              <b-form-input
                size="sm"
                v-model="no_kep"
                :debounce="1000"
              />
            </b-form-group>
          </b-col>
          <!-- Tanggal -->
          <b-col md="2">
            <b-form-group label="Tanggal Kep">
              <datepicker
                size="sm"
                v-model="tgl_kep"
                style="width: 128px"
              />
            </b-form-group>
          </b-col>
          <!-- SelectUser -->
          <b-col md="4">
            <b-form-group label="Pejabat Penetapan">
              <select-user 
              v-model="pejabat_id_kep"
              search-on-empty
              role="tpp.kep_maker"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- show tables of them -->
        <table-data-awal 
          :items="result" 
          @delete="handleDelete"
          hideDataBc11
          :prependFields="bcpFields"
        >
          <!-- render no bcp -->
          <template #cell(no_bcp)="row">
            <b-form-input
              size="sm"
              v-model="row.item.bcp.data.nomor_lengkap"
              class="text-center"
            />
          </template>

          <!-- render tgl bcp -->
          <template #cell(tgl_bcp)="row">
            <datepicker
              size="sm"
              v-model="row.item.bcp.data.tgl_dok"
              style="width: 130px; text-align:center;"
            />
          </template>
        </table-data-awal>

        <!-- <pre>{{ JSON.stringify(result, null, 2) }}</pre> -->
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axiosErrorHandler from "../mixins/axiosErrorHandler";

import TableDataAwal from "@/components/TableDataAwal";
// import SelectTps from '@/components/SelectTps'
import Datepicker from '@/components/Datepicker'
import SelectUser from '@/components/SelectUser'

export default {
  mixins: [axiosErrorHandler],

  components: {
    TableDataAwal,
    // SelectTps
    Datepicker,
    SelectUser
  },

  data() {
    return {
      excelFile: null,
      uploading: 0,

      result: null,
      // kode_gudang: null,
      no_kep: null,
      tgl_kep: null,
      pejabat_id_kep: null,

      tableReady: false,
      showAlert: false,
      showModal: false
    };
  },

  methods: {
      ...mapMutations(['setBusyState']),

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
    },

    handleUpload () {
        // gotta check if everything is set
        /* if (!this.kode_gudang) {
            this.showToast('Error', 'Kode Gudang belum dipilih!', 'danger')
            return
        } */

        if (!this.result || !this.result.length) {
            this.showToast('Error', 'belum ada data excel yang diimport', 'danger')
            return
        }

        this.showToast('Uploading...', `Uploading ${this.result.length} entries...` , 'info')

        // test
        this.setBusyState(true)
        // this.showModal = false

        const vm = this

        vm.api.storeAwb({
          nomor_lengkap_dok : vm.no_kep,
          tgl_dok : vm.tgl_kep,
          pejabat_id : vm.pejabat_id_kep,
          entry_manifest: vm.result 
        }, {
          source: 'kep-bdn'
        })
        .then(e => {
          vm.setBusyState(false)
          vm.showToast('Uploaded', `${e.data.inserted} data uploaded!`, 'success')

          vm.$bvModal.hide('modal-data-awal')
        })
        .catch(e => {
          vm.setBusyState(false)
          vm.handleError(e)
        })

        /* setTimeout(() => {
            vm.setBusyState(false)
            vm.showToast('Uploaded', `${this.result.length} data uploaded!`, 'success')
            
            vm.$bvModal.hide('modal-data-awal')

            this.$nextTick(() => {
                // vm.result = null
            })
            // vm.result = null
        },7000) */
    }
  },

  computed: {
    ...mapGetters(["api"]),

    busy() {
      return this.uploading > 0 && this.uploading < 100;
    },

    bcpFields() {
      return [
        { label: 'No BCP', key: 'no_bcp' },
        { label: 'Tgl', key: 'tgl_bcp' }
      ];
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
            .attachRawFileToUri("/excel/kepbdn", this.excelFile, e => {
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
