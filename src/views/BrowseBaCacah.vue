<template>
  <div>
    <paginated-browser ref="browser" :data-callback="fetchBACacah">
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

          <!-- action -->
          <template #cell(act)="row">
            <div class="text-center">
              <!-- open modal -->
              <b-button
                size="sm"
                variant="primary"
                class="shadow"
                v-b-tooltip.hover
                title="Lihat Detil BA Cacah"
                @click="viewBACacahDetail(row.item)"
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
                @click="downloadLampiranBACacah(row.item)"
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
      id="modal-detail-ba-cacah"
      ref="modal"
      header-bg-variant="light"
      footer-bg-variant="light"
      size="xl"
      dialog-class="fullscreen"
      hide-footer
    >
      <!-- custom title? -->
      <template #modal-title v-if="detailShown">Detail BA Cacah #{{ detailShown.id }}</template>
      <!-- custom body -->
      <template v-if="detailShown">
        <b-card no-body>
          <b-tabs card lazy>
            <b-tab title="Header" active>
              <!-- <bast-contents :data="detailShown" disabled /> -->
              <ba-cacah-contents :data="detailShown" disabled />
            </b-tab>
            <b-tab :title="`AWB (${detailShown.total_entry_manifest})`">
              <!-- <bast-detail-contents :id="detailShown.id" /> -->
              <ba-cacah-detail-contents :id="detailShown.id" />
              <!-- Here be list of awb -->
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

import BaCacahContents from '@/components/BaCacahContents'
import BaCacahDetailContents from '@/components/BaCacahDetailContents'

const fileDownload = require('js-file-download');

export default {
  mixins: [axiosErrorHandler],

  components: {
    PaginatedBrowser,
    BaCacahContents,
    BaCacahDetailContents
  },

  data() {
    return {
      detailShown: null
    };
  },

  methods: {
    ...mapMutations(["setBusyState"]),

    // query data bast
    fetchBACacah(q, spinner, vm) {
      spinner(true);

      // call api
      this.api
        .getBACacah({
          ...q,
          include: 'penetapan,bast,pelaksana'
        })
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
    viewBACacahDetail(bast) {
      this.detailShown = bast;
      this.$refs.modal.show();
    },

    // download lampiran bast
    downloadLampiranBACacah(ba) {
      this.setBusyState(true)
      this.api.downloadUri(`/ba_cacah/${ba.id}/excel`)
      .then(e => {
        this.setBusyState(false)
        const filename = ba.nomor_lengkap.replace('/\//gi', '-') + '.xlsx'
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
        { key: "nomor_st", label: 'Nomor ST', class: "text-center" },
        { key: "tgl_st", label: 'Tgl ST', class: "text-center" },
        "pejabat",
        { key: "total_entry_manifest", label: 'Total Cacah', class: 'text-center' },
        {
          label: "",
          key: "act"
        }
      ];
    }
  }
};
</script>