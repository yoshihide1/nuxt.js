<template>
  <div class="container">
    <p>
      <span class="tweet__name">{{ userData.name }}</span>さんの投稿一覧
    </p>
    <div class="tweet__list" v-for="(tweet, index) in myTweet" :key="index">
      <p class="tweet__tweet margin__top">{{ tweet.tweet }}</p>
      <p class="tweet__time">{{ tweet.timestamp.toDate() }}</p>
      <p>{{ tweet.id}}</p>
      <button class="tweet__delete__button" @click="deleteTweet(tweet.id)">削除</button>
    </div>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  components: {},

  data() {
    return {
      myTweet: [],
      db: firebase.firestore()
    };
  },
  computed: {
    ...mapState(["userData", "updateTweet"]),
    ...mapGetters(["getTweet"]),
    ...mapMutations(["tweet"])
  },
  watch: {
    userData() {
      console.log("ユーザー情報取得");
      this.getMyTweet(this.userData.name);
    },
    updateTweet() {
      //deleteの後に再取得
      this.getMyTweet(this.userData.name);
    }
  },
  methods: {
    getMyTweet(name) {
      //自分の投稿の取得
      console.log(name);
      this.myTweet = this.getTweet(name);
    },

    deleteTweet(docId) {
      this.$store.dispatch("deleteTweet", docId);
    }
  },
  created() {
    this.$store.dispatch("checkAuth");
  }
};
</script>

<style>
.margin__top {
  margin-top: 1rem;
}
</style>