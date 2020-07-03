<template>
  <div>
    <b-form-group
    description="Ukuran file max 16 Mb"
    >
      <template #label>
        Browse File Excel (<a href="/static/assets/contoh-data-awal-gudang.xlsx">Contoh File Excel</a>)
      </template>
      <!-- body -->
      <b-form-file 
        v-model="excelFile" size="sm"
        :state="Boolean(excelFile)"
        placeholder="Pilih/Drop file excel di sini..."
        drop-placeholder="Drop file excel di sini..."
        accept=".xls, .xlsx"
        :disabled="busy"
        />
    </b-form-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      excelFile: null,
      uploading: 0
    }
  },

  computed: {
    busy() {
      return (this.uploading > 0 && this.uploading < 100) || this.excelFile
    }
  }
}
</script>