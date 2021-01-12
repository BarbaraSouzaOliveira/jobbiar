<template>
  <template-base>
    <slot name="header">
      <div class="d-flex">
        <h1 class="align-self-center">{{ editing ? "Edição" : "Adição" }} de {{ title }}</h1>
      </div>
    </slot>
    <form @submit.stop.prevent="onSubmit">
      <ul v-if="$validator.errors.all().length >0" class="alert alert-danger">
        <li class="mb-2" v-for="error in $validator.errors.all()" :key="error.id">{{ error }}</li>
      </ul>

      <slot :validateState="validateState" :isBusy="isBusy" />

      <slot name="buttons" :isBusy="isBusy">
        <b-row align-h="between" class="pt-4">
          <b-col>
            <b-button
              type="button"
              variant="dark"
              class="invision-btn-light"
              :class="editing && exclusionEnabled ? 'rounded left' : ''"
              @click="cancel"
              :disabled="isBusy"
            >Cancelar</b-button>
            <b-button
              v-if="editing && exclusionEnabled"
              type="button"
              variant="danger"
              class="invision-btn-light rounded right"
              @click="exclude"
              :disabled="isBusy"
            >Excluir</b-button>
          </b-col>
          <b-col class="text-right">
            <b-button
              type="submit"
              variant="success"
              class="invision-btn-light lg"
              :disabled="isBusy"
            >Salvar</b-button>
          </b-col>
        </b-row>
      </slot>
    </form>
  </template-base>
</template>

<style scoped>
.feather {
  margin-bottom: 4px;
}
.spacer {
  margin-left: auto;
}
</style>

<script>
import locale from "@/locale";
import loginService from "@/services/login";
import { show403 } from "@/helpers/auth";
import GenericApi from "@/services/genericRequest";

import TemplateBase from "@/templates/Base";

export default {
  name: "GenericForm",
  components: {
    TemplateBase,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    permissionsToWrite: {
      type: Array,
      default() {
        return [];
      },
    },

    model: {
      type: Object,
      required: true,
    },
    idModel: {
      type: String,
      required: true,
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
    editing: {
      type: Boolean,
      default: false,
    },
    exclusionEnabled: {
      type: Boolean,
      default: true,
    },

    previousRoute: {
      type: String,
      required: true,
    },
    editRoute: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      CAN_WRITE: loginService.verifyPermissions(this.permissionsToWrite),
      isBusy: false,
    };
  },

  async created() {
    this.$validator.localize("pt_BR", locale);

    if (this.editing) {
      this.isBusy = true;
      try {
        let id = this.getIdFromObject(this.model);

        let result = await this.api.getOne(id, this.route);

        if (result.deletedAt) {
          this.$router.push({ name: this.previousRoute });
          return;
        }

        this.$emit("updateModel", result);
        this.isBusy = false;
      } catch (error) {
        await swal({
          title: "Oops!",
          text: "Ocorreu um problema ao obter o registro",
          icon: "error",
          button: "Continuar...",
        });

        this.$router.push({ name: this.previousRoute });
      }
    }
  },

  methods: {
    cancel: function () {
      swal({
        title: "Cancelamento de formulário",
        text: "Deseja cancelar a edição do formulário?",
        icon: "warning",
        buttons: { cancel: "Não", confirm: "Sim" },
      }).then((value) => {
        if (value) {
          this.$router.push({ name: this.previousRoute });
        }
      });
    },
    onSubmit: function () {
      if (!this.CAN_WRITE) return show403();
      if (this.isBusy) return;

      this.$parent.$validator.validateAll().then(async (result) => {
        if (!result || this.isBusy) {
          return;
        }
        
        this.isBusy = true;
        this.editing ? this.update() : this.save();
      });
    },

    save: async function () {
      try {
        let result = await this.api.create(this.model, this.route);

        await swal({
          title: "Bom trabalho!",
          text: "O registro foi criado na base de dados com sucesso!",
          icon: "success",
          button: "Continuar",
        });
        
        let id = this.getIdFromObject(result);
        this.$emit("created", id);

        if (this.editRoute || this.previousRoute) {          

          this.$router.replace({
            name: this.editRoute || this.previousRoute,
            params: {
              id: id,
            },
          });
        }
      } catch (error) {
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

    update: async function () {
      try {
        let id = this.getIdFromObject(this.model);

        await this.api.update(id, this.model, this.route);

        await swal({
          title: "Bom trabalho!",
          text: "O registro foi atualizado com sucesso!",
          icon: "success",
          button: "Continuar",
        });
      } catch (error) {
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
            errorMessage ||
            "Ocorreu um problema ao tentar atualizar o registro.",
          icon: "error",
          button: "Continuar",
        });
      } finally {
        this.isBusy = false;
      }
    },

    exclude: async function () {
      if (!this.CAN_WRITE) return show403();
      if (!this.editing || !this.exclusionEnabled || this.isBusy) return;

      let deleteConfirmation = await swal({
        title: "Excluir",
        text:
          "Tem certeza que deseja excluir o registro?\nEsta ação é definitiva e sem retorno.",
        icon: "warning",
        buttons: { cancel: "Não", confirm: "Sim" },
      });

      if (deleteConfirmation) {
        this.isBusy = true;
        try {
          let id = this.getIdFromObject(this.model);
          await this.api.delete(id, this.route);

          await swal({
            title: "Bom trabalho!",
            text: "O registro foi removido com sucesso!",
            icon: "success",
            button: "Continuar",
          });

          this.$router.push({ name: this.previousRoute });
        } catch (error) {
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
              errorMessage ||
              "Ocorreu um problema ao tentar excluir o registro.",
            icon: "error",
            button: "Continuar",
          });
        } finally {
          this.isBusy = false;
        }
      }
    },

    validateState(ref) {
      if (
        this.$parent.veeFields[ref] &&
        document.getElementsByName(ref)[0] &&
        !document.getElementsByName(ref)[0].disabled &&
        (this.$parent.veeFields[ref].dirty ||
          this.$parent.veeFields[ref].validated)
      ) {
        return !this.$parent.veeErrors.has(ref);
      }

      return null;
    },

    getIdFromObject(object) {
      return object[this.idModel];
    },
  },
};
</script>
