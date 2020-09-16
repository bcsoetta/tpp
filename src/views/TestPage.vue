<template>
  <div>
    <b-form-row>
      <b-col md="6">
        <img svg-inline src="../assets/tpp.svg"/>
      </b-col>
      <b-col md="6">
        <h5>Rack occupancy rate</h5>
        <div>
          <b-form-group :label="'RACK-'+(id+1) +`: ${rack} %`" v-for="(rack, id) in rackOccupancy" :key="'rackk-'+id">
            <b-form-input type="range" min="0" max="100" v-model="rackOccupancy[id]" :id="'rack-'+id" lazy class="shadow"/>
          </b-form-group>
          
        </div>

        <h5>Test Default prop override</h5>
        <b-form-group :label="'Select Penetapan : ' + penetapan_id">
          <select-penetapan v-model="penetapan_id" :search-on-empty="!penetapan_id"/>
        </b-form-group>
        <b-form-group :label="'Select BAST : ' + bast_id">
          <select-bast v-model="bast_id" :search-on-empty="!bast_id"/>
        </b-form-group>
      </b-col>
    </b-form-row>

    <div v-if="rackElems">
      <template v-for="(rack,id) in rackElems">
        <b-popover :target="rack" triggers="hover" placement="top" :key="'rack'+id">
          <template #title>
            Am I shown?
          </template>
          What's guuud niggeeerr?!
        </b-popover>
      </template>
    </div>
    <b-form-group label="Rack" :description="`current rack_id: ${rack_id}`">
      <select-rack v-model="rack_id"/>
    </b-form-group>
  </div>
</template>

<script>
import SelectTps from '@/components/SelectTps'
import SelectUser from '@/components/SelectUser'
import SelectPenetapan from '@/components/SelectPenetapan'
import SelectBast from '@/components/SelectBast'
import SelectRack from '../components/SelectRack'

export default {
  components: {
    SelectTps,
    SelectUser,
    SelectPenetapan,
    SelectBast,
    SelectRack
  },

  data () {
    return {
      rackOccupancy: [
        10,
        20,
        30
      ],
      rackElems: null,
      gTarget: null,
      tps_id: null,
      tps_kode: null,
      pejabat_id: null,
      penetapan_id: null,
      bast_id: null,
      rack_id: null
    }
  },

  methods: {
    handleClick (e) {
      console.log(e)

      // grab closest
      const c = e.target.closest('g')
      console.log('closest g elem', c)
      this.gTarget = c
    }
  },

  mounted: function () {
    this.$nextTick(() => {
      this.rackElems = this.$el.querySelectorAll('g[data-name]')
      console.log('racks: ', this.rackElems)

      this.rackElems.forEach(e => {
        e.onclick = this.handleClick
        if (!this.gTarget) this.gTarget = e
      });
    })
  },

  watch: {
    rackOccupancy: {
      deep: true,
      handler(nv) {
        if (this.rackElems) {
          // update em all
          for (var i=0; i<this.rackElems.length; i++) {
            this.rackElems[i].style.opacity = (100.0-nv[i])/100.0
          }
        }
      }
    }
  }
}
</script>

<style>
svg {
  outline: none;
}

g[data-name]{
  transition: all 2s;
}

g path {
  transition: all 0.5s;
}

g[data-name]:hover path {
  /* border: 1px dashed rgba(200, 10, 10, 0.5); */
  fill: rgba(200, 10, 10, 0.5);
}

g[data-name]:hover {
  cursor: pointer;
  opacity: 1 !important;
}
</style>