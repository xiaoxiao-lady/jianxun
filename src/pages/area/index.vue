<template lang="html">
  <div class="">
    <mt-cell
      v-if="hackReset"
      v-for="(item,index) in items"
      v-bind:key="index"
      style="border-bottom:1px solid #dfdfdf;font-weight: bold;"
      :title="item.name"
      :to="getPath(item)"
      is-link
      value="">
    </mt-cell>
    <menuindex :area="false"/>
  </div>
</template>

<script>
import { getAreaList } from '@/api/area'
export default {
  data () {
    return {
      items: [],
      hackReset: true
    }
  },
  activated () {
    this.init()
  },
  methods: {
    init () {
      this.getAreaList()
    },
    getPath (item) {
      return `/patients?areaId=${item.id}`
    },
    getAreaList () {
      getAreaList({
        buildId: this.$route.query.id
      }).then((res) => {
        this.hackReset = false
        this.$nextTick(() => {
          this.items = res.result
          this.hackReset = true
        })
      })
    }
  }
}
</script>

<style lang="css">
</style>
