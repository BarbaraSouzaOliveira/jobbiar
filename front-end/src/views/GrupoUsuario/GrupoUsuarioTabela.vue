<template>
  <b-table
    responsive
    striped
    hover
    :items="rows"
    :busy="isBusy"
    :fields="fields"
    show-empty
    small
    class="invision-table"
    empty-text="Não existem registros para serem exibidos"
  >
    <template v-slot:table-busy class="text-center my-2">
      <b-spinner class="align-middle"></b-spinner>
      <strong>Carregando...</strong>
    </template>

    <template v-slot:thead-top>
      <tr>
        <th :colspan="Object.keys(fields).length">Permissões</th>
      </tr>
    </template>

    <template v-slot:cell(nome)="data">
      {{data.item.nome}}
      <span :title="data.item.descricao" v-b-tooltip.hover.right.viewport  v-if="data.item.descricao">
        <font-awesome-icon icon="question-circle" />
      </span>
    </template>

    <template v-for="(permissao, index) in permissoes" v-slot:[`head(${permissao.label})`]="">
      {{ permissao.nome || permissao.label }}
      <span v-if="index" :key="permissao.id_permissao" :title="permissao.descricao" v-b-tooltip.hover.right.viewport>
        <font-awesome-icon icon="question-circle"/>
      </span>
    </template>

    <template v-for="(permissao, index) in permissoes" v-slot:[`cell(${permissao.label})`]="data">
      <span :key="index">
        <b-checkbox :checked="data.item[permissao.label].ativo" :disabled="data.item[permissao.label].busy" v-show="!data.item[permissao.label].busy" @input="state=>setPermission(data.item.id_grupo_usuario, data.item[permissao.label], state)" />
        <b-spinner v-show="data.item[permissao.label].busy" small variant="info" class="mini-spinner" />
      </span>
    </template>

    <template v-slot:cell(detalhes)="data">
      <b-link :tabindex="data.index" @click="$emit('editar', data.item.id_grupo_usuario)">Editar</b-link>
    </template>
  </b-table>
</template>

<script>
import swal from "sweetalert";
import RestResourceGrupoUsuario from "@/services/grupoUsuario";
import GenericRestResource from "@/services/genericRequest"

export default {
  props: {
    refreshTable: {
      type: Number,
      default: -1
    },
  },
  watch: {
    async refreshTable() {
      this.isBusy = true;
      this.getGruposUsuarios();
      this.isBusy = false;
    }
  },
  data() {
    return {
      permissoes: [],
      isBusy: false,
      rows: [],
      fields: []
    };
  },
  created() {
    this.atualizaTabela();
  },
  methods: {
    async atualizaTabela () {
      this.isBusy = true;
      try {
        await this.getPermissoes();
        await this.getGruposUsuarios();

        this.fields =  [
          {
            key: 'nome',
            label: 'Nome',
            sortable: false,
          },
          ...this.permissoes.map(el => {
            return {
              key: el.label,
              sortable: false
            }
          }),
          {
            key: 'detalhes',
            label: 'Editar',
            sortable: false
          }
        ]

      } catch (e) {
        this.isBusy = false;
      }
      this.isBusy = false;
    },
    /**
     * getGruposUsuarios: Controle a mudança de páginas
     */
    getGruposUsuarios: function() {
      return RestResourceGrupoUsuario.getAllWithPermissionsWithoutPagination().then(
        result => {
          this.rows = result.rows.map(grupo => {
            let ngrupo = this.permissoes.reduce((acc, p) => {
              acc[p.label] = {
                busy: false,
                label: p.label,
                id_permissao: p.id_permissao,
                ativo: false,
              };
              return acc;
            }, grupo);

            return grupo.permissoes.reduce((acc, p) => {
              acc[p.label].ativo = true;
              return acc;
            }, ngrupo);
          });
        }
      );
    },

    /**
     * getPermissoes: Preenche a informações do grupo do usuário
     */
    getPermissoes: function() {
      return GenericRestResource.getAllWithoutPagination({},'permissao').then(
        result => {
          this.permissoes = result;
        }
      );
    },

    async setPermission(id_grupo_usuario, permissao, ativo) {
      permissao.busy = true;
      const { id_permissao } = permissao;
      try {
        let response = await RestResourceGrupoUsuario.setPermission({
          id_grupo_usuario, id_permissao, ativo,
        });
        permissao.ativo = response.ativo;
      } catch (e) {
        swal({
          title: e.response.status,
          text: e.response.data && e.response.data.error && e.response.data.error.errorMessage || 'Erro desconhecido',
          icon: "error",
        });
        this.atualizaTabela();
      }
      permissao.busy = false;
    }
  }
};
</script>

<style scoped>
.mini-spinner {
  left: -4px;
  top: -2px;
  position: relative;
}
</style>
