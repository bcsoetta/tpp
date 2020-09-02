<template>
  <div>
    <paginated-browser ref="browser" :data-callback="fetchPenetapan">
      <template #default="{ data, pagination }">
        <!-- put a table in the middle -->
        <b-table
          :fields="fields"
          :items="data"
          head-variant="dark"
          small
          striped
          hover
          responsive="sm"
          bordered
          class="shadow"
          
        >
          <!-- pejabat -->
          <template #cell(pejabat)="row">
            <div>{{ row.item.pejabat.data.name }}</div>
            <div>{{ row.item.pejabat.data.nip }}</div>
          </template>

          <!-- jenis -->
          <template #cell(jenis)="{ value }">
            <div class="text-center">
              <b-badge :variant="value=='KEP_BDN' ? 'danger' : 'info'">{{ value }}</b-badge>
            </div>
          </template>

          <!-- tps -->
          <template #cell(tps)="{ item }">
            <div v-if="item">
              <b-badge 
                :variant="badgeVariant(item.tps.data.kode)"
                v-b-tooltip.hover
                :title="item.tps.data.nama"
              >{{ item.tps.data.kode }}</b-badge>
            </div>
          </template>

          <!-- action -->
          <template #cell(act)="row">
            <div class="text-center">
              <!-- edit nomor surat (only when nomor surat is in specific pattern) -->
              <b-button
                size="sm"
                variant="warning"
                class="shadow"
                v-b-tooltip.hover 
                title="Edit Nomor dan Tanggal Surat (FIX)"
                v-if="isNomorSuratEditable(row.item)"
                @click="openModalEditSurat(row.item)"
              >
                <font-awesome-icon icon="pencil-alt"/>
              </b-button>

              <!-- open modal -->
              <b-button
                size="sm"
                variant="primary"
                class="shadow"
                v-b-tooltip.hover
                title="Lihat Detil Penetapan"
                @click="viewPenetapanDetail(row.item)"
              >
                <font-awesome-icon icon="eye" />
              </b-button>

              <!-- print -->
              <b-button
                :disabled="row.item.jenis != 'PENETAPAN_BTD'"
                size="sm"
                variant="dark"
                class="shadow"
                v-b-tooltip.hover
                title="Unduh Lampiran (Excel)"
                @click="downloadLampiranPenetapan(row.item)"
              >
                <font-awesome-icon icon="print" />
              </b-button>
            </div>
          </template>
        </b-table>
      </template>
    </paginated-browser>
    <!-- Modal to show detail? -->
    <b-modal
      id="modal-detail-penetapan"
      ref="modal"
      header-bg-variant="light"
      footer-bg-variant="light"
      size="xl"
      hide-footer
    >
      <!-- custom title? -->
      <template #modal-title v-if="detailShown">Detail Penetapan #{{ detailShown.id }}</template>
      <!-- custom body -->
      <template v-if="detailShown">
        <b-card no-body>
          <b-tabs card lazy>
            <b-tab title="Header" active>
              <penetapan-contents :data="detailShown" disabled />
            </b-tab>
            <b-tab :title="`AWB (${detailShown.total_entry_manifest})`">
              <penetapan-detail-contents :id="detailShown.id" :bdn-mode="detailShown.jenis=='KEP_BDN'"/>
            </b-tab>
          </b-tabs>
        </b-card>
      </template>
    </b-modal>

    <!-- modal utk edit nomo+tgl surat -->
    <b-modal
      id="nomor-surat"
      ref="modalNomorSurat"
      header-bg-variant="light"
      footer-bg-variant="light"
      centered
      title="Edit Nomor dan Tanggal Surat (FIX)"
    >
      <!-- nomor surat -->
      <b-form-group label="Nomor Surat Penetapan">
        <template #description>
          isi nomor surat lengkap (case insensitive). Harus diawali <strong>S-</strong> <em>atau</em> <strong>KEP-</strong>
        </template>

        <b-form-input 
          v-model="nomor_lengkap"
        />
      </b-form-group>

      <!-- tanggal surat -->
      <b-form-group label="Tanggal Surat Penetapan">
        <datepicker 
          v-model="tgl_dok"
          style="max-width: 150px"
        />
      </b-form-group>

      <!-- Simpan -->
      <template #modal-footer>
          <b-button
            size="sm"
            variant="primary"
            @click="editSuratPenetapan"
          >
            <font-awesome-icon icon="save"/>
            Simpan
          </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import axiosErrorHandler from "../mixins/axiosErrorHandler";
