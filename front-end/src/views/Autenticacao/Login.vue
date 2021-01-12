<template>
  <div class="card-container">
    
  <b-card
    title="Como Funciona?"
    img-top
    tag="article"
    style="max-width: 20rem;"
    class="card"
  >
    <b-card-text>
      Some quick example text to build on the card title and make up the bulk of the card's content.
    </b-card-text>
  </b-card>
   <b-card
    title="Entre agora"
    img-top
    tag="article"
    style="max-width: 20rem;"
    class="card"
  >
       <div class="mt-4">
        <b-form @submit.prevent="login">
          <b-form-group label="E-mail" label-for="userEmail">
            <b-form-input
              class="invision-input"
              id="userEmail"
              v-model="email"
              type="email"
              required
              :disabled="isBusy"
            />
          </b-form-group>
          <b-form-group label="Senha" label-for="userPassword">
            <b-form-input
              class="invision-input"
              id="userPassword"
              v-model="password"
              type="password"
              required
              autocomplete="false"
              :disabled="isBusy"
            />
          </b-form-group>
            <b-row>
              <transition name="fade">
                <b-col class="ml-4 d-flex text-danger" v-if="error">
                  <x-circle-icon class="mr-2" /><div>{{error}}</div>
                </b-col>
                <b-col class="ml-4 d-flex text-success" v-else-if="success">
                  <check-circle-icon class="mr-2" /><div>Sucesso! Redirecionando...</div>
                </b-col>
              </transition>
              <b-col class="text-right">
                <b-btn variant="success" type="submit" class="invision-btn lg" :disabled="isBusy">
                  <div class="d-flex" v-if="!isBusy"><log-in-icon class="mr-2" /><div>Entrar</div></div>
                  <b-row align-v="center" v-else><b-spinner variant="light" label="Entrando" small class="mr-2" /><div>Entrando...</div></b-row>
                </b-btn>
              </b-col>
            </b-row>
        </b-form>
      </div>
  </b-card>
   
    <b-card
    title="Quem Somos!"
    img-top
    tag="article"
    style="max-width: 20rem;"
    class="card"
  >
    <b-card-text>
      Some quick example text to build on the card title and make up the bulk of the card's content.
    </b-card-text>
  </b-card>
  </div>
</template>

<script>

import loginService from '@/services/login';
import { wait } from '@/helpers/common';

export default {
  name: "Login",
  data () {
    return {
      email: '',
      password: '',
      isBusy: false,
      error: '',
      success: false,
    }
  },
  methods: {
    async login () {
      this.isBusy = true;
      this.error = '';
      this.success = false;
      try {
        let sucesso = await loginService.login(this.email, this.password);
        if (sucesso) {
          this.$root.$emit('loginChange');
          this.success = true;
          await wait(1000);
          this.$router.replace(this.$route.params.next || '/');
          this.isBusy = false;
          this.email = '',
          this.password = '',
          this.success = false;
        } else {
          throw new Error('E-mail ou senha inválidos');
        }
      } catch (e) {
        this.isBusy = false;
        this.error = e.toString() || 'Erro desconhecido, por favor tente novamente.';
      }
    },
    logout () {
      loginService.logout();
      this.$root.$emit('loginChange');
    },
    validate () {
      this.isBusy = true;
      if(loginService.isLoggedIn()) {
        this.success = true;
        this.$router.replace(this.$route.params.next || '/');
      } else {
        this.isBusy = false;
      }
    }
  },
};
</script>
<style scoped>
.card-container{
  width: 100%;
  height: 100%;  
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.card{
  background-color: whitesmoke;
  border-radius: 6%;
  box-shadow: -2px 14px 43px -20px rgba(156,156,156,0.49);
}
</style>