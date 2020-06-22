<template>
  <div class="container">
    <navMenu></navMenu>
    <p>{{ userData.name }}さんの投稿一覧</p>
    <div v-for="(tweet, index) in myTweet" :key="index">
      <p>{{ tweet.name }}</p>
      <p>{{ tweet.tweet }}</p>
      <p>{{ tweet.timestamp }}</p>
      <button>編集</button>
      <button @click="deleteTweet(index)">削除</button>
    </div>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
import { mapState, mapGetters, mapMutations } from "vuex";
import navMenu from "~/components/navMenu";
export default {
  components: {
    navMenu
  },

  data() {
    return {
      myTweet: [],
      db: firebase.firestore()
    };
  },
  computed: {
    ...mapState(["userData"]),
    ...mapGetters(["getTweet"]),
    ...mapMutations(["tweet"])
  },
  watch: {},
  methods: {
    getMyTweet() {
      //自分の投稿の取得
      this.myTweet = this.getTweet(this.userData.name);
    },
    deleteTweet(index) {
      this.db.collection("tweet").doc()
    }
  },
  created() {
    this.$store.dispatch("checkAuth");
    this.getMyTweet()
  }
};
</script>

<style>
</style>