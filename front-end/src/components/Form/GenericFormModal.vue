<template>
  <div>
    <form @submit.stop.prevent="onSubmit">
      <ul v-if="$validator.errors.all().length > 0" class="alert alert-danger">
        <li
          class="mb-2"
          v-for="error in $validator.errors.all()"
          :key="error.id"
        >
          {{ error }}
        </li>
      </ul>

      <slot :validateState="validateState" :isBusy="isBusy" />
      <slot name="list"></slot>
      <slot name="buttons"></slot>
    </form>
  </div>
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

export default {
  name: "GenericForm",
  props: {
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
      
      try {
        this.isBusy = true;
        const id = this.getIdFromObject(this.model);
        const result = await this.api.getOne(id, this.route);

        this.$emit("updateModel", result);
        this.isBusy = false;
      } catch (error) {
        // eslint-disable-next-line no-undef
        await swal({
          title: "Oops!",
          text: "Ocorreu um problema ao obter o registro",
          icon: "error",
          button: "Continuar...",
        });
      } finally {
        this.isBusy = false;
      }
    }
  },

  methods: {
    
    onSubmit: function (event) {
      if (!this.CAN_WRITE) return show403();
      if (this.isBusy) return;

      this.$parent.$validator.validateAll().then(async (result) => {
        if (!result || this.isBusy) {
          return;
        }

        if (event.submitter.innerText === "Salvar") {
          if (this.editing) {
            this.update();
          } else {
            this.save();
          }
        } else if (event.submitter.innerText === "Excluir") {
          this.exclude();
        }
      });
    },

    save: async function () {
      try {
        if (this.isBusy) {
          return;
        } else {
          this.isBusy = true;
        }

        let result = await this.api.create(this.model, this.route);

        // eslint-disable-next-line no-undef
        await swal({
          title: "Bom trabalho!",
          text: "O registro foi criado na base de dados com sucesso!",
          icon: "success",
          button: "Continuar",
        });

        let id = this.getIdFromObject(result);
        this.$emit("created", id);
      } catch (error) {
        let errorMessage;
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          errorMessage = error.response.data.error.errorMessage;
        }

        // eslint-disable-next-line no-undef
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
        if (this.isBusy) {
          return;
        } else {
          this.isBusy = true;
        }

        let id = this.getIdFromObject(this.model);
        await this.api.update(id, this.model, this.route);

        // eslint-disable-next-line no-undef
        await swal({
          title: "Bom trabalho!",
          text: "O registro foi atualizado com sucesso!",
          icon: "success",
          button: "Continuar",
        });

        this.$emit("updated");
      } catch (error) {
        let errorMessage;
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          errorMessage = error.response.data.error.errorMessage;
        }

        // eslint-disable-next-line no-undef
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

      // eslint-disable-next-line no-undef
      let deleteConfirmation = await swal({
        title: "Excluir",
        text:
          "Tem certeza que deseja excluir o registro?\nEsta ação é definitiva e sem retorno.",
        icon: "warning",
        buttons: { cancel: "Não", confirm: "Sim" },
      });

      if (deleteConfirmation) {
        try {
          this.isBusy = true
          let id = this.getIdFromObject(this.model);
          await this.api.delete(id, this.route);
          
          // eslint-disable-next-line no-undef
          await swal({
            title: "Bom trabalho!",
            text: "O registro foi removido com sucesso!",
            icon: "success",
            button: "Continuar",
          });

          this.$emit("excluded");
        } catch (error) {
          let errorMessage;
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            errorMessage = error.response.data.error.errorMessage;
          }

          // eslint-disable-next-line no-undef
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

    cancel: function () {
      // eslint-disable-next-line no-undef
      swal({
        title: "Cancelamento de formulário",
        text: "Deseja cancelar a edição do formulário?",
        icon: "warning",
        buttons: { cancel: "Não", confirm: "Sim" },
      }).then((value) => {
        if (value) {
           this.$emit("canceled");
        }
      });
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
