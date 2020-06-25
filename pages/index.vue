<template>
  <div class="container">
    <tweetForm></tweetForm>
  </div>
</template>

<script>
import tweetForm from "~/components/tweetForm";

export default {
  components: {
    tweetForm
  },
  data() {
    return {};
  },
  computed: {
  },
  methods: {}
};
</script>

<style>
.container {
  width: 100%;
  text-align: center;
}
.font__red {
  color: red;
}
</style>