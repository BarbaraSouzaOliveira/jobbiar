<template>
  <div>
    <GenericTable
      ref="lista"
      name="usuário"
      title="usuários"
      add-route="usuarioAdicionar"
      edit-route="usuarioEditar"
      :cols="['Nome', 'E-mail', 'Último Login', 'Grupo', 'Ativo']"
      :cols-name="['nome', 'email', 'ultimo_login', 'grupo', 'ativo']"
      :cols-map="i => [i.nome, i.email, moment(i.ultimo_login).local().format('DD/MM/YYYY HH:mm:ss'), i.grupo, i.ativo]"
      :route="usuarioRoute"
      :permissionsToWrite="['rw_usuario']"
    >
      <template #Ativo="{ item }">
        <b-btn
          :variant="item.cols[4] ? 'info' : 'warning'"
          class="py-2 rounded"
          @click="toggleActive(item)"
          :disabled="item.busy"
        >
          <b-spinner v-if="item.busy" label="Aguarde" small />
          <check-icon v-else-if="item.cols[4]" class="w20px" />
          <x-icon v-else class="w20px" />
        </b-btn>
      </template>

      <template #botoes>
        <b-button
          class="text-white mr-2 align-self-center"
          variant="primary"
          @click="abrirModalGrupoUsuario"
        >Gerenciar grupos de usuários</b-button>
        <router-link
          :to="{ name: 'usuarioAdicionar'}"
          class="btn btn-success text-white align-self-center"
          data-cy="Adicionar usuário"
        >Adicionar usuário</router-link>
      </template>
    </GenericTable>

    <b-modal
      size="lg"
      id="modalGrupoUsuario"
      ref="modalGrupoUsuario"
      title="Gerenciar grupos de usuários"
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
    >
      <GrupoUsuario ref="cadGrupos" @ok="fecharModalGrupoUsuario"></GrupoUsuario>
    </b-modal>
  </div>
</template>


<script>
import moment from "moment";

import RestResourceUsuario from "@/services/usuario";

import GrupoUsuario from "@/views/GrupoUsuario.vue";

export default {
  components: {
    GrupoUsuario,
  },

  data() {
    return {
      usuarioRoute: "usuario",
    };
  },

  mounted() {
    this.$refs["lista"].update();
  },

  methods: {
    async toggleActive(user) {
      if (typeof user.busy === "undefined") {
        this.$set(user, "busy", false);
      }
      user.busy = true;

      try {
        let { ativo } = await RestResourceUsuario.updateActive(
          user.id,
          !user.cols[4]
        );

        user.cols[4] = ativo;
        this.$refs["lista"].update();
      } catch (error) {
        let errorMessage;
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          errorMessage = error.response.data.error.errorMessage;
        }

        swal({
          title: "Oops!", //e.response.status,
          text: errorMessage || "Ocorreu um problema ao atualizar o registro",
          icon: "error",
        });
      }
      user.busy = false;
    },

    abrirModalGrupoUsuario: function () {
      this.$refs.modalGrupoUsuario.show();
    },

    fecharModalGrupoUsuario: function () {
      this.$refs.modalGrupoUsuario.hide();
    },

    moment(date) {
      return moment(date);
    },
  },
};
</script>
