<template>
  <div class="container">
    <label for="name">DisplayName</label>
    <p>
      <input class="login__input" v-model="name" type="text" placeholder="半角英数、記号のみ(５～１６文字)" />
    </p>
    <label for="email">Email</label>
    <p>
      <input class="login__input" v-model="email" type="email" placeholder="Email" />
    </p>
    <label for="password">Password</label>
    <p>
      <input class="login__input" v-model="password" type="password" placeholder="Password(６～１６文字)" />
    </p>
    <p>
      <button class="login__button" @click="emailLogin">Login</button>
    </p>

    <label for="email">Email</label>
    <p>
      <input class="login__input" v-model="email" type="email" placeholder="Email" />
    </p>

    <label for="password">Password</label>
    <p>
      <input class="login__input" v-model="password" type="password" placeholder="Password(半角英数字)" />
    </p>
    <p>
      <button class="login__button" @click="signIn">SignIn</button>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },
  created() {
    this.$store.dispatch("checkAuth");
  },
  methods: {
    emailLogin() {
      let name, email, password;
      //半角英巣、記号のみと６文字以上～１６文字以内
      if (
        this.name.match(
          /^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/ && /^([a-zA-Z0-9]{5,16})$/
        )
      ) {
        name = this.name;
      } else {
        alert(
          "DisplayName半角英数字と記号のみで５～１６文字以内で入力してください"
        );
        return;
      }
      if (this.email.match(/.+@.+\..+/)) {
        email = this.email;
      } else {
        alert("Emailアドレスを正しく入力してください");
        return;
      }
      if (this.password.match(/^[A-Za-z0-9]*$/ && /^([a-zA-Z0-9]{6,16})$/)) {
        name = this.name;
        password = this.password;
      } else {
        alert("passwordを半角英数字８～１６文字以内で入力してください");
        return;
      }
      console.log("OK");
      this.$store.dispatch("emailLogin", { name, email, password });
    },
    signIn() {
      const email = this.email;
      const password = this.password;
      this.$store.dispatch("signIn", { email, password });
    }
  }
};
</script>

<style scoped>
.container {
  margin: 30px auto;
  padding: 30px;
  width: 50%;
  text-align: center;
  border-radius: 10px;
  border: 5px solid darkcyan;
}
.login__input {
  margin-bottom: 20px;
  width: 70%;
  height: 30px;
  border: 2px solid darkcyan;
  border-radius: 10px;
}
.login__button {
  color: white;
  background-color: darkcyan;
  padding: 5px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>