<template>
  <div class="container">
    <div id="pc__menu">
      <div v-if="userData.name" class="nav__menu">
        <p class="hello__user">
          こんにちは！
          <span class="hello__user__name">{{ userData.name }}</span>さん
        </p>
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

    <div id="sp__menu">
      <div class="nav__menu">
        <p class="hello__user">
          こんにちは！
          <span class="hello__user__name">{{ userData.name }}</span>さん
        </p>
        <a @click="showIsActive" class="menu__trigger" :class="{ active:isActive }" href="#">
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>
      <div id="sp__nav" v-show="isActive" @click="showIsActive">
          <div>

          <nuxt-link :to="{name: 'users-id', params: {id: userData.name}}">
            <button class="nav__button sp__nav__button">マイページ</button>
          </nuxt-link>
          <nuxt-link to="/">
            <button class="nav__button sp__nav__button">投稿</button>
          </nuxt-link>
          <button class="nav__button sp__nav__button" @click="signOut">SignOut</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isActive: false,
    };
  },
  computed: {
    ...mapState(["userData"])
  },
  methods: {
    showIsActive() {
      this.isActive =! this.isActive
    },
    signOut() {
      this.$store.dispatch("signOut");
    }
  }
};
</script>

<style>
.hello__user {
  line-height: 55px;
}
.hello__user__name {
  font-size: 1.3rem;
  font-weight: bold;
}
.nav__menu {
  display: flex;
  justify-content: space-around;
  height: 55px;
  background-color: rgb(48, 187, 241);
  color: white;
}
.nav__button {
  background-color: rgb(48, 187, 241);
  border: 1px solid rgb(48, 187, 241);
  /* border-radius: 5px; */
  font-weight: bold;
  color: white;
  height: 55px;
  width: 100px;
  margin: 0;
  /* margin-left: 1rem; */
}
.nav__button:hover {
  transition-duration: 0.7s;
  background-color: white;
  color: tomato;
}
@media screen and (min-width: 769px) {
  #sp__menu {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  #pc__menu {
    display: none;
  }
  #sp__nav {
    position: fixed;
    display: block;
height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, .8);
  }
  .sp__nav__button {
    width: 100%;
    padding: 20px 0;
    border-top: 2px solid white;
    font-size: 4vw;
    
  }
.nav__menu {
  justify-content: space-between;
padding: 0 2%;
}
.menu__trigger,
  .menu__trigger span {
    display: block;
    transition: all 0.5s;
    box-sizing: border-box;
  }
  .menu__trigger {
    position: relative;
    width: 50px;
    height: 44px;
  }
  .menu__trigger span {
    position: absolute;
    width: 100%;
    height: 5px;
    background-color: white;
    border-radius: 4px;
  }
  .menu__trigger span:nth-last-of-type(1) {
    top: 5px;
  }
  .menu__trigger span:nth-last-of-type(2) {
    top: 25px;
  }
  .menu__trigger span:nth-last-of-type(3) {
    bottom: -5px;
  }
  .menu__trigger.active span:nth-last-of-type(1) {
    -webkit-transform: translateY(20px) rotate(-315deg);
    transform: translateY(20px) rotate(-315deg);
  }
  .menu__trigger.active span:nth-last-of-type(2) {
    opacity: 0;
  }
  .menu__trigger.active span:nth-last-of-type(3) {
    -webkit-transform: translateY(-20px) rotate(315deg);
    transform: translateY(-20px) rotate(315deg);
  }
}
</style>