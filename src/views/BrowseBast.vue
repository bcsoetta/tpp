<template>
  <div>
    <paginated-browser ref="browser" :data-callback="fetchBast">
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
          <template #cell(petugas)="row">
            <div>{{ row.item.petugas.data.name }}</div>
            <div>{{ row.item.petugas.data.nip }}</div>
          </template>

          <!-- jenis -->
          <template #cell(ex_p2)="{ value }">
            <div class="text-center">
              <b-badge :variant="value ? 'danger' : 'info'">
                {{ value ? 'DARI KEP-BDN' : 'DARI PENETAPAN BTD' }}
              </b-badge>
            </div>
          </template>

          <!-- action -->
          <template #cell(act)="row">
            <div class="text-center">
              <!-- open modal -->
              <b-button
                size="sm"
                variant="primary"
                class="shadow"
                v-b-tooltip.hover
                title="Lihat Detil BAST"
                @click="viewBastDetail(row.item)"
              >
                <font-awesome-icon icon="eye" />
              </b-button>
              <!-- print -->
              <b-button
                :disabled="row.item.ex_p2"
                size="sm"
                variant="dark"
                class="shadow"
                v-b-tooltip.hover
                title="Unduh Lampiran (Excel)"
                @click="downloadLampiranBast(row.item)"
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
      id="modal-detail-bast"
      ref="modal"
      header-bg-variant="light"
      footer-bg-variant="light"
      size="xl"
      hide-footer
    >
      <!-- custom title? -->
      <template #modal-title v-if="detailShown">Detail BAST #{{ detailShown.id }}</template>
      <!-- custom body -->
      <template v-if="detailShown">
        <b-card no-body>
          <b-tabs card lazy>
            <b-tab title="Header" active>
              <bast-contents :data="detailShown" disabled />
            </b-tab>
            <b-tab :title="`AWB (${detailShown.total_entry_manifest})`">
              <bast-detail-contents :id="detailShown.id" />
            </b-tab>
          </b-tabs>
        </b-card>
      </template>
    </b-modal>
  </div>
</template>

<script>
import axiosErrorHandler from "../mixins/axiosErrorHandler";
import { mapGetters, mapMutations } from "vuex";
import PaginatedBrowser from "@/components/PaginatedBrowser";

import BastContents from '@/components/BastContents'
import BastDetailContents from '@/components/BastDetailContents'


const fileDownload = require('js-file-download');

export default {
  mixins: [axiosErrorHandler],

  components: {
    PaginatedBrowser,
    BastContents,
    BastDetailContents
  },

  data() {
    return {
      detailShown: null
    };
  },

  methods: {
    ...mapMutations(["setBusyState"]),

    // query data bast
    fetchBast(q, spinner, vm) {
      spinner(true);

      // call api
      this.api
        .getBAST(q)
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

    // view detil bast
    viewBastDetail(bast) {
      this.detailShown = bast;
      this.$refs.modal.show();
    },

    // download lampiran bast
    downloadLampiranBast(bast) {
      this.setBusyState(true)
      this.api.downloadUri(`/bast/${bast.id}/excel`)
      .then(e => {
        this.setBusyState(false)
        const filename = bast.nomor_lengkap.replace('/\//gi', '-') + '.xlsx'
        fileDownload(e.data, filename)
      })
      .catch(e => {
        this.setBusyState(false)
        this.handleError(e)
      })
    },

    
  },

  computed: {
    ...mapGetters(["api"]),

    fields() {
      return [
        // { label: '', key: 'showDetails' },
        { key: "nomor_lengkap", class: "text-center" },
        { key: "tgl_dok", class:"text-center" },
        { key: "ex_p2", label: 'Asal' },
        {
          label: "Total AWB",
          key: "total_entry_manifest",
          class: "text-center"
        },
        "petugas",
        {
          label: "",
          key: "act"
        }
      ];
    }
  }
};
</script>