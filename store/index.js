import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const tweetRef = db.collection('tweet')

export const state = () => ({
  userData: {},
  updateTweet: [],
  resTweet: [],
})

export const mutations = {
  setUserData(state, userData) {
    state.userData = userData
  },
  clearUserData(state) {
    console.log("clear")
    state.userData = {}
  },
  tweet(state, tweet) {//tweetを管理
    console.log(tweet)
    state.updateTweet = []
    state.updateTweet = tweet
  },
  addTweet(state, addTweet) {//新しいTweetをvuesで管理
    console.log("newTweet")
    state.updateTweet.unshift(addTweet)//先頭に
  },
  resTweet(state, resTweet) {//commentを管理
    console.log(resTweet)
    state.resTweet = []
    state.resTweet = resTweet
  },
  addComment(state, addTweet) {//新しいcommentを管理
    console.log("newComment")
    state.resTweet.push(addTweet)
  },

}
export const actions = {

  emailLogin({ commit }, data) {
    console.log("email")
    console.log(data)
    firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then((result) => {
      console.log(result)
      const user = firebase.auth().currentUser
      //displayName登録処理
      user.updateProfile({
        displayName: data.name
      }).then(() => {
        const name = result.user.displayName
        const email = result.user.email
        const uid = result.user.uid
        console.log("OK")
        commit('setUserData', { name, email, uid })
        this.$router.push('/')
      })
    }).catch((error) => {
      console.log(error)
    })
  },
  signIn({ commit }, data) {
    console.log(data)
    console.log("signin")
    firebase.auth().signInWithEmailAndPassword(data.email, data.password).then(() => {
      this.$router.push('/')
    }).catch(() => {
      alert("一致する登録情報がありません")
    })
  },
  checkAuth({ commit }) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("checkAuth")
        const name = user.displayName
        const email = user.email
        const uid = user.uid
        commit('setUserData', { name, email, uid })
      } else {
        console.log("error")
        this.$router.push('/login')
      }
    })
  },
  signOut({ commit }) {
    firebase.auth().signOut().then(() => {
      commit("clearUserData")
      this.$router.push('/login')
    })
  },
  /**firestoreとvuexstoreから削除
   * @param {id} docIdとtargetId 
   * 元の記事を削除かコメント部分を削除
   */
  deleteTweet({ commit, getters }, id) {
    console.log("firestore::delete")
    if (id.targetId) {//コメントの削除
      console.log("if")
      tweetRef.doc(id.docId).collection("messages")
        .doc(id.targetId).delete().then(() => {
          const getRes = getters.deleteFilterMessage(id.targetId)
          commit("resTweet", getRes)
          console.log("サブコレクション削除")
        }).catch(() => {
          console.log("error")
        })
    } else {//記事の削除
      tweetRef.doc(id.docId).delete().then(() => {
        const getTweet = getters.deleteFilterTweet(id.docId)
        console.log(getTweet)
        commit("tweet", getTweet)
        // docs.ref.id記事に紐づいたコメントの削除
        tweetRef.doc(id.docId).collection("messages")
          .where("docId", "==", id.docId)
          .get().then((result) => {
            result.forEach(docs => {
              tweetRef.doc(id.docId).collection("messages").doc(docs.ref.id)
                .delete().then(() => {
                  console.log("OK")
                })
            })
          })
      })

      //コレクションの削除
    }
  },
}
export const getters = {
  //マイページに自分の記事を取得
  getTweet: (state) => (name) => {
    return state.updateTweet.filter(tweet => tweet.name == name)
  },
  //記事を削除しときに残りの記事を取得して更新
  deleteFilterTweet: (state) => (docId) => {
    return state.updateTweet.filter(tweet => tweet.id != docId)
  },
  //コメントを削除したときに残りのコメントを取得して更新
  deleteFilterMessage: (state) => (targetId) => {
    return state.resTweet.filter(tweet => tweet.id != targetId)
  }
}