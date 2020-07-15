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
    <!-- Pass thru all scoped slots -->
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>

    <!-- custom cell rendering -->
    <template #cell(index)="row" v-if="showNumber">{{ row.index+start }}</template>

    <!-- Nama + Alamat Importir -->
    <template #cell(nama_importir)="row">
      <b-form-input
        :debounce="debounce"
        size="sm"
        v-model="row.item.nama_importir"
        style="background-color: rgba(0,120,255,0.1)"
        :disabled="readOnly"
      />
      <b-form-textarea
        :debounce="debounce"
        size="sm"
        v-model="row.item.alamat_importir"
        style="background-color: rgba(255,50,0,0.1)"
        :disabled="readOnly"
      />
    </template>

    <template #head(nama_importir)>
      Nama Importir
      <hr style="border-color: white" class="my-0" />Alamat Importir
    </template>

    <!-- Keterangan (full) -->
    <template #cell(keterangan_rows)="row" v-if="showKeterangan">
      <div v-for="(k, id) in row.item.keterangan.data" :key="row.index+'_ket_'+id">
        <b-form-textarea
          :debounce="debounce"
          size="sm"
          v-model="k.keterangan"
          :disabled="readOnly"
        />
      </div>
    </template>

    <!-- No BC11 -->
    <template #cell(no_bc11)="row">
      <b-form-input
        :debounce="debounce"
        size="sm"
        v-model="row.item.no_bc11"
        style="width: 60px"
        :disabled="readOnly"
      />
      <!-- Tgl BC11 -->
      <datepicker v-model="row.item.tgl_bc11" size="sm" style="width: 130px" :disabled="readOnly" />
      <b-row no-gutters style="width: 150px">
        <b-col md="4">
          <b-form-input :debounce="debounce" size="sm" v-model="row.item.pos" :disabled="readOnly" />
        </b-col>
        <b-col md="4">
          <b-form-input
            :debounce="debounce"
            size="sm"
            v-model="row.item.subpos"
            :disabled="readOnly"
          />
        </b-col>
        <b-col md="4">
          <b-form-input
            :debounce="debounce"
            size="sm"
            v-model="row.item.subsubpos"
            :disabled="readOnly"
          />
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
          :disabled="readOnly"
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
          :disabled="readOnly"
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
          :disabled="readOnly"
        />
      </div>
    </template>

    <template #head(brutto)>
      Berat
      <br />(Kg)
    </template>

    <!-- MAWB -->
    <template #cell(mawb)="row">
      <b-form-input :debounce="debounce" size="sm" v-model="row.item.mawb" :disabled="readOnly" />
      <b-form-input :debounce="debounce" size="sm" v-model="row.item.hawb" :disabled="readOnly" />
    </template>

    <template #head(mawb)>
      MAWB
      <hr style="border-color: white" class="my-0" />HAWB
    </template>

    <!-- BARANG -->
    <template #cell(barang)="row">
      <div
        class="text-center"
        v-for="(barang, id) in row.item.barang.data"
        :key="row.index+'_brg_'+id"
      >
        <hr v-if="id > 0" />
        <b-row no-gutters style="max-width: 200px" class="mx-auto">
          <!-- jumlah jenis di row pertama? -->
          <b-col md="4">
            <b-form-input
              :debounce="debounce"
              size="sm"
              v-model="barang.jumlah"
              :disabled="readOnly"
            />
          </b-col>
          <b-col md="4">
            <b-form-input
              :debounce="debounce"
              size="sm"
              v-model="barang.jenis"
              :disabled="readOnly"
            />
          </b-col>

          <!-- Uraian di bawah -->
          <b-col md="12">
            <b-form-textarea
              :debounce="debounce"
              rows="2"
              size="sm"
              v-model="barang.uraian"
              :disabled="readOnly"
            />
          </b-col>
        </b-row>
      </div>
    </template>

    <template #head(barang)>Jumlah Jenis Barang</template>

    <!-- TOMBOL APUS/EDIT? -->
    <template #cell(act)="row">
      <slot name="controls" :row="row">
        <div class="text-center">
          <!-- edit -->
          <b-button
            v-if="editable"
            class="shadow"
            size="sm"
            variant="primary"
            @click="$emit('edit', row.index)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </b-button>
          <!-- delete -->
          <b-button class="shadow" size="sm" variant="danger" @click="$emit('delete', row.index)" :disabled="disableControls">
            <font-awesome-icon icon="trash-alt" />
          </b-button>
        </div>
      </slot>
    </template>
  </b-table>
</template>

<script>
import Datepicker from "@/components/Datepicker";

export default {
  inheritAttrs: false,

  props: {
    readOnly: {
      type: Boolean,
      default: false
    },

    showNumber: {
      type: Boolean,
      default: true
    },

    showKeterangan: {
      type: Boolean,
      default: true
    },

    editable: {
      type: Boolean,
      default: false
    },

    disableControls: {
      type: Boolean,
      default: false
    },

    start: {
      type: Number,
      default: 1
    },

    appendFields: {
      type: Array,
      default: () => []
    }
  },

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
      var labels = [
        ...(this.showNumber
          ? [
              {
                label: "No",
                key: "index"
              }
            ]
          : []),
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
        ...(this.showKeterangan? [{
          label: "Keterangan",
          key: "keterangan_rows"
        }]:[]),
        ...this.appendFields,
        {
          label: "",
          key: "act"
        }
      ];

      return labels;
    }
  }
};
</script>