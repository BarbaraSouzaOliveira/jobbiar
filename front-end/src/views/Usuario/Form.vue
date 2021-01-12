<template>
  <div>
    <GenericForm 
      title="usuário" 
      previousRoute="usuario" 
      editRoute="usuarioEditar" 
      :model="model" 
      :route="usuarioRoute" 
      :editing="editing" 
      @updateModel="updateModel" 
      idModel="id_usuario" 
      :permissionsToWrite="['rw_usuario']">
      <template v-slot="{ validateState, isBusy }">  
        <b-row>
            <b-col>
              <b-form-group label="Nome*" label-for="nome">
                <b-form-input
                  id="nome"
                  v-model="model.nome"
                  autocomplete="off"
                  class="invision-input"
                  name="nome"
                  :disabled="isBusy"
                  v-validate="{ required: true }"
                  :state="validateState('nome')"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="E-mail*" label-for="email">
                <b-form-input
                  id="email"
                  v-model="model.email"
                  autocomplete="off"
                  class="invision-input"
                  name="email"
                  :disabled="isBusy"
                  v-validate="{ required: true }"
                  :state="validateState('email')"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group label="Senha*" label-for="senha">
                <b-form-input
                  id="senha"
                  v-model="model.senha"
                  autocomplete="off"
                  class="invision-input"
                  name="senha"
                  type="password"
                  :disabled="isBusy"
                  v-validate="{ required: !editing }"
                  :state="validateState('senha')"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Status" label-for="ativo">
                <b-form-checkbox
                  id="ativo"
                  v-model="model.ativo"
                  name="check-button"
                  :disabled="isBusy"
                  switch
                >{{ model.ativo == true ? 'Ativo' : 'Inativo' }}</b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group label="Grupo do usuário*" label-for="grupousuario">
            <b-input-group>
              <GenericSelect
                name="grupo"
                labelKey="nome"
                v-model="model.id_grupo_usuario"
                :route="grupoUsuarioRoute"
                :disabled="isBusy"
                v-validate="'required'"
                :state="validateState('grupo')"
              ></GenericSelect>
              <b-input-group-append>
                <b-button text="button" variant="primary" @click="abrirModalGrupoUsuario">Gerenciar</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
      </template>
    </GenericForm>

    <b-modal
      size="lg"
      id="modalGrupoUsuario"
      ref="modalGrupoUsuario"
      title="Gerenciar grupos de usuários"
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
    >
      <GrupoUsuario
        ref="cadGrupos"
        @ok="fecharModalGrupoUsuario"
      ></GrupoUsuario>
    </b-modal>
  </div>
</template>

<script>
import swal from "sweetalert";

import GenericForm from '@/components/Form/GenericForm';
import GenericSelect from '@/components/Form/GenericSelect';
import GrupoUsuario from "@/views/GrupoUsuario.vue";


export default {
  components: {
    GenericForm,
    GenericSelect,
    GrupoUsuario,
  },

  props: {
    editing: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      model: {
        id_usuario: this.$route.params.id || -1, 
        nome: '',
        email: '',
        senha: '',
        ativo: true,
        id_grupo_usuario: null,
      },
      
      usuarioRoute: "usuario",
      grupoUsuarioRoute: "grupoUsuario"
    }
  },

  methods: {
    updateModel: function (model){
      this.model = model;
    },

    updateSelectedValue: function(selection){
      this.model[selection.key] = selection.value;
    },

    abrirModalGrupoUsuario: function () {
      this.$refs.modalGrupoUsuario.show();
    },

    fecharModalGrupoUsuario: function() {
      this.$refs.modalGrupoUsuario.hide();
    },
  }
};
</script>

<style>
@media (min-width: 1200px) {
  .modal-xl {
    max-width: 1140px !important;
  }
}
</style>