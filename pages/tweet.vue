<template>
  <div>
    <h1>Tweet</h1>
    <h3></h3>
  </div>
</template>

<script>
export default {
created() {
  this.$store.dispatch('checkAuth')
}
}
</script>

<style>

</style>