<template>
  <b-container fluid>
    <form @submit.stop.prevent="onSubmit">
      <ul v-if="$validator.errors.all().length >0" class="alert alert-danger">
        <li class="mb-2" v-for="error in $validator.errors.all()" :key="error.id">{{ error }}</li>
      </ul>
      <b-row>
        <b-col>
          <b-form-group
            label="Nome*"
            label-for="nome"
          >
            <b-form-input
              id="nome"
              class="invision-input"
              v-model="model.nome"
              autocomplete="off"
              name="nome"
              v-validate="{ required: true }"
              :state="validateState('nome')"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            label="Descrição"
            label-for="descricao"
          >
            <b-form-input
              id="descricao"
              class="invision-input"
              v-model="model.descricao"
              autocomplete="off"
              name="descrição"
              v-validate="{ required: false }"
              :state="validateState('descrição')"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <div class="invision-modal-footer">
        <b-row align-h="between">
          <b-col>
            <b-button
              type="button"
              variant="dark"
              class="invision-btn-light rounded"
              @click="$emit('cancelar')"
            >Cancelar</b-button>
          </b-col>
          <b-col class="text-right">
            <b-button
              type="submit"
              variant="success"
              class="invision-btn-light lg rounded"
              :disabled="waitSubmit"
            >Salvar</b-button>
          </b-col>
        </b-row>
      </div>
    </form>
  </b-container>
</template>

<script>
import swal from "sweetalert";
import GenericRestResource from "@/services/genericRequest"
import locale from "@/locale";

export default {

  data() {
    return {
      waitSubmit: false,

      model: {
        nome: '',
        descricao: '',
      },
    };
  },

  mounted() {
    this.$validator.localize("pt_BR", locale);
  },

  methods: {
    /**
     * onSubmit: Validação dos campos do form
     */
    onSubmit: function() {
      this.waitSubmit = true;
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.waitSubmit = false;
          return;
        }

        this.saveModel();
      });
    },

    /**
     * validateState: Validação de um campo
     * @param {String} ref Nome do campo
     */
    validateState(ref) {
      if (
        this.veeFields[ref] &&
        !document.getElementsByName(ref)[0].disabled &&
        (this.veeFields[ref].dirty || this.veeFields[ref].validated)
      ) {
        return !this.veeErrors.has(ref);
      }
      return null;
    },

    /**
     * saveModel: Salva as informações na base de dados
     */
    saveModel: function() {
      GenericRestResource.create(
        this.model,'grupoUsuario'
      ).then(
        () => {
          swal({
            title: "Bom trabalho!",
            text:
              "O grupo de usuários foi criado na base de dados com sucesso!",
            icon: "success",
            button: "Continuar..."
          }).then(() => {
            this.waitSubmit = false;
            this.$emit("ok");
          })
        },
        () => {
          swal({
            title: "Oops!",
            text:
              "Ocorreu um problema ao tentar criar o grupo de usuários.",
            icon: "error",
            button: "Continuar..."
          }).then(() => {
            this.waitSubmit = false;
          });
        }
      );
    },
  }
};
</script>
