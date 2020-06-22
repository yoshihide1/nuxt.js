<template>
  <div class="container">
    <navMenu></navMenu>
    <tweetForm></tweetForm>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import firebase from "~/plugins/firebase";
import navMenu from "~/components/navMenu";
import tweetForm from "~/components/tweetForm"

export default {
  components: {
    navMenu,
    tweetForm
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState(["userData"])
  },
  methods: {
}
}
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