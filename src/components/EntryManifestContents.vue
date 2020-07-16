<template>
  <div v-if="data">
    <!-- 1st row, important info -->
    <b-row class="border-bottom mb-2">
      <!-- Waktu Gate In -->
      <b-col md="6" order="2" class="border-left">
        <b-row v-if="data.tps">
          <b-col>
            <b-form-group label="TPS Asal" class="thick">
              <b-row no-gutters>
                <!--  KODE TPS -->
                <b-col md="2">
                  <b-form-input
                    size="sm"
                    :disabled="disabled"
                    class="text-center text-danger"
                    :value="data.tps.data.kode"
                  />
                </b-col>
                <!--  NAMA TPS -->
                <b-col md="10">
                  <b-form-input
                    size="sm"
                    :disabled="disabled"
                    class="text-center text-danger"
                    :value="data.tps.data.nama"
                  />
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Waktu Gate-In" class="thick">
              <b-form-input
                size="sm"
                :disabled="disabled"
                class="text-center text-info"
                :value="data.waktu_gate_in"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>
      <!-- Status terakhir -->
      <b-col md="6" order="1">
        <b-alert show variant="info" v-if="data.short_last_status">
          STATUS TERAKHIR :
          <b-badge
            :variant="badgeVariant(data.short_last_status.status)"
          >{{ data.short_last_status.status }}</b-badge>
          <br />WAKTU STATUS : (
          <strong>{{ data.short_last_status.created_at }}</strong>)
        </b-alert>
      </b-col>
    </b-row>
    <b-row class="border-bottom my-2">
      <!-- Left side, for AWB -->
      <b-col md="6">
        <!-- BCP row, if we have one -->
        <b-row v-if="data.bcp" class="border-bottom">
          <b-col>
            <b-form-group label="No BCP" class="thick text-danger">
              <b-form-input
                size="sm"
                :disabled="disabled"
                class="text-center text-danger"
                :value="data.bcp.data.nomor_lengkap"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- Data MAWB + HAWB dlu -->
        <b-row>
          <!-- MAWB -->
          <b-col md="6">
            <b-form-group label="MAWB" class="thick">
              <b-form-input size="sm" :disabled="disabled" class="text-center" :value="data.mawb" />
            </b-form-group>
          </b-col>
          <!-- HAWB -->
          <b-col md="6">
            <b-form-group label="HAWB" class="thick">
              <b-form-input size="sm" :disabled="disabled" class="text-center" :value="data.hawb" />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- Row 2: Data BC11 -->
        <b-row>
          <!-- BC 11 -->
          <b-col md="4">
            <b-form-group label="Nomor BC11" class="thick">
              <b-form-input
                size="sm"
                :disabled="disabled"
                class="text-center"
                :value="data.no_bc11"
              />
            </b-form-group>
          </b-col>
          <!-- Tgl BC11 -->
          <b-col md="4">
            <b-form-group label="Tanggal" class="thick">
              <b-form-input
                size="sm"
                :disabled="disabled"
                class="text-center"
                :value="data.tgl_bc11"
              />
            </b-form-group>
          </b-col>
          <!-- Pos BC11 -->
          <b-col md="4">
            <b-form-group label="Pos" class="thick">
              <b-form-input
                size="sm"
                :disabled="disabled"
                class="text-center"
                :value="data.pos_formatted"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>

      <!-- Right side, for barang -->
      <b-col md="6" class="border-left">
        <!-- Importir (nama) -->
        <b-row>
          <b-col>
            <b-form-group label="Importir" class="thick">
              <b-form-input
                size="sm"
                :disabled="disabled"
                class="text-center"
                :value="data.nama_importir"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- Importir (alamat) -->
        <b-row>
          <b-col>
            <b-form-group label="Alamat" class="thick">
              <b-form-textarea
                size="sm"
                :disabled="disabled"
                class="text-center"
                :value="data.alamat_importir"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- 3rd row, data barang dan keterangan? -->
    <b-row>
      <!-- uraian barang -->
      <b-col md="6">
        <b-form-group label="Data Barang (awal)" class="thick">
          <!-- table here -->
          <b-table
            v-if="data.barang"
            hover
            head-variant="dark"
            striped
            bordered
            class="shadow"
            small
            :fields="fieldBarang"
            :items="data.barang.data"
            responsive="sm"
          />
        </b-form-group>
      </b-col>
      <!-- Koli -->
      <b-col md="2">
        <b-form-group label="Koli" class="thick">
          <b-form-input size="sm" :disabled="disabled" class="text-center" :value="data.koli" />
        </b-form-group>
      </b-col>
      <!-- Kilo -->
      <b-col md="2" sm="4">
        <b-form-group label="Berat (KG)" class="thick">
          <b-form-input size="sm" :disabled="disabled" class="text-center" :value="data.brutto" />
        </b-form-group>
      </b-col>
      <!-- Kode Flight -->
      <b-col md="2" sm="4">
        <b-form-group label="Flight No" class="thick">
          <b-form-input size="sm" :disabled="disabled" class="text-center" :value="data.kd_flight" />
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import niceties from "../mixins/niceties";

export default {
  mixins: [niceties],
  props: {
    data: {
      type: Object,
      required: true
    },

    disabled: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    fieldBarang() {
      return [
        { key: "uraian", class: "text-center" },
        { key: "jumlah", class: "text-center" },
        { key: "jenis", class: "text-center" }
      ];
    }
  }
};
</script>