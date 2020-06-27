<template>
  <div class="container">
    <tweetForm></tweetForm>
  </div>
</template>

<script>
import tweetForm from "~/components/tweetForm";
import firebase from "~/plugins/firebase";

export default {
  components: {
    tweetForm
  },
  data() {
    return {
      tweets: [],
      comments: []
    };
  },
  computed: {},
  created() {
    console.log("created");
    window.addEventListener("load", () => {
      console.log("load");
      this.featchTweet();
      this.featchComment();
    });
    this.$store.dispatch("checkAuth");
  },
  methods: {
    //ページ読み込み時の最初だけfirestoreから取得
    featchTweet() {
      //コレクション
      console.log("firestore::get_collection");
      firebase
        .firestore()
        .collection("tweet")
        .orderBy("timestamp", "desc")
        .limit(30)
        .get()
        .then(res => {
          res.forEach(doc => {
            this.tweets.push({
              tweet: doc.data().tweet,
              name: doc.data().name,
              timestamp: doc.data().timestamp,
              uid: doc.data().uid,
              id: doc.id //ドキュメントid
            });
          });
          this.$store.commit("tweet", this.tweets);
        });
    },
    featchComment() {
      //サブコレクション
      console.log("firestore::get_subCollection");
      firebase
        .firestore()
        .collectionGroup("messages")
        .limit(20)
        .get()
        .then(res => {
          res.forEach(doc => {
            this.comments.push({
              tweet: doc.data().tweet,
              name: doc.data().name,
              timestamp: doc.data().timestamp,
              uid: doc.data().uid,
              targetId: doc.data().docId, //元の記事のドキュメントID,
              id: doc.id
            });
          });
          this.$store.commit("resTweet", this.comments);
        });
    }
  }
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