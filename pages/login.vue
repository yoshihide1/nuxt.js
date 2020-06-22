<template>
  <div>
    <label for="name">DisplayName</label>
    <p>
      <input v-model="name" type="text" placeholder="半角英数、記号のみ(５～１６文字)" />
    </p>
    <label for="email">Email</label>
    <p>
      <input v-model="email" type="email" placeholder="Email" />
    </p>
    <label for="password">Password</label>
    <p>
      <input v-model="password" type="password" placeholder="Password(６～１６文字)" />
    </p>
    <p>
      <button @click="emailLogin">Login</button>
    </p>
    <label for="email">Email</label>
    <input v-model="email" type="email" placeholder="Email" />
    <label for="password">Password</label>
    <input v-model="password" type="password" placeholder="Password(半角英数字)" />
    <p>
      <button @click="signIn">SignIn</button>
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

<style>
</style>