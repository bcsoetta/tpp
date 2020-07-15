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
          <template #cell(pejabat)="row">
            <div>{{ row.item.pejabat.data.name }}</div>
            <div>{{ row.item.pejabat.data.nip }}</div>
          </template>

          <!-- action -->
          <template #cell(act)="row">
            <div class="text-center">
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
              <penetapan-detail-contents :id="detailShown.id" />
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
import PenetapanDetailContents from "@/components/PenetapanDetailContents";
import PenetapanContents from "@/components/PenetapanContents";

export default {
  mixins: [axiosErrorHandler],

  components: {
    PaginatedBrowser,
    PenetapanDetailContents,
    PenetapanContents
  },

  data() {
    return {
      detailShown: null
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
    }
  },

  computed: {
    ...mapGetters(["api"]),

    fields() {
      return [
        // { label: '', key: 'showDetails' },
        { key: "nomor_lengkap", class: "text-center" },
        "tgl_dok",
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
        {
          label: "",
          key: "act"
        }
      ];
    }
  }
};
</script>