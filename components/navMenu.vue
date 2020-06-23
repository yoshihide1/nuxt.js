<template>
  <div class="container">
    <div v-if="userData.name" class="nav__menu">
      <p>こんにちは！{{ userData.name }}さん</p>
      <div>
        <nuxt-link :to="{name: 'users-id', params: {id: userData.name}}">
          <button class="nav__button">マイページ</button>
        </nuxt-link>
        <nuxt-link to="/">
          <button class="nav__button">投稿</button>
        </nuxt-link>
        <button class="nav__button" @click="signOut">SignOut</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["userData"])
  },
  methods: {
    signOut() {
      this.$store.dispatch("signOut");
    }
  }
};
</script>

<style>
.nav__menu {
  display: flex;
  justify-content: space-around;
  height: 55px;
  background-color: rgb(48, 187, 241);
  color: white;
}
.nav__button {
  background-color: rgb(48, 187, 241);
  border: 1px solid white;
  /* border-radius: 5px; */
  font-weight: bold;
  color: white;
  height: 55px;
  width: 100px;
  margin: 0;
  /* margin-left: 1rem; */
}
</style>