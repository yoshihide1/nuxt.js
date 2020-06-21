<template>
  <div>
    <label for="name">DisplayName</label>
    <p>
      <input v-model="name" type="text" placeholder="Name" />
    </p>
    <label for="email">Email</label>
    <p>
      <input v-model="email" type="email" placeholder="Email" />
    </p>
    <label for="password">Password</label>
    <p>
      <input v-model="password" type="password" placeholder="Password" />
    </p>
    <p>
      <button @click="emailLogin">Login</button>
    </p>
    <label for="email">Email</label>
    <input v-model="email" type="email" placeholder="Email" />
    <label for="password">Password</label>
    <input v-model="password" type="password" placeholder="Password" />
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
      const name = this.name;
      const email = this.email;
      const password = this.password;
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