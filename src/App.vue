<template>
  <div id="app">
    <router-view/>
    <b-modal 
          :visible="busy"
          @show="preventShow"
          id="loading-screen"
          centered 
          title="Loading..."

          static
          
          ok-disabled
          hide-header-close
          size="sm"
          variant="danger"
          text-variant="danger"
          hide-header
          hide-footer>
          <!-- <b-progress :value="100" :max="100" animated variant="danger"></b-progress> -->
          <div class="text-center">
            <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
            <hr />
            <p>Please wait..</p>
          </div>
      </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['busy'])
  },
  methods: {
    preventShow(bvModalEvt) {
      if (!this.busy) {
        bvModalEvt.preventDefault()
      }
    }
  }
}
</script>

<style>
</style>
