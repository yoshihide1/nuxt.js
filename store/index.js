import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const tweetRef = db.collection('tweet')

export const state = () => ({
  userData: {},
  userUid: "",
  userName: "",
  userEmail: "",
  todos: []
})

export const mutations = {
  setUserData(state, userData) {
    state.userData = userData
  },
  addTodo(state, todo) {
    state.todos.push(todo)
  },
  clearTodo(state) {
    state.todo = []
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
        commit('setUserData', {name, email, uid})
        this.$router.push('/')
      })
    }).catch((error) => {
      console.log(error)
    })
  },
  signIn({ commit } , data) {
    console.log("signin")
    firebase.auth().signInWithEmailAndPassword(data.email, data.password).then(() => {
      this.$router.push('/')
    })
  },
  checkAuth({ commit }) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("checkAuth")
        const name = user.displayName
        const email = user.email
        const uid = user.uid
        commit('setUserData', {name, email, uid})
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
 

  // fetchTweet({ commit }) {
  //   tweetRef.get()
  //   .then((res) => {
  //     res.forEach((doc) => {
  //       console.log(`success: ${doc.id} => ${doc.data()}`)
  //       commit('addTodo', doc.data())
  //     })
  //   }).catch((error) => {
  //     console.log(`error: ${error}`)
  //   })
  // },
  // addTodo({ commit }, todo) {
  //   console.log(todo)
  //   todoRef.add({
  //     todo: todo.todo,
  //     limit: todo.limit
  //   }).then((docRef) => {
  //     console.log("Document written with ID:", docRef.id)
  //     commit('addTodo', todo)
  //   }).catch((error) => {
  //     console.log("Error adding document:", error)
  //   })

  // }
}
export const getters = {
  //ログインユーザー取得
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  },
  getUserEmail(state) {
    return state.userEmail
  },
  getTodos(state) {
    return state.todos
  }
}