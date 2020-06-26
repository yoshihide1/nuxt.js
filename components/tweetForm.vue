<template>
  <div>
    <div v-show="flashTweet" class="flash__tweet flash">
      <p>投稿しました</p>
    </div>
    <div v-show="flashComment" class="flash__comment flash">
      <p>コメントしました</p>
    </div>
    <div v-show="flashDelete" class="flash__delete flash">
      <p>削除しました</p>
    </div>
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
        <button class="tweet__add__button" @click="
        checkTweet">投稿</button>
      </p>
      <p class="tweet__text__check">{{ newTweet.length}}/150</p>
      <small class="font__red" v-if="(newTweet.length < 5)">文字数が少なすぎます(５文字以上)</small>
      <small class="font__red" v-if="(newTweet.length > 150)">文字数が多すぎます</small>
      <p class="tweet__text__check">最大文字数150文字</p>
    </div>

    <div>
      <label for="tweet__list">投稿一覧</label>
      <div class="tweet__list" v-for="(tweet, index) in updateTweet" :key="index">
        <p class="tweet__name">{{ tweet.name }}</p>
        <p class="tweet__tweet">{{ tweet.tweet }}</p>
        <p class="tweet__time">{{ tweet.timestamp.toDate() }}</p>
        <div v-if="(tweet.uid == userData.uid)">
          <button class="tweet__delete__button" @click="deleteTweet(tweet.id)">削除</button>
        </div>
        <!-- ↓この部分は最後に消す事↓ -->
        <p>記事のID>>{{ tweet.id }}</p>
        <!-- ↑この部分は最後に消す事↑ -->
        <!-- コメント追加 -->
        <label for="tweet__comment">コメント</label>
        <div v-for="(res, index) in resTweet" :key="index">
          <!-- idで紐づいたものだけ表示 -->
          <div v-if="tweet.id == res.targetId">
            <p class="tweet__name">{{ res.name }}</p>
            <p class="tweet__tweet">{{ res.tweet }}</p>
            <p class="tweet__time">{{ res.timestamp.toDate() }}</p>
            <div v-if="(res.uid == userData.uid)">
              <button class="tweet__delete__button" @click="deleteTweet(tweet.id, res.id)">削除</button>
            </div>
            <!-- ↓この部分は最後に消す事↓ -->
            <p>コメントのID>>{{ res.id }}</p>
            <!-- ↑この部分は最後に消す事↑ -->
          </div>
        </div>

        <button class="tweet__comment__button" @click="tweetComment(tweet.id)">コメントする</button>
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
      comment: [],
      flashTweet: false,
      flashComment: false,
      flashDelete: false
    };
  },
  computed: {
    ...mapState(["userData", "updateTweet", "resTweet"]),
    ...mapGetters(["deleteFilterTweet"])
  },
  methods: {
    checkTweet() {
      if (this.newTweet.length < 5 || this.newTweet.length > 150) {
        alert("５文字以上、１５０文字以内で入力してください");
        return;
      } else {
        this.addTweet();
      }
    },
    addTweet() {
      //firestoreとvuexに追加
      this.dbTweet
        .add({
          tweet: this.newTweet,
          name: this.userData.name,
          timestamp: this.timestamp,
          uid: this.userData.uid
        })
        .then(doc => {
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
    /**
     * 記事に対してのコメント機能
     * firestore_tweetコレクション内のサブコレクションとvuexに追加
     * @param = コメント追加先の記事のID
     */
    tweetComment(docId) {
      this.flashComment = true;
      this.flashTimeOut("comment");
      this.dbTweet
        .doc(docId)
        .collection("messages")
        .add({
          tweet: this.newTweet,
          name: this.userData.name,
          timestamp: this.timestamp,
          uid: this.userData.uid,
          docId: docId //コメント先の記事のID紐づけするため
        })
        .then(doc => {
          console.log("comment");
          const { tweet, name, timestamp, uid, targetId, id } = {
            //コメント用のフォームを作ること！
            tweet: this.newTweet,
            name: this.userData.name,
            timestamp: this.timestamp,
            uid: this.userData.uid,
            targetId: docId, //コメント先のID
            id: doc.id //コメントのID
          };
          this.$store.commit("addComment", {
            tweet,
            name,
            timestamp,
            uid,
            targetId,
            id
          });
        })
        .catch(() => {
          console.log("error");
        });
    },
    //ページ読み込み時の最初だけfirestoreから取得
    featchTweet() {
      //コレクション
      console.log("firestore::get");
      this.dbTweet
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
      //
      console.log("firestore::get Comment");
      firebase
        .firestore()
        .collectionGroup("messages")
        .limit(20)
        .get()
        .then(res => {
          res.forEach(doc => {
            this.comment.push({
              tweet: doc.data().tweet,
              name: doc.data().name,
              timestamp: doc.data().timestamp,
              uid: doc.data().uid,
              targetId: doc.data().docId, //元の記事のID,
              id: doc.id
            });
          });
          this.$store.commit("resTweet", this.comment);
        });
    },

    deleteTweet(docId, targetId) {
      this.$store.dispatch("deleteTweet", { docId, targetId });
      this.flashDelete = true;
      this.flashTimeOut("dele");
    },
    flashTimeOut(name) {
      setTimeout(() => {
        switch (name) {
          case "tweet":
            this.flashTweet = false;
            break;
          case "comment":
            this.flashComment = false;
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
    //最初のみ実行、それ以降はvuexで管理
    window.addEventListener("load", () => {
      this.featchTweet();
      this.featchComment();
      // this.$store.dispatch("featchTweet")
    });
    this.$store.dispatch("checkAuth");
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
  color: white;
  font-size: 1.3rem;
}
.flash__delete {
  background-color: rgba(255, 100, 100, 0.8);
}
.flash__comment {
  background-color: rgba(144, 146, 122, 0.8);
}
.flash__tweet {
  background-color: rgba(31, 209, 31, 0.8);
}
.tweet__form {
  margin: 2rem 0;
}
.tweet__name {
  font-size: 1.5rem;
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
  font-weight: bold;
}
.tweet__delete__button {
  margin-top: .5rem;
  padding: 5px 15px;
  color: white;
  background-color: rgb(255, 53, 53);
  border: 2px solid rgb(209, 209, 209);
  border-radius: 10px;
  font-weight: bold;
}
.tweet__comment__button {
  padding: 5px 15px;
  color: white;
  background-color: rgb(95, 230, 42);
  border: 2px solid rgb(209, 209, 209);
  border-radius: 10px;
  font-weight: bold;
}
.tweet__list {
  border-top: 2px solid gray;
  margin: 1rem auto;
}
.tweet__textarea {
  width: 80%;
  height: 5rem;
  border: 2px solid rgb(209, 209, 209);
  border-radius: 10px;
}
.tweet__text__check {
  font-size: 0.9rem;
}
</style>