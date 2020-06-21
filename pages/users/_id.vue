<template>
  <div>
   <p>{{ userData.name }}さんのマイページ</p>
  <nuxt-link to="/"><button>一覧へ</button></nuxt-link>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  computed: {
    ...mapState(["userData"])
  }

}
</script>

<style>

</style>