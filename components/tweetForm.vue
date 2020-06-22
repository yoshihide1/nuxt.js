<template>
  <div>
    <div class="tweet__form">
      <p>
        <textarea
          class="tweet__textarea"
          v-model="newTweet"
          maxlength="150"
          placeholder="150文字以内で入力してください"
        ></textarea>
      </p>
      <p>
        <button class="tweet__button" @click="addTweet">投稿</button>
      </p>
      <p>{{ newTweet.length}}/150</p>
      <small class="font__red" v-if="(newTweet.length > 150)">文字数が多すぎます</small>
      <p>最大文字数150文字</p>
    </div>

    <div>
      <label for="tweet__list">TweetList</label>
      <div class="tweet__list" v-for="(tweet, index) in tweets" :key="index">
        <p>{{tweet.name}}</p>
        <p>{{tweet.tweet}}</p>
        <p>{{tweet.timestamp.seconds}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import firebase from "~/plugins/firebase";
import navMenu from "~/components/navMenu";

export default {
  data() {
    return {
      db: firebase.firestore(),
      newTweet: "",
      tweets: []
    };
  },
  computed: {
    ...mapState(["userData"])
  },
  methods: {
    addTweet() {
      if (this.newTweet.length < 5) {
        alert("文字数が少なすぎます");
        return;
      }
      if (this.newTweet.length > 150) {
        alert("文字数が多すぎます");
        return;
      }
      this.db
        .collection("tweet")
        .add({
          tweet: this.newTweet,
          name: this.userData.name,
          timestamp: firebase.firestore.Timestamp.now(),
          uid: this.userData.uid
        })
        .then(() => {
          //flash処理を入れる
          console.log("投稿完了");
          this.newTweet = "";
        })
        .catch(() => {
          console.log("error");
        });
    },
    featchTweet() {
      this.db
        .collection("tweet")
        .orderBy("timestamp", "desc")
        .limit(50)
        .get()
        .then(res => {
          res.forEach(doc => {
            console.log(doc.data());
            this.tweets.push(doc.data());
          });
          this.$store.commit("tweet", this.tweets);
        });
    }
  },
  created() {
    console.log("created");
    this.$store.dispatch("checkAuth");
    this.featchTweet();
  }
};
</script>

<style>
.tweet__form {
  margin: 2rem 0;
}
.tweet__button {
  padding: 3px 1rem;
  color: white;
  background-color: rgb(48, 187, 241);
  border: 2px solid rgb(209, 209, 209);
  border-radius: 10px;
}
.tweet__list {
  border: 2px solid gray;
  margin: 2rem 0;
}
.tweet__textarea {
  width: 80%;
  height: 5rem;
  border: 2px solid rgb(209, 209, 209);
  border-radius: 10px;
}
</style>