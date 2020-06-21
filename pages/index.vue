<template>
  <div class="container">
    <div v-if="userData.name" class="hello">
      <p>こんにちは！{{ userData.name }}さん</p>
    </div>
    <!-- <ul>
      <li>{{ userData.name }}</li>
      <li>{{ userData.email }}</li>
      <li>{{ userData.uid }}</li>
    </ul>-->
    <div>
      <div class="tweetList">
        <label for="tweetList">List</label>
        <div>ここに一覧</div>
      </div>
      <button @click="signOut">SignOut</button>
      <nuxt-link to="/tweet">
        <button>投稿</button>
      </nuxt-link>
      <nuxt-link :to="{name: 'users-id', params: {id: userData.email}}">
        <button>マイページ</button>
      </nuxt-link>
      
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import firebase from "~/plugins/firebase";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      db: firebase.firestore()
    };
  },
  computed: {
    // ...mapGetters(["getTodos", "getUserEmail"]),
    ...mapState(["userData"])
  },
  methods: {
    check() {
      //onAuthStateChangedと同じ結果
      const user = firebase.auth().currentUser;
      if (user) {
        console.log(user);
        return user;
      } else {
        console.log("error");
      }
    },
    featchTweet() {
      this.db
        .collection("tweet")
        .limit(50)
        .get()
        .then(res => {
          res.forEach(doc => {});
        });
    },
    signOut() {
      this.$store.dispatch("signOut");
    }
  },
  created() {
    this.$store.dispatch("checkAuth");
    this.$store.dispatch("fetchTweet");
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