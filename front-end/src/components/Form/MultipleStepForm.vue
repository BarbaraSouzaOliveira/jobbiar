<template>
  <div>
    <TwoCards sm="3" md="3" lg="3" xl="3">
      <template #header>
        <div class="d-flex">
          <h1 class="align-self-center">{{ title || "Formulário" }}</h1>
        </div>
        <br />
      </template>
      <template #one>
        <StepsList :items="computedPageList" :currentPage="requestAuthentication ? currentPage + 1 : currentPage"/>
      </template>
      <template #two>
        <TemplateBase>
          <slot name="header">
            <div class="d-flex">
              <h1 class="align-self-center">TITULO SECAO</h1>
            </div>
          </slot>
          <form @submit.stop.prevent="onSubmit">
            <div v-if="currentPage === 0">
              <UserAuthentication ref="userAuthentication" @authenticationResult="authenticationResult"/>
            </div>

            <slot
              name="form"
              :validateState="validateState"
              :isBusy="isBusy"
              :currentPage="currentPage"
            />

            <slot name="buttons" :isBusy="isBusy">
              <b-row align-h="between" class="pt-4">
                <b-col>
                  <b-button
                    v-if="!isFirstPage()"
                    type="button"
                    variant="dark"
                    class="invision-btn-light"
                    @click="returnToPreviousPage"
                    :disabled="isBusy"
                  >Voltar</b-button>
                </b-col>
                <b-col class="text-right">
                  <b-button
                    type="button"
                    variant="success"
                    class="invision-btn-light lg"
                    @click="confirmPage"
                    :disabled="isBusy"
                  >{{ numberOfPages === currentPage ? "Finalizar" : "Confirmar" }}</b-button>
                </b-col>
              </b-row>
            </slot>
          </form>
        </TemplateBase>
      </template>
    </TwoCards>
  </div>
</template>

<script>
import { cloneDeep } from "lodash"

import GenericApi from "@/services/genericRequest";

import TwoCards from "@/templates/TwoCards";
import TemplateBase from "@/templates/Base";
import StepsList from "@/components/Form/StepsList";
import UserAuthentication from "@/components/Form/UserAuthentication";

export default {
  components: {
    TwoCards,
    TemplateBase,
    StepsList,
    UserAuthentication
  },

  data() {
    return {
      isBusy: false,

      currentPage: null,
      computedPageList: null,
      numberOfPages: 0,

      loggedInuser: null,
    };
  },

  props: {
    model: {
      type: Object,
      required: false,
    },

    beforeCreate: {
      type: Function,
      required: false
    },
    api: {
      type: Object,
      required: false,
      default() {
        return GenericApi;
      },
    },
    route: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: false,
    },
    pageList: {
      type: Array,
      required: true,
    },

    requestAuthentication: {
      type: Boolean,
      default: false
    }
  },

  created() {
    this.requestAuthentication ? this.currentPage = 0 : this.currentPage = 1;
    this.computedPageList = cloneDeep(this.pageList);

    if (this.requestAuthentication){
      let authenticationPage = {
        title: "Autenticação",
        subItems: [
          { title: "Validar usuário responsável" }
        ]
      };
      this.computedPageList.unshift(authenticationPage);
    }

    this.numberOfPages = 0;
    this.computedPageList.forEach(item => {
      this.numberOfPages += item.subItems.length;
    });
  },

  methods: {
    isFirstPage(){
      return (this.requestAuthentication && this.currentPage === 0) || (!this.requestAuthentication && this.currentPage === 1);
    },

    async returnToPreviousPage() {
      if (this.isFirstPage()) {
        return;
      }

      if(this.requestAuthentication && this.currentPage === 1){
        let cancelConfirmation = await swal({
          title: "Cancelamento de formulário",
          text: "Deseja cancelar o preenchimento do formulário?",
          icon: "warning",
          buttons: { cancel: "Não", confirm: "Sim" },
        });

        if (!cancelConfirmation) return;
        else {
          this.$emit('logOff');
          this.loggedInuser = null;
        };
      }

      this.currentPage--;
    },
    async confirmPage() {
      if (!(await this.validatePageChange())) return;

      if ((this.requestAuthentication && this.currentPage === this.numberOfPages -1 ) || (!this.requestAuthentication && this.currentPage === this.numberOfPages)) {
        if (this.beforeCreate && this.beforeCreate()) this.save();
        return;
      }

      this.currentPage++;
    },
    async save(){
      try {
        let result = await this.api.create(this.model, this.route);

        await swal({
          title: "Bom trabalho!",
          text: "O registro foi criado na base de dados com sucesso!",
          icon: "success",
          button: "Continuar",
        });

        this.currentPage = 1;
        this.$nextTick(() => {
          this.$emit("created");
        });
      } catch (error) {
        console.log(error);
        let errorMessage;
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          errorMessage = error.response.data.error.errorMessage;
        }

        await swal({
          title: "Oops!",
          text:
            errorMessage || "Ocorreu um problema ao tentar criar o registro",
          icon: "error",
          button: "Continuar",
        });
      } finally {
        this.isBusy = false;
      }
    },

    async validatePageChange() {
      if (this.requestAuthentication && this.currentPage === 0){
        return this.authenticateUser();
      }
      let result = await this.$parent.$validator.validateAll();

      for (let ref in this.$parent.$refs) {
        if (ref.startsWith("validate")) {
          result =
            (await this.$parent.$refs[ref].$validator.validateAll()) && result;
          this.$parent.$refs[ref].$forceUpdate();
        }
      }

      return result;
    },
    authenticateUser(){
      return this.$refs.userAuthentication.authenticate();
      
    },
    authenticationResult(user){
      this.$emit("authenticationResult", user);
      this.loggedInuser = user;
    },
    validateState(ref) {
      let veeFields = [];
      for (let key in this.$parent.veeFields) {
        veeFields.push({ ref: "", field: key });
      }

      for (let ref in this.$parent.$refs) {
        if (ref.startsWith("validate")) {
          for (let key in this.$parent.$refs[ref].veeFields) {
            veeFields.push({ ref: ref, field: key });
          }
        }
      }

      let currentField = veeFields.find((field) => field.field == ref);
      if (!currentField) return null;

      let currentComponent;
      if (currentField.ref) {
        currentComponent = this.$parent.$refs[currentField.ref];
      } else {
        currentComponent = this.$parent;
      }

      if (
        currentComponent.veeFields[ref] &&
        document.getElementsByName(ref)[0] &&
        !document.getElementsByName(ref)[0].disabled &&
        (currentComponent.veeFields[ref].dirty ||
          currentComponent.veeFields[ref].validated)
      ) {
        return !currentComponent.veeErrors.has(ref);
      }

      return null;
    },
  },
};
</script>