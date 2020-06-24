<template>
  <div>
    <div v-show="flashTweet" class="flash__tweet flash">
      <p>投稿しました</p>
    </div>
    <div v-show="flashDelete" class="flash__delete flash">
      <p>削除しました</p>
    </div>
    <button class="test__button" @click="featchTweet">最新のデータに更新(仮)</button>
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
        <button class="tweet__add__button" @click="addTweet">投稿</button>
      </p>
      <p>{{ newTweet.length}}/150</p>
      <small class="font__red" v-if="(newTweet.length > 150)">文字数が多すぎます</small>
      <p>最大文字数150文字</p>
    </div>

    <div>
      <label for="tweet__list">投稿一覧</label>
      <div class="tweet__list" v-for="(tweet, index) in updateTweet" :key="index">
        <p class="tweet__name">{{ tweet.name }}</p>
        <p class="tweet__tweet">{{ tweet.tweet }}</p>
        <p class="tweet__time">{{ tweet.timestamp.toDate() }}</p>

        <!-- この部分は最後に消す事 -->
        <p>{{ tweet.id }}</p>

        <div v-if="(tweet.uid == userData.uid)">
          <button class="tweet__delete__button" @click="deleteTweet(tweet.id)">削除</button>
        </div>
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
      dbTweet: firebase.firestore().collection("tweet"),
      timestamp: firebase.firestore.Timestamp.now(),
      newTweet: "",
      tweets: [],
      flashTweet: false,
      flashDelete: false
    };
  },
  computed: {
    ...mapState(["userData", "updateTweet"]),
    ...mapGetters(["deleteFilterTweet"])
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
      this.dbTweet
        .add({
          tweet: this.newTweet,
          name: this.userData.name,
          timestamp: this.timestamp,
          uid: this.userData.uid
        })
        .then(doc => {
          //flash処理を入れる
          this.flashTweet = true;
          this.flashTimeOut("tweet");
          let { tweet, name, timestamp, uid, id } = {
            tweet: this.newTweet,
            name: this.userData.name,
            timestamp: this.timestamp,
            uid: this.userData.uid,
            id: doc.id
          };
          console.log("投稿完了");
          //objectで渡すとvuexでエラーになるため
          this.$store.commit("addTweet", { tweet, name, timestamp, uid, id });
          this.newTweet = "";
        })
        .catch(() => {
          console.log("error");
        });
    },
    featchTweet() {
      console.log("firestore::get");
      this.tweets = [];
      this.dbTweet
        .orderBy("timestamp", "desc")
        .limit(50)
        .get()
        .then(res => {
          res.forEach(doc => {
            console.log(doc.data());
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
    deleteTweet(docId) {
      this.$store.dispatch("deleteTweet", docId);
      this.flashDelete = true;
      this.flashTimeOut("dele");
    },
    flashTimeOut(name) {
      setTimeout(() => {
        switch (name) {
          case "tweet":
            this.flashTweet = false;
            break;
          case "dele":
            this.flashDelete = false;
            break;
        }
      }, 1500);
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
.test__button {
  padding: 3px 20px;
  color: white;
  background-color: black;
  border: 2px solid gray;
  border-radius: 10px;
}
.flash {
  position: fixed;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}
.flash__delete {
  background-color: rgba(255, 100, 100, 0.8);
  color: white;
  font-size: 1.3rem;
}
.flash__tweet {
  background-color: rgba(31, 209, 31, 0.8);
  color: white;
  font-size: 1.3rem;
}

.tweet__form {
  margin: 2rem 0;
}
.tweet__name {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
.tweet__time {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
}
.tweet__add__button {
  padding: 5px 15px;
  color: white;
  background-color: rgb(48, 187, 241);
  border: 2px solid rgb(209, 209, 209);
  border-radius: 10px;
}
.tweet__delete__button {
  padding: 5px 15px;
  color: white;
  background-color: rgb(255, 53, 53);
  border: 2px solid rgb(209, 209, 209);
  border-radius: 10px;
}
.tweet__list {
  /* width: 90%;
  text-align: left; */
  border-top: 2px solid gray;
  /* border-bottom: 2px solid gray; */
  margin: 2rem auto;
}
.tweet__textarea {
  width: 80%;
  height: 5rem;
  border: 2px solid rgb(209, 209, 209);
  border-radius: 10px;
}
</style>