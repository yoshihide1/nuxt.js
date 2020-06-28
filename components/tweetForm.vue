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
          class="tweet__textarea__tweet"
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
          <button class="tweet__delete__button" @click="deleteTweet(tweet.id)">記事の削除</button>
        </div>
        <!-- ↓この部分は最後に消す事↓ -->
        <p class="id__check">記事のID>>{{ tweet.id }}</p>
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
              <button class="tweet__delete__button" @click="deleteTweet(tweet.id, res.id)">コメントの削除</button>
            </div>
            <!-- ↓この部分は最後に消す事↓ -->
            <p class="id__check">コメントのID>>{{ res.id }}</p>
            <!-- ↑この部分は最後に消す事↑ -->
          </div>
        </div>
        <div>
          <p>
            <textarea
              class="tweet__textarea__comment"
              v-model="newComment"
              maxlength="150"
              placeholder="5文字以上、150文字以内で入力してください"
            ></textarea>
          </p>

          <button class="tweet__comment__button" @click="checkComment(tweet.id)">コメントする</button>
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
      newComment: "",
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
    //id=記事のID
    checkTweet() {
      if (this.newTweet.length < 4 || this.newTweet.length > 150) {
        alert("5文字以上、150文字以内で入力してください");
        return;
      } else {
        this.addTweet();
      }
    },
    checkComment(id) {
      if (this.newComment.length < 4 || this.newComment.length > 150) {
        alert("コメントは5文字以上、150文字以内で入力してください");
        } else {
          this.tweetComment(id)
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
     * @docId コメント追加先の記事のID
     */
    tweetComment(docId) {
      this.flashComment = true;
      this.flashTimeOut("comment");
      this.dbTweet
        .doc(docId)
        .collection("messages")
        .add({
          tweet: this.newComment,
          name: this.userData.name,
          timestamp: this.timestamp,
          uid: this.userData.uid,
          docId: docId //コメント先の記事のID紐づけするため
        })
        .then(doc => {
          console.log("comment");
          const { tweet, name, timestamp, uid, targetId, id } = {
            tweet: this.newComment,
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
          this.newComment = ""
        })
        .catch(() => {
          console.log("error");
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
  margin-top: 0.5rem;
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
.tweet__textarea__tweet {
  width: 80%;
  height: 5rem;
  border: 2px solid rgb(209, 209, 209);
  border-radius: 10px;
}
.tweet__textarea__comment {
  width: 60%;
  height: 4rem;
  border: 2px solid rgb(209, 209, 209);
  border-radius: 10px;
}
.tweet__text__check {
  font-size: 0.9rem;
}
.id__check {
  margin: 10px;
  color: deeppink;
}
</style>