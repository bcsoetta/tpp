<template>
  <!-- table here -->
  <b-table
    id="table-data-awal"
    v-b-visible.once="e => { tableReady = e}"
    small
    striped
    hover
    bordered
    head-variant="dark"
    class="shadow"
    :fields="fields"
    responsive
    no-border-collapse
    v-bind="$attrs"
    v-on="$listeners"
  >
    <!-- custom cell rendering -->
    <template #cell(index)="row">{{ row.index+1 }}</template>

    <!-- Nama + Alamat Importir -->
    <template #cell(nama_importir)="row">
      <b-form-input
        :debounce="debounce"
        size="sm"
        v-model="row.item.nama_importir"
        style="background-color: rgba(0,120,255,0.1)"
      />
      <b-form-textarea
        :debounce="debounce"
        size="sm"
        v-model="row.item.alamat_importir"
        style="background-color: rgba(255,50,0,0.1)"
      />
    </template>

    <template #head(nama_importir)>
      Nama Importir
      <hr style="border-color: white" class="my-0" />Alamat Importir
    </template>

    <!-- Keterangan (full) -->
    <template #cell(keterangan_rows)="row">
      <div v-for="(k, id) in row.item.keterangan.data" :key="row.index+'_ket_'+id">
        <b-form-textarea :debounce="debounce" size="sm" v-model="k.keterangan" />
      </div>
    </template>

    <!-- No BC11 -->
    <template #cell(no_bc11)="row">
      <b-form-input :debounce="debounce" size="sm" v-model="row.item.no_bc11" style="width: 60px" />
      <!-- Tgl BC11 -->
      <datepicker v-model="row.item.tgl_bc11" size="sm" style="width: 130px" />
      <b-row no-gutters style="width: 150px">
        <b-col md="4">
          <b-form-input :debounce="debounce" size="sm" v-model="row.item.pos" />
        </b-col>
        <b-col md="4">
          <b-form-input :debounce="debounce" size="sm" v-model="row.item.subpos" />
        </b-col>
        <b-col md="4">
          <b-form-input :debounce="debounce" size="sm" v-model="row.item.subsubpos" />
        </b-col>
      </b-row>
    </template>

    <template #head(no_bc11)>Pos BC11</template>

    <!-- Kode Flight -->
    <template #cell(kd_flight)="row">
      <div class="text-center">
        <b-form-input
          :debounce="debounce"
          size="sm"
          v-model="row.item.kd_flight"
          class="d-inline-block"
          style="width: 90px"
        />
      </div>
    </template>

    <!-- Koli -->
    <template #cell(koli)="row">
      <div class="text-center">
        <b-form-input
          :debounce="debounce"
          size="sm"
          v-model="row.item.koli"
          style="width: 50px"
          class="d-inline-block"
        />
      </div>
    </template>

    <!-- Bruto -->
    <template #cell(brutto)="row">
      <div class="text-center">
        <b-form-input
          :debounce="debounce"
          size="sm"
          v-model="row.item.brutto"
          class="d-inline-block"
          style="width: 80px"
        />
      </div>
    </template>

    <template #head(brutto)>
      Berat
      <br />(Kg)
    </template>

    <!-- MAWB -->
    <template #cell(mawb)="row">
      <b-form-input :debounce="debounce" size="sm" v-model="row.item.mawb" />
      <b-form-input :debounce="debounce" size="sm" v-model="row.item.hawb" />
    </template>

    <template #head(mawb)>
      MAWB
      <hr style="border-color: white" class="my-0" />HAWB
    </template>

    <!-- BARANG -->
    <template #cell(barang)="row">
      <div class="text-center" v-for="(barang, id) in row.item.barang.data" :key="row.index+'_brg_'+id">
        <hr v-if="id > 0"/>
        <b-row no-gutters style="max-width: 200px" class="mx-auto">
          <!-- jumlah jenis di row pertama? -->
          <b-col md="4">
            <b-form-input :debounce="debounce" size="sm" v-model="barang.jumlah"/>
          </b-col>
          <b-col md="4">
            <b-form-input :debounce="debounce" size="sm" v-model="barang.jenis"/>
          </b-col>

          <!-- Uraian di bawah -->
          <b-col md="12">
            <b-form-textarea :debounce="debounce" rows="2" size="sm" v-model="barang.uraian" />
          </b-col>
        </b-row>
      </div>
    </template>

    <template #head(barang)>
        Jumlah Jenis Barang
    </template>

    <!-- TOMBOL APUS/EDIT? -->
    <template #cell(act)="row">
      <div class="text-center">
        <!-- delete -->
        <b-button class="shadow" size="sm" variant="danger" @click="$emit('delete', row.index)">
          <font-awesome-icon icon="trash-alt"/>
        </b-button>
      </div>
    </template>

  </b-table>
</template>

<script>
import Datepicker from "@/components/Datepicker";

export default {
  inheritAttrs: false,

  components: {
    Datepicker
  },

  data() {
    return {
      debounce: 500
    };
  },

  computed: {
    fields() {
      return [
        {
          label: "No",
          key: "index"
        },
        "no_bc11",
        {
          label: "Kode Flight",
          key: "kd_flight"
        },
        "koli",
        "brutto",
        "mawb",
        "nama_importir",
        {
          label: "Barang",
          key: "barang"
        },
        {
          label: "Keterangan",
          key: "keterangan_rows"
        },
        {
          label: "",
          key: "act"
        }
      ];
    }
  }
};
</script>