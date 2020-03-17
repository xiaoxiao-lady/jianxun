<template lang="html">
  <div class="">
    <!-- 建筑 -->
    <mt-cell
      v-if="hackReset"
      v-for="(item,index) in builds"
      v-bind:key="index"
      style="border-bottom:1px solid #dfdfdf;font-weight: bold;"
      :title="item.name"
      :to="getPath(item)"
      is-link
      value="">
    </mt-cell>
  </div>
</template>

<script>
import { getBuild } from '@/api/address'
import { getAreaList } from '@/api/area'
export default {
  data () {
    return {
      builds: [],
      items: [],
      hackReset: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getBuildList()
    },
    getPath (item) {
      return `/area?id=${item.id}`
    },
    getBuildList() {
      getBuild().then(res => {
        this.builds = res.result
      })
    },
  }
}
</script>

<style lang="css">
</style>
