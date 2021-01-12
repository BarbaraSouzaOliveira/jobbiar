<template>
<b-container fluid>
  <b-row align-h="between" align-v="center" class="mb-3">
    <b-col class="invision-sub-heading">
        Lista de Grupos de Usuários e Permissões
    </b-col>
    <b-col class="text-right">
      <b-btn
        variant="success"
        class="invision-btn"
        tabindex="1"
        @click="adicionarCadastro"
        v-b-modal.modalCadastro
      >Adicionar</b-btn>
    </b-col>
  </b-row>
  <Tabela @editar="editarCadastro" :refreshTable="refreshTable"></Tabela>
  <b-modal
    size="lg"
    id="modalCadastro"
    ref="modalCadastro"
    :title="modalTitle"
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
    @hidden="clearModal"
  >
    <div v-if="addCadastro">
      <CadastroGrupoUsuario
        ref="cadGrupoUsuario"
        @cancelar="cancelarCadastro"
        @ok="atualizarLista"
      ></CadastroGrupoUsuario>
    </div>
    <div v-if="editCadastro">
      <EditarGrupoUsuario
        :idGrupoUsuarios="idGrupoUsuarios"
        ref="editarGrupoUsuario"
        @cancelar="cancelarCadastro"
        @ok="atualizarLista"
      ></EditarGrupoUsuario>
    </div>
  </b-modal>

  <div class="invision-modal-footer text-right">
    <b-button type="button" variant="dark" class="invision-btn-light lg rounded" @click="$emit('ok')">Fechar</b-button>
  </div>
  </b-container>
</template>

<script>
import Tabela from "@/views/GrupoUsuario/GrupoUsuarioTabela.vue";
import CadastroGrupoUsuario from "@/views/GrupoUsuario/GrupoUsuarioAdicionar.vue";
import EditarGrupoUsuario from "@/views/GrupoUsuario/GrupoUsuarioEditar.vue";

export default {
  data() {
    return {
      modalTitle: "",
      addCadastro: false,
      editCadastro: false,
      idGrupoUsuarios: null,
      refreshTable: 0,
    };
  },
  components: {
    Tabela,
    CadastroGrupoUsuario,
    EditarGrupoUsuario,
  },
  methods: {
    /**
     * clearModal: Limpa as informações do modal
     */
    clearModal: function() {
      this.addCadastro = false;
      this.editCadastro = false;
    },

    /**
     * atualizarLista: Atualiza lista
     */
    atualizarLista: function() {
      this.refreshTable++;
      this.$refs.modalCadastro.hide();
    },

    /**
     * cancelarCadastro: Cancelar cadastro
     */
    cancelarCadastro: function() {
      this.$refs.modalCadastro.hide();
    },

    /**
     * adicionarCadastro: Adiciona cadastro
     */
    adicionarCadastro: function() {
      this.modalTitle = "Cadastro de Grupo de Usuários";
      this.$refs.modalCadastro.show();
      this.addCadastro = true;
    },

    /**
     * editarCadastro: Edita cadastro
     * @param {*} idGrupoUsuarios Primary key de esqueleto
     */
    editarCadastro: function(idGrupoUsuarios) {
      this.idGrupoUsuarios = idGrupoUsuarios;
      this.modalTitle = "Edição de Grupo de Usuários";
      this.$refs.modalCadastro.show();
      this.editCadastro = true;
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
