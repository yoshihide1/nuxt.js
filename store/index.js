import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const tweetRef = db.collection('tweet')

export const state = () => ({
  userData: {},
  userUid: "",
  userName: "",
  userEmail: "",
  todos: [],
  tweet: [],
  addTweet: []
})

export const mutations = {
  setUserData(state, userData) {
    state.userData = userData
  },
  tweet(state, tweet) {//マイページ用に保持
    state.tweet = []
    state.tweet = tweet
  },
  addTweet(state, tweet) {//firestoreを通さずに表示
    state.tweet.unshift(tweet)//先頭に
  }
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
  signIn(data) {
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
  signOut() {
    firebase.auth().signOut().then(() => {
      this.$router.push('/login')
    })
  },

}
export const getters = {
  getTweet: (state) => (name) => {
    console.log(name)
    return state.tweet.filter(tweet => tweet.name == name)
  }
}