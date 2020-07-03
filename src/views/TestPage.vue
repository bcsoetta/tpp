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
  </div>
</template>

<script>
export default {
  data() {
    return {
      excelFile: null,
      uploading: 0
    };
  },

  computed: {
    busy() {
      return this.uploading > 0 && this.uploading < 100;
    }
  },

  watch: {
    excelFile: {
      handler(nv) {
        if (nv) {
          // this.uploading = 20;
          setInterval(() => {
            this.uploading = 1 + Math.random() * 99.0
          }, 1000)
        }
      }
    }
  }
};
</script>