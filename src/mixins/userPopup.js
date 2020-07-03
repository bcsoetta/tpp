export default {
    computed: {
        dataPenumpang () {
            return this.data.cd.data.penumpang.data
        },
        popoverPenumpang () {
            return {
                title: `#${this.dataPenumpang.id} <strong>${this.dataPenumpang.nama}</strong>`,
                content: `
                <strong>Kewarganegaraan:</strong>&nbsp;${this.dataPenumpang.negara.data.uraian} (${this.dataPenumpang.negara.data.kode})
                <br>
                <strong>No Paspor:</strong>&nbsp;${this.dataPenumpang.no_paspor}
                <br>
                <strong>Tgl Lahir:</strong>&nbsp;${this.dataPenumpang.tgl_lahir}
                <br>
                <strong>E-mail:</strong>&nbsp;📧 ${this.dataPenumpang.email}
                <br>
                <strong>Phone:</strong>&nbsp;☎️ ${this.dataPenumpang.phone}
                `,
                html: true,
                variant: 'info'
            }
        }
    }
}