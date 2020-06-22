<template>
  <div class="container">
    <div v-if="userData.name" class="hello">
      <p>こんにちは！{{ userData.name }}さん</p>
    </div>
    <div class="">
      </div>
      <button @click="signOut">SignOut</button>
     <p>
      <button @click="addTweet">投稿</button>
      <input v-model="newTweet" type="text" />
     </p>
      <nuxt-link :to="{name: 'users-id', params: {id: userData.name}}">
        <button>マイページ</button>
      </nuxt-link>
      <div class="tweetList">
        <label for="tweetList">List</label>
        <div v-for="(tweet, index) in tweets" :key="index">
          <p>{{tweet.name}} : {{tweet.tweet}} : {{tweet.timestamp.seconds}}</p>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import firebase from "~/plugins/firebase";

export default {
  data() {
    return {
      db: firebase.firestore(),
      newTweet: "",
      tweets: []
    };
  },
  computed: {
    // ...mapGetters(["getTodos", "getUserEmail"]),
    ...mapState(["userData"])
  },
  methods: {
    // check() {
    //   //onAuthStateChangedと同じ結果
    //   const user = firebase.auth().currentUser;
    //   if (user) {
    //     console.log(user);
    //     return user;
    //   } else {
    //     console.log("error");
    //   }
    // },
    addTweet() {
      if (this.newTweet.length < 5) {
        alert("文字数が少なすぎます")
        return
      } 
      if (this.newTweet.length > 200) {
        alert("文字数が多すぎます")
        return
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
        .limit(50)
        .get()
        .then(res => {
          res.forEach(doc => {
            console.log(doc.data())
            this.tweets.push(doc.data())
          });
        });
    },
    signOut() {
      this.$store.dispatch("signOut");
    }
  },
  created() {
    this.$store.dispatch("checkAuth");
    this.featchTweet()
  }
};
</script>

<style>
.container {
  width: 100%;
}
.hello {
  height: 55px;
  background-color: skyblue;
  color: white;
}
</style>