import niceties from '../mixins/niceties'

import { mapGetters, mapMutations } from "vuex";
import PaginatedBrowser from "@/components/PaginatedBrowser";
import PenetapanDetailContents from "@/components/PenetapanDetailContents";
import PenetapanContents from "@/components/PenetapanContents";
import Datepicker from '@/components/Datepicker'

const fileDownload = require('js-file-download');

export default {
  mixins: [axiosErrorHandler, niceties],

  components: {
    PaginatedBrowser,
    PenetapanDetailContents,
    PenetapanContents,
    Datepicker
  },

  data() {
    return {
      detailShown: null,

      nomor_lengkap: null,
      tgl_dok: null,
      edit_id: null
    };
  },

  methods: {
    ...mapMutations(["setBusyState"]),

    // query data penetapan
    fetchPenetapan(q, spinner, vm) {
      spinner(true);

      // call api
      this.api
        .getPenetapan(q)
        .then(e => {
          spinner(false);
          vm.setData(e.data.data);
          vm.setTotal(e.data.meta.pagination.total);
        })
        .catch(e => {
          spinner(false);
          this.handleError(e);
        });
    },

    // view detil penetapan
    viewPenetapanDetail(penetapan) {
      this.detailShown = penetapan;
      this.$refs.modal.show();
    },

    // download lampiran penetapan
    downloadLampiranPenetapan(penetapan) {
      this.setBusyState(true)
      this.api.downloadUri(`/penetapan/${penetapan.id}/excel`)
      .then(e => {
        this.setBusyState(false)
        const filename = penetapan.nomor_lengkap.replace('/\//gi', '-') + '.xlsx'
        fileDownload(e.data, filename)
      })
      .catch(e => {
        this.setBusyState(false)
        this.handleError(e)
      })
    },

    // cek apakah nomor surat bisa diedit
    isNomorSuratEditable(item) {
      return item.nomor_lengkap.match(/PENETAPAN\s-\s\d+/i)
    },

    // edit nomor surat
    openModalEditSurat(item) {
      this.nomor_lengkap = item.nomor_lengkap
      this.tgl_dok = item.tgl_dok
      this.edit_id = item.id
      // buka modal
      this.$nextTick(() => {
        this.$refs.modalNomorSurat.show()
      })
    },

    // panggil api
    editSuratPenetapan() {
      this.setBusyState(true)
      // go ahead
      this.api.editSuratPenetapan(this.edit_id, this.nomor_lengkap, this.tgl_dok)
      .then(e => {
        // success, tell them?
        this.setBusyState(false)
        // show toast and close modal
        this.showToast('Edit Success', `Nomor surat penetapan berhasil diubah ke ${this.nomor_lengkap} tanggal ${this.tgl_dok}`, 'success')
        // and refresh
        this.$nextTick(() => {
          this.$refs.modalNomorSurat.hide()
          this.$refs.browser.stayAtCurrentPage(0)
          // also, reset data
          this.edit_id = this.nomor_lengkap = this.tgl_dok = null
        })
      })
      .catch(e => {
        this.setBusyState(false)
        this.handleError(e)
      })
    }
  },

  computed: {
    ...mapGetters(["api"]),

    fields() {
      return [
        // { label: '', key: 'showDetails' },
        { key: "nomor_lengkap", class: "text-center" },
        { key: "tgl_dok", class: "text-center" },
        "jenis",
        {
          label: "Total AWB",
          key: "total_entry_manifest",
          class: "text-center"
        },
        { label: "Total Gate In", key: "total_gate_in", class: "text-center" },
        {
          label: "Total Belum Gate In",
          key: "total_belum_gate_in",
          class: "text-center"
        },

        "pejabat",
        { label: "TPS", key: "tps", class: "text-center" },
        {
          label: "",
          key: "act"
        }
      ];
    }
  }
};
</script>