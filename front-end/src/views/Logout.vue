<template>
  <b-container>
    <login ref="login" />
  </b-container>
</template>

<script>
import Login from './Autenticacao/Login.vue';

export default {
  components: {
    Login,
  },
  mounted () {
    this.$refs.login.logout();
    this.$router.replace(this.$route.params.next || '/login');
  }
};
</script>